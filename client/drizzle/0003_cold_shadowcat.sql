ALTER TABLE "saved-forms" RENAME COLUMN "formName" TO "form_title";--> statement-breakpoint
ALTER TABLE "saved-forms" RENAME COLUMN "builderData" TO "builder_data";--> statement-breakpoint
ALTER TABLE "saved-forms" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "saved-forms" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "published-forms" RENAME COLUMN "formName" TO "form_title";--> statement-breakpoint
ALTER TABLE "published-forms" RENAME COLUMN "builderData" TO "builder_data";--> statement-breakpoint
ALTER TABLE "published-forms" RENAME COLUMN "formExpiry" TO "form_expiry";--> statement-breakpoint
ALTER TABLE "published-forms" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "published-forms" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "saved-forms" ALTER COLUMN "id" SET DATA TYPE text;