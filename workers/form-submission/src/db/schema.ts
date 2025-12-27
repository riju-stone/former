import { pgTable, text, json, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const formPublishedTable = pgTable("published-forms", {
  id: varchar().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  formName: text("form_title").notNull(),
  builderData: json("builder_data").notNull(),
  formExpiry: timestamp("form_expiry", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const formSubmissionsTable = pgTable("form-submissions", {
  id: varchar().primaryKey(),
  user_email: text("user_email").notNull(),
  formId: text("form_id")
    .notNull()
    .references(() => formPublishedTable.id),
  submissionData: json("submission_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
