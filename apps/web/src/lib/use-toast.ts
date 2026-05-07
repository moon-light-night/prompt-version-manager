import * as React from "react";

export type ToastVariant = "default" | "destructive";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: string;
  open: boolean;
}

type Action =
  | { type: "ADD"; toast: ToastItem }
  | { type: "UPDATE"; id: string; opts: Partial<ToastOptions> }
  | { type: "DISMISS"; id: string }
  | { type: "REMOVE"; id: string };

let count = 0;
let memoryState: ToastItem[] = [];

const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const listeners: Array<(state: ToastItem[]) => void> = [];

const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

const reducer = (state: ToastItem[], action: Action): ToastItem[] => {
  switch (action.type) {
    case "ADD":
      return [action.toast, ...state].slice(0, 3);
    case "UPDATE":
      return state.map((t) => (t.id === action.id ? { ...t, ...action.opts } : t));
    case "DISMISS":
      return state.map((t) => (t.id === action.id ? { ...t, open: false } : t));
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export const toast = (opts: ToastOptions) => {
  const id = genId();
  dispatch({ type: "ADD", toast: { id, open: true, ...opts } });
  return {
    id,
    dismiss: () => dispatch({ type: "DISMISS", id }),
    update: (o: Partial<ToastOptions>) => dispatch({ type: "UPDATE", id, opts: o }),
  };
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastItem[]>(memoryState);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) => dispatch({ type: "DISMISS", id }),
    remove: (id: string) =>
      setTimeout(() => dispatch({ type: "REMOVE", id }), 300),
  };
};
