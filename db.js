const spicedPg = require("spiced-pg");

//const db = spicedPg("postgres:gianpaolob:tabasco@localhost:5432/petition");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

exports.addSignature = function addSignature(
    first_name,
    last_name,
    signature_url
) {
    let q =
        "INSERT INTO signatures (first_name, last_name, signature_url) VALUES ($1,$2,$3) RETURNING id, first_name, last_name;";
    let params = [first_name, last_name, signature_url];

    return db.query(q, params);
};

exports.thankUser = function thankUser(id) {
    let q = "SELECT * FROM signatures WHERE id = $1;";
    let params = [id];
    return db.query(q, params);
};
