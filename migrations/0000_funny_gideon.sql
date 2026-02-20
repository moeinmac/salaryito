CREATE TABLE "salaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"paid_at" timestamp with time zone NOT NULL,
	"jalali_year" integer NOT NULL,
	"jalali_month" integer NOT NULL,
	"jalali_day" integer NOT NULL,
	"paid_hour" integer NOT NULL
);
