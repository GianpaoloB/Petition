DROP TABLE IF EXISTS user_profiles;


CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(255),
    url VARCHAR(600),
    userId INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE

);
userId INTEGER NOT NULL UNIQUE

SELECT
  users.first_name AS "first_name",
  users.last_name AS "last_name",
  user_profiles.age AS "AGE",
  user_profiles.url AS "Homepage",
  user_profiles.city AS "City",
  signatures.userId AS "signed"
FROM
  user_profiles
  JOIN users ON user_profiles.userId = users.id
  JOIN signatures ON signatures.userId = users.id;



  SELECT
    users.first_name AS "first_name",
    users.last_name AS "last_name",
    user_profiles.age AS "AGE",
    user_profiles.url AS "Homepage",
    user_profiles.city AS "City",
    signatures.userId AS "signed"
  FROM
    user_profiles
    JOIN users ON user_profiles.userId = users.id
    JOIN signatures ON signatures.userId = user_profiles.userId
    WHERE LOWER(City) = LOWER($1);
