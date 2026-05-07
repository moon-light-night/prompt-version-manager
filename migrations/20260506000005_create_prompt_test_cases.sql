-- migrate:up

CREATE TABLE IF NOT EXISTS prompt_test_cases (
  id              UUID         NOT NULL DEFAULT gen_random_uuid(),
  prompt_id       UUID         NOT NULL,
  name            VARCHAR(255) NOT NULL CHECK (length(trim(name)) > 0),
  input_values    JSONB        NOT NULL DEFAULT '{}',
  expected_output TEXT,
  status          VARCHAR(20)  NOT NULL DEFAULT 'active'
                               CHECK (status IN ('active', 'archived')),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_prompt_test_cases
    PRIMARY KEY (id),
  CONSTRAINT fk_prompt_test_cases_prompt
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
  CONSTRAINT uq_prompt_test_case_name
    UNIQUE (prompt_id, name)
);

CREATE INDEX IF NOT EXISTS idx_ptc_prompt_id_status
  ON prompt_test_cases (prompt_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ptc_input_values
  ON prompt_test_cases USING gin (input_values);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_prompt_test_cases_updated_at'
  ) THEN
    CREATE TRIGGER trg_prompt_test_cases_updated_at
      BEFORE UPDATE ON prompt_test_cases
      FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  END IF;
END;
$$;

-- migrate:down
DROP TRIGGER IF EXISTS trg_prompt_test_cases_updated_at ON prompt_test_cases;
DROP INDEX  IF EXISTS idx_ptc_input_values;
DROP INDEX  IF EXISTS idx_ptc_prompt_id_status;
DROP TABLE  IF EXISTS prompt_test_cases;
