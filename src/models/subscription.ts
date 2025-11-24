import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import crypto from "node:crypto";

// Define the books table schema
export const subscriptions = sqliteTable('subscriptions', {
    id: text('id').primaryKey().$default(()=> crypto.randomUUID()),
    endpoint: text("endpoint").notNull().unique(),
    // expirationTime: null,
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    status: text("status").$type<"active" | "inactive" | "expire">().notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .default(new Date())
});

// Create a type for book records based on the schema
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;


