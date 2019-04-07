const ca = require("chalk-animation");
const express = require("express");
const app = express();
const db = require("./utils/db");
const bc = require("./utils/bc");
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

////ROUTING
app.get("/", (request, response) => {
    response.redirect("/register");
});
app.get("/register", (request, response) => {
    response.render("registration", {
        layout: "main"
    });
});
app.get("/login", (request, response) => {
    response.render("login", {
        layout: "main"
    });
});
app.get("/petition", (request, response) => {
    if (request.session.userId) {
        let id = request.session.userId;
        db.hasSigned(id).then(data => {
            if (data.rows[0] != []) {
                request.session.signersId = data.rows[0].id;
                response.redirect("/thanks");
            } else {
                response.render("home", {
                    layout: "main"
                });
            }
        });
    } else {
        response.redirect("/");
    }
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
        response.render("thanks", {
            person: personObj,
            layout: "main"
        });
    });
});
app.get("/signers", (request, response) => {
    db.getSigners()
        .then(data => {
            response.render("signers", {
                signersArr: data.rows,
                layout: "main"
            });
        })
        .catch(e => {
            console.log("Error in getting the signers", e);
        });
});
//POST ROUTING
app.post("/register", (request, response) => {
    let firstName = request.body.firstName;
    let lastName = request.body.lastName;
    let email = request.body.email;
    bc.hashPassword(request.body.password)
        .then(pwd => {
            request.session.firstName = firstName;
            request.session.lastName = lastName;
            console.log("Checking the First name in Registration", firstName);
            return db.newUser(firstName, lastName, email, pwd).then(id => {
                request.session.userId = id;
                response.redirect("/petition");
            });
        })
        .catch(err => {
            console.log("hashing an empty password???", err);
            response.render("registration", {
                error: true,
                layout: "main"
            });
        });
});
app.post("/login", (request, response) => {
    db.userPassword(request.body.email)
        .then(user => {
            bc.checkPassword(request.body.password, user.rows[0].password).then(
                data => {
                    request.session.userId = user.rows[0].id;
                    response.redirect("/petition");
                }
            );
        })
        .catch(err => {
            console.log("LOGIN ", err);
            response.render("login", {
                error: true,
                layout: "main"
            });
        });
});
app.post("/petition", (request, response) => {
    console.log("POST PETITION");
    let firstName = request.session.firstName;
    let lastName = request.session.lastName;
    let signature_url = request.body.signature;
    db.addSignature(firstName, lastName, signature_url)
        .then(id => {
            //console.log(id);
            request.session.signersId = id.rows[0].id;
            // SET THE COOKIE
            response.redirect("/thanks");
        })
        .catch(err => {
            console.log("error in addSignature: ", err);
        });

    //how do we query a database from
});

app.listen(8080, () => ca.rainbow("Petition"));
