"use client";

import { useToast } from "@/lib/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export const Toaster = () => {
  const { toasts, remove } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant, open }) => (
        <Toast
          key={id}
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) remove(id);
          }}
          variant={variant}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
};
