-- Movie Reviews table
CREATE TABLE IF NOT EXISTS "movie_reviews" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "is_public" INTEGER DEFAULT 1 NOT NULL,
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE
);
