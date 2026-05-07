-- migrate:up

CREATE TABLE IF NOT EXISTS prompt_runs (
  id               UUID        NOT NULL DEFAULT gen_random_uuid(),
  test_case_id     UUID        NOT NULL,
  version_id       UUID        NOT NULL,
  actual_output    TEXT        NOT NULL CHECK (length(actual_output) > 0),
  score            SMALLINT    CHECK (score BETWEEN 1 AND 5),
  notes            TEXT,
  latency_ms       INTEGER     CHECK (latency_ms >= 0),
  model            VARCHAR(100),
  status           VARCHAR(20) NOT NULL DEFAULT 'completed'
                               CHECK (status IN ('completed', 'error')),
  ran_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_prompt_runs PRIMARY KEY (id),
  CONSTRAINT fk_prompt_runs_test_case
    FOREIGN KEY (test_case_id) REFERENCES prompt_test_cases(id) ON DELETE CASCADE,
  CONSTRAINT fk_prompt_runs_version
    FOREIGN KEY (version_id)   REFERENCES prompt_versions(id)   ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prompt_runs_test_case_id
  ON prompt_runs (test_case_id, ran_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompt_runs_version_id
  ON prompt_runs (version_id, ran_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompt_runs_score
  ON prompt_runs (score)
  WHERE score IS NOT NULL;

-- migrate:down
DROP INDEX IF EXISTS idx_prompt_runs_score;
DROP INDEX IF EXISTS idx_prompt_runs_version_id;
DROP INDEX IF EXISTS idx_prompt_runs_test_case_id;
DROP TABLE IF EXISTS prompt_runs;
