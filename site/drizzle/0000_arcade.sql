CREATE TABLE arcade_runs (
  id TEXT PRIMARY KEY,
  seed INTEGER NOT NULL,
  started_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX arcade_run_age ON arcade_runs(started_at);
--> statement-breakpoint
CREATE TABLE arcade_scores (
  run_id TEXT PRIMARY KEY,
  initials TEXT NOT NULL CHECK (initials GLOB '[A-Z][A-Z][A-Z]'),
  score INTEGER NOT NULL CHECK (score >= 0),
  max_frames INTEGER NOT NULL CHECK (max_frames >= 0),
  finished_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX arcade_score_order ON arcade_scores(score DESC, max_frames DESC, finished_at, run_id);
