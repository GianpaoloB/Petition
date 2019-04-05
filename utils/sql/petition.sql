DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    signature_url TEXT NOT NULL,
    userId INTEGER
);

-- ALTER TABLE signatures ADD userId INTEGER;
