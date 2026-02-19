CREATE TABLE "log" (
	"id" integer PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"description" text
);
