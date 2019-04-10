DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    signature_url TEXT NOT NULL,
    userId INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
);
-- userId INTEGER REFERENCES users(id) NOT NULL UNIQUE

-- ALTER TABLE signatures ADD userId INTEGER;
