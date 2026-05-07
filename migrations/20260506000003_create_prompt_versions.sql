-- migrate:up

CREATE TABLE IF NOT EXISTS prompt_versions (
  id             UUID        NOT NULL DEFAULT gen_random_uuid(),
  prompt_id      UUID        NOT NULL,
  version_number INTEGER     NOT NULL CHECK (version_number >= 1),
  content        TEXT        NOT NULL CHECK (length(content) > 0),
  variables      JSONB       NOT NULL DEFAULT '[]',
  label          VARCHAR(255),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_prompt_versions
    PRIMARY KEY (id),
  CONSTRAINT fk_prompt_versions_prompt
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
  CONSTRAINT uq_prompt_version_number
    UNIQUE (prompt_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_prompt_versions_prompt_id_version
  ON prompt_versions (prompt_id, version_number DESC);

CREATE INDEX IF NOT EXISTS idx_prompt_versions_latest
  ON prompt_versions (prompt_id, version_number DESC)
  WHERE version_number >= 1;

CREATE INDEX IF NOT EXISTS idx_prompt_versions_variables
  ON prompt_versions USING gin (variables);

-- migrate:down
DROP INDEX IF EXISTS idx_prompt_versions_variables;
DROP INDEX IF EXISTS idx_prompt_versions_latest;
DROP INDEX IF EXISTS idx_prompt_versions_prompt_id_version;
DROP TABLE IF EXISTS prompt_versions;
