export const PROMPT_VERSIONS_TABLE = "prompt_versions";

export const LOCK_PROMPT_VERSIONS_BY_PROMPT_ID_SQL =
  "SELECT pg_advisory_xact_lock(hashtext($1))";

export const FIND_VERSIONS_BY_PROMPT_ID_SQL = `
  SELECT * FROM prompt_versions
  WHERE prompt_id = $1
  ORDER BY version_number DESC
`;

export const FIND_VERSION_BY_ID_SQL =
  "SELECT * FROM prompt_versions WHERE id = $1";

export const FIND_NEXT_VERSION_NUMBER_SQL = `
  SELECT COALESCE(MAX(version_number), 0) + 1 AS next_version_number
  FROM prompt_versions
  WHERE prompt_id = $1
`;

export const INSERT_VERSION_SQL = `
  INSERT INTO prompt_versions (prompt_id, version_number, content, variables, label)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
`;