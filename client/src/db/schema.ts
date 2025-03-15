import { json, varchar, pgTable, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
	id: varchar().primaryKey(),
	email: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 50 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const formBuilderTable = pgTable("saved-forms", {
	id: varchar().primaryKey(),
	formName: varchar({ length: 50 }).notNull(),
	builderData: json().notNull(),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const formPublishedTable = pgTable("published-forms", {
	id: varchar().primaryKey(),
	formName: varchar({ length: 50 }).notNull(),
	builderData: json().notNull(),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
