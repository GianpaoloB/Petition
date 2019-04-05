const express = require("express");
const app = express();
const db = require("./db");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const csurf = require("csurf");

var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(
    cookieSession({
        maxAge: 1000 * 60 * 60 * 24 * 14,
        secret: "I am always angry."
    })
);
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(csurf());
app.use(function(request, response, next) {
    response.setHeader("x-frame-options", "DENY");
    response.locals.csrfToken = request.csrfToken();
    next();
});
app.get("/petition", (request, response) => {
    //request.session.sigId = SOMETHING TO DISCOVER;
    response.render("home", {
        layout: "main"
    });
});

app.get("/thanks", (request, response) => {
    let id = request.session.signersId;
    let firstName = request.session.firstName;
    let lastName = request.session.lastName;
    console.log(request.session.signersId);
    db.thankUser(id).then(data => {
        personObj = {
            firstName,
            lastName,
            signature: data.rows[0].signature_url
        };
        console.log("my query", data);
        response.render("thanks", {
            person: personObj,
            layout: "main"
        });
    });
});
app.get("/signers", (request, response) => {});

app.post("/petition", (request, response) => {
    console.log("POST PETITION");
    let firstName = request.body.firstName;
    let lastName = request.body.lastName;
    let signature_url = request.body.signature;
    db.addSignature(firstName, lastName, signature_url)
        .then(id => {
            //console.log(id);
            request.session.signersId = id.rows[0].id;
            request.session.firstName = id.rows[0].first_name;
            request.session.lastName = id.rows[0].last_name;
            // SET THE COOKIE
            response.redirect("/thanks");
        })
        .catch(err => {
            console.log("error in addSignature: ", err);
        });

    //how do we query a database from
});

app.listen(8080, () => console.log("Petition"));
