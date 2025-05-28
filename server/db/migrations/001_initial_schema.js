import { sql } from 'drizzle-orm';

export async function up(db) {
	await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      tmdb_id TEXT NOT NULL,
      poster_path TEXT,
      release_date TEXT,
      overview TEXT,
      rating INTEGER,
      watch_date TEXT,
      review TEXT,
      genres TEXT,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS watchlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      is_public INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS watchlist_movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      watchlist_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (watchlist_id) REFERENCES watchlists (id) ON DELETE CASCADE,
      FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
    );

    -- Indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_movies_user_id ON movies (user_id);
    CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists (user_id);
    CREATE INDEX IF NOT EXISTS idx_watchlist_movies_watchlist_id ON watchlist_movies (watchlist_id);
    CREATE INDEX IF NOT EXISTS idx_watchlist_movies_movie_id ON watchlist_movies (movie_id);
    CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites (user_id);
    CREATE INDEX IF NOT EXISTS idx_favorites_movie_id ON favorites (movie_id);
  `);
}

export async function down(db) {
	await db.execute(sql`
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS watchlist_movies;
    DROP TABLE IF EXISTS watchlists;
    DROP TABLE IF EXISTS movies;
    DROP TABLE IF EXISTS users;
  `);
}
