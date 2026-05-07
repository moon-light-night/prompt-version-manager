-- migrate:up

CREATE TABLE IF NOT EXISTS prompts (
  id          UUID         NOT NULL DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active', 'archived')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_prompts PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_prompts_status_updated_at
  ON prompts (status, updated_at DESC);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_prompts_title_trgm
  ON prompts USING gin (title gin_trgm_ops);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_prompts_updated_at'
  ) THEN
    CREATE TRIGGER trg_prompts_updated_at
      BEFORE UPDATE ON prompts
      FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  END IF;
END;
$$;

-- migrate:down
DROP TRIGGER IF EXISTS trg_prompts_updated_at ON prompts;
DROP INDEX  IF EXISTS idx_prompts_title_trgm;
DROP INDEX  IF EXISTS idx_prompts_status_updated_at;
DROP TABLE  IF EXISTS prompts;
