export function extractVariables(content: string): string[] {
  const pattern = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
  const seen = new Set<string>();
  const variables: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    const name = match[1]?.trim();
    if (name !== undefined && !seen.has(name)) {
      seen.add(name);
      variables.push(name);
    }
  }

  return variables;
}

export function substituteVariables(
  content: string,
  values: Record<string, string>,
): string {
  return content.replace(
    /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g,
    (_match, name: string) => values[name.trim()] ?? _match,
  );
}
