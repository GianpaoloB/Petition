const express = require("express");
const authRouter = express.Router();
const { isLoggedIn } = require("./middleware");
const db = require("../utils/db");
const bc = require("../utils/bc");
////LOGIN
authRouter.get("/login", isLoggedIn, (request, response) => {
  if (request.session.signersId) {
    response.redirect("/petition");
  } else {
    response.render("login", {
      notlogged: true,
      registration: false,
      layout: "main"
    });
  }
});
authRouter.post("/login", isLoggedIn, (request, response) => {
  db.userPassword(request.body.email)
    .then(user => {
      bc.checkPassword(request.body.password, user.rows[0].password)
        .then(data => {
          if (data) {
            request.session.userId = user.rows[0].id;
            request.session.firstName = user.rows[0].first_name;
            request.session.lastName = user.rows[0].last_name;
            response.redirect("/petition");
          } else {
            throw new Error("Whoops!");
          }
        })
        .catch(err => {
          console.log("LOGIN ", err);
          response.render("login", {
            notlogged: true,
            error: true,
            layout: "main"
          });
        });
    })
    .catch(err => {
      console.log("LOGIN ", err);
      response.render("login", {
        notlogged: true,
        error: true,
        layout: "main"
      });
    });
});

////REGISTRATION

authRouter.get("/register", isLoggedIn, (request, response) => {
  if (request.session.signersId) {
    response.redirect("/petition");
  } else {
    response.render("registration", {
      notlogged: true,
      registration: true,
      layout: "main"
    });
  }
});

authRouter.post("/register", isLoggedIn, (request, response) => {
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let email = request.body.email;
  bc.hashPassword(request.body.password)
    .then(pwd => {
      request.session.firstName = firstName;
      request.session.lastName = lastName;
      console.log("Checking the First name in Registration", firstName);
      return db.newUser(firstName, lastName, email, pwd).then(data => {
        request.session.userId = data.rows[0].id;
        response.redirect("/profile");
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

module.exports = authRouter;
