import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Define the books table schema
const memes = sqliteTable('memes', {
  id: integer('id').primaryKey(),
  memeId: integer('memeId').unique(),
  description: text('description').notNull(),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(new Date())
});

// Create a type for book records based on the schema
type Meme = typeof memes.$inferSelect;
type NewMeme = typeof memes.$inferInsert;

function isMeme(obj: any): obj is Meme {
  if (typeof (obj.description) === 'string' && typeof (obj.url) === 'string' && typeof (obj.id) === 'number') {
    return true;
  }
  return false;
}

export { memes, isMeme, type Meme, type NewMeme };

