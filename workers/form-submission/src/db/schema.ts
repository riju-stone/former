import { pgTable, text, json, timestamp, varchar } from "drizzle-orm/pg-core";

export const formSubmissionsTable = pgTable("form-submissions", {
  id: varchar().primaryKey(),
  user_email: text("user_email").notNull(),
  formId: text("form_id").notNull(),
  submissionData: json("submission_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
