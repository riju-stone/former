import {
  integer,
  jsonb,
  varchar,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

export const formBuilderTable = pgTable("form-builds", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  formName: varchar({ length: 50 }).notNull(),
  builderData: jsonb(),
  createdAt: timestamp({ withTimezone: true }),
  updatedAt: timestamp({ withTimezone: true }),
});

export const formSubmissionTable = pgTable("form-submissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  formName: varchar({ length: 50 }).notNull(),
  formData: jsonb(),
  submittedAt: timestamp({ withTimezone: true }),
});
