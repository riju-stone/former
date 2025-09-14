import { pgTable, text, json, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const formBuilderTable = pgTable("saved-forms", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  formName: text("form_title").notNull(),
  builderData: json("builder_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const formPublishedTable = pgTable("published-forms", {
  id: varchar().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  formName: text("form_title").notNull(),
  builderData: json("builder_data").notNull(),
  formExpiry: timestamp("form_expiry", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});