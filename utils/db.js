const spicedPg = require("spiced-pg");

//const db = spicedPg("postgres:gianpaolob:tabasco@localhost:5432/petition");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

exports.addSignature = function addSignature(
    first_name,
    last_name,
    signature_url,
    userId
) {
    let q =
        "INSERT INTO signatures (first_name, last_name, signature_url,userid) VALUES ($1,$2,$3,$4) RETURNING id;";
    let params = [first_name, last_name, signature_url, userId];
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
    let q = "SELECT first_name,last_name FROM signatures;";
    return db.query(q, []);
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

exports.userPassword = function userPassword(email) {
    let q = "SELECT * FROM users WHERE email = $1;";
    let params = [email];
    return db.query(q, params);
};
