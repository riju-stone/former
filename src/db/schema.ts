import { json, varchar, pgTable, timestamp } from "drizzle-orm/pg-core";

export const formBuilderTable = pgTable("form-builds", {
  id: varchar().primaryKey(),
  formName: varchar({ length: 50 }).notNull(),
  builderData: json().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// export const formDraftTable = pgTable("form-drafts", {
//   id: varchar().primaryKey(),
//   formName: varchar({ length: 50 }).notNull(),
//   builderData: json(),
//   createdAt: timestamp({ withTimezone: true }),
//   updatedAt: timestamp({ withTimezone: true }),
// });
//
// export const formSubmissionTable = pgTable("form-submissions", {
//   id: varchar().primaryKey(),
//   formName: varchar({ length: 50 }).notNull(),
//   formData: json(),
//   submittedAt: timestamp({ withTimezone: true }),
// });
