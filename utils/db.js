const spicedPg = require("spiced-pg");

//const db = spicedPg("postgres:gianpaolob:tabasco@localhost:5432/petition");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

exports.addSignature = function addSignature(signature_url, userId) {
    let q =
        "INSERT INTO signatures (signature_url,userid) VALUES ($1,$2) RETURNING id;";
    let params = [signature_url, userId];
    return db.query(q, params);
};

exports.thankUser = function thankUser(id) {
    let q = "SELECT * FROM signatures WHERE id = $1;";
    let params = [id];
    return db.query(q, params);
};

exports.hasSigned = function hasSigned(userId) {
    let q = "SELECT * FROM signatures WHERE userid = $1;";
    let params = [userId];
    return db.query(q, params);
};

exports.getSigners = function getSigners() {
    let q =
        'SELECT users.first_name AS "first_name", users.last_name AS "last_name", user_profiles.age AS "AGE", user_profiles.url AS "Homepage", user_profiles.city AS "City", signatures.userId AS "signed" FROM user_profiles JOIN users ON user_profiles.userId = users.id JOIN signatures ON signatures.userId = users.id;';
    return db.query(q);
};

exports.getSignersCity = function getSignersCity(city) {
    let q = `  SELECT
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
        WHERE LOWER(City) = LOWER($1);`;
    return db.query(q, [city]);
};

exports.newUser = function newUser(firstName, lastName, email, password) {
    let q =
        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1,$2,$3,$4) RETURNING id, first_name, last_name;";
    let params = [
        firstName || null,
        lastName || null,
        email || null,
        password || null
    ];
    return db.query(q, params);
};

exports.profile = function profile(age, city, url, userId) {
    let q =
        "INSERT INTO user_profiles (age, city, url, userId) VALUES ($1,$2,$3,$4);";
    let params = [age, city, url, userId];
    return db.query(q, params);
};

/////LOGIN
exports.userPassword = function userPassword(email) {
    let q = "SELECT * FROM users WHERE email = $1;";
    let params = [email];
    return db.query(q, params);
};
