const ca = require("chalk-animation");
const express = require("express");
const app = (module.exports.app = express());
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const csurf = require("csurf");

const {
  isLoggedIn,
  isLoggedOut,
  hasSigned,
  hasNotSigned
} = require("./routes/middleware");

var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secret: process.env.SESSION_SECRET || "I am always angry."
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
app.use(isLoggedOut);
app.get("/", (request, response) => {
  response.redirect("/register");
});
app.get("/logout", (request, response) => {
  request.session = null;
  response.redirect("/");
});

app.use(require("./routes/auth"));
app.use(require("./routes/profile"));
app.use(require("./routes/petition"));
app.use(require("./routes/signers"));

////TO AVOID PEOPLE FROM WRITING ODD URLS
app.get("*", (request, response) => {
  console.log("THAT'S A STUPID GET REQUEST!!!", request.params);
  response.redirect("/");
});
if (require.main == module) {
  app.listen(process.env.PORT || 8080, () => ca.rainbow("Petition"));
}
