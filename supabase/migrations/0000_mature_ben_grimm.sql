CREATE TABLE "counters" (
	"id" text PRIMARY KEY NOT NULL,
	"value" integer DEFAULT 0 NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
