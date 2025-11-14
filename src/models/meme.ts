import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Define the books table schema
export const memes = sqliteTable('memes', {
  id: integer('id').primaryKey(),
  description: text('description').notNull(),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(new Date())
});

// Create a type for book records based on the schema
export type Meme = typeof memes.$inferSelect;
export type NewMeme = typeof memes.$inferInsert;


