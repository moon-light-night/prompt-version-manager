-- migrate:up

CREATE TABLE IF NOT EXISTS tags (
  id         UUID         NOT NULL DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  color      VARCHAR(7)   CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_tags PRIMARY KEY (id),
  CONSTRAINT uq_tags_name UNIQUE (name)
);

CREATE INDEX IF NOT EXISTS idx_tags_name
  ON tags (lower(name));

CREATE TABLE IF NOT EXISTS prompt_tags (
  prompt_id  UUID NOT NULL,
  tag_id     UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pk_prompt_tags
    PRIMARY KEY (prompt_id, tag_id),
  CONSTRAINT fk_prompt_tags_prompt
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
  CONSTRAINT fk_prompt_tags_tag
    FOREIGN KEY (tag_id)    REFERENCES tags(id)    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prompt_tags_tag_id
  ON prompt_tags (tag_id);

-- migrate:down
DROP INDEX IF EXISTS idx_prompt_tags_tag_id;
DROP TABLE IF EXISTS prompt_tags;
DROP INDEX IF EXISTS idx_tags_name;
DROP TABLE IF EXISTS tags;
