export type DiffLineType = "unchanged" | "added" | "removed";

export interface DiffLine {
  type: DiffLineType;
  content: string;
  lineNumber: number | null;
}

export interface DiffResult {
  lines: DiffLine[];
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
}

export function diffStrings(oldText: string, newText: string): DiffResult {
  const oldLines = oldText === "" ? [] : oldText.split("\n");
  const newLines = newText === "" ? [] : newText.split("\n");
  if (oldLines.length === 0 && newLines.length === 0) {
    return { lines: [], addedCount: 0, removedCount: 0, unchangedCount: 0 };
  }

  const prefixLength = getCommonPrefixLength(oldLines, newLines);
  const suffixLength = getCommonSuffixLength(oldLines, newLines, prefixLength);

  const oldCoreEnd = oldLines.length - suffixLength;
  const newCoreEnd = newLines.length - suffixLength;

  const oldCore = oldLines.slice(prefixLength, oldCoreEnd);
  const newCore = newLines.slice(prefixLength, newCoreEnd);

  const builder = createDiffBuilder();

  for (let i = 0; i < prefixLength; i++) {
    builder.pushUnchanged(oldLines[i] ?? "", i + 1);
  }

  appendCoreDiff(oldCore, newCore, prefixLength, builder);

  for (let i = 0; i < suffixLength; i++) {
    const oldIndex = oldCoreEnd + i;
    const newIndex = newCoreEnd + i;
    builder.pushUnchanged(oldLines[oldIndex] ?? "", newIndex + 1);
  }

  return builder.build();
}

interface DiffBuilder {
  pushUnchanged: (content: string, lineNumber: number) => void;
  pushAdded: (content: string, lineNumber: number) => void;
  pushRemoved: (content: string) => void;
  build: () => DiffResult;
}

const createDiffBuilder = (): DiffBuilder => {
  const lines: DiffLine[] = [];
  let addedCount = 0;
  let removedCount = 0;
  let unchangedCount = 0;

  return {
    pushUnchanged(content, lineNumber) {
      unchangedCount++;
      lines.push({ type: "unchanged", content, lineNumber });
    },
    pushAdded(content, lineNumber) {
      addedCount++;
      lines.push({ type: "added", content, lineNumber });
    },
    pushRemoved(content) {
      removedCount++;
      lines.push({ type: "removed", content, lineNumber: null });
    },
    build() {
      return { lines, addedCount, removedCount, unchangedCount };
    },
  };
};

const getCommonPrefixLength = (a: string[], b: string[]): number => {
  const limit = Math.min(a.length, b.length);
  let index = 0;
  while (index < limit && a[index] === b[index]) {
    index++;
  }
  return index;
};

const getCommonSuffixLength = (
  a: string[],
  b: string[],
  prefixLength: number,
): number => {
  const maxSuffix = Math.min(a.length, b.length) - prefixLength;
  let suffix = 0;

  while (
    suffix < maxSuffix &&
    a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
  ) {
    suffix++;
  }

  return suffix;
};

const appendCoreDiff = (
  oldCore: string[],
  newCore: string[],
  newLineOffset: number,
  builder: DiffBuilder,
) => {
  if (oldCore.length === 0) {
    for (let i = 0; i < newCore.length; i++) {
      builder.pushAdded(newCore[i] ?? "", newLineOffset + i + 1);
    }
    return;
  }

  if (newCore.length === 0) {
    for (let i = 0; i < oldCore.length; i++) {
      builder.pushRemoved(oldCore[i] ?? "");
    }
    return;
  }

  const newLineSet = new Set(newCore);
  let hasOverlap = false;
  for (const oldLine of oldCore) {
    if (newLineSet.has(oldLine)) {
      hasOverlap = true;
      break;
    }
  }

  if (!hasOverlap) {
    for (let i = 0; i < oldCore.length; i++) {
      builder.pushRemoved(oldCore[i] ?? "");
    }
    for (let i = 0; i < newCore.length; i++) {
      builder.pushAdded(newCore[i] ?? "", newLineOffset + i + 1);
    }
    return;
  }

  appendLcsCoreDiff(oldCore, newCore, newLineOffset, builder);
};

const appendLcsCoreDiff = (
  oldCore: string[],
  newCore: string[],
  newLineOffset: number,
  builder: DiffBuilder,
) => {
  const m = oldCore.length;
  const n = newCore.length;

  const directions = new Uint8Array(m * n);
  let previous = new Uint32Array(n + 1);
  let current = new Uint32Array(n + 1);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const directionIndex = (i - 1) * n + (j - 1);
      const diagonal = previous[j - 1] ?? 0;
      const up = previous[j] ?? 0;
      const left = current[j - 1] ?? 0;

      if (oldCore[i - 1] === newCore[j - 1]) {
        current[j] = diagonal + 1;
        directions[directionIndex] = 0;
      } else if (up >= left) {
        current[j] = up;
        directions[directionIndex] = 1;
      } else {
        current[j] = left;
        directions[directionIndex] = 2;
      }
    }

    [previous, current] = [current, previous];
    current.fill(0);
  }

  const reversed: DiffLine[] = [];
  let oi = m;
  let ni = n;

  while (oi > 0 && ni > 0) {
    const direction = directions[(oi - 1) * n + (ni - 1)] ?? 1;

    if (direction === 0) {
      reversed.push({
        type: "unchanged",
        content: oldCore[oi - 1] ?? "",
        lineNumber: newLineOffset + ni,
      });
      oi--;
      ni--;
    } else if (direction === 1) {
      reversed.push({
        type: "removed",
        content: oldCore[oi - 1] ?? "",
        lineNumber: null,
      });
      oi--;
    } else {
      reversed.push({
        type: "added",
        content: newCore[ni - 1] ?? "",
        lineNumber: newLineOffset + ni,
      });
      ni--;
    }
  }

  while (oi > 0) {
    reversed.push({
      type: "removed",
      content: oldCore[oi - 1] ?? "",
      lineNumber: null,
    });
    oi--;
  }

  while (ni > 0) {
    reversed.push({
      type: "added",
      content: newCore[ni - 1] ?? "",
      lineNumber: newLineOffset + ni,
    });
    ni--;
  }

  for (let index = reversed.length - 1; index >= 0; index--) {
    const line = reversed[index];
    if (!line) continue;

    if (line.type === "unchanged") {
      builder.pushUnchanged(line.content, line.lineNumber ?? 1);
    } else if (line.type === "added") {
      builder.pushAdded(line.content, line.lineNumber ?? 1);
    } else {
      builder.pushRemoved(line.content);
    }
  }
};
