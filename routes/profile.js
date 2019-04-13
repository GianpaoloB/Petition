const express = require("express");
const profileRouter = express.Router();
const { isLoggedOut } = require("./middleware");
const db = require("../utils/db");
const bc = require("../utils/bc");

profileRouter.get("/profile", isLoggedOut, (request, response) => {
  response.render("profile", {
    layout: "main"
  });
});

profileRouter.post("/profile", isLoggedOut, (request, response) => {
  if (
    request.body.age == "" &&
    request.body.city == "" &&
    request.body.url == ""
  ) {
    response.redirect("/petition");
  } else {
    let age = request.body.age;
    let city = request.body.city;
    var url = request.body.url;
    let userId = request.session.userId;
    if (url != "") {
      if (url.indexOf("http://", 0) != 0 && url.indexOf("https://", 0) != 0) {
        url = "http://" + url;
      }
    }
    console.log("About to insert the profile", age, city, url, userId);
    db.upsertProfile(age, city, url, userId)
      .then(user => {
        response.redirect("/petition");
      })
      .catch(err => {
        console.log("PROFILE ", err);
        response.render("profile", {
          error: true,
          layout: "main"
        });
      });
  }
});

profileRouter.get("/profile/update", isLoggedOut, (request, response) => {
  let id = request.session.userId;
  db.getProfile(id).then(data => {
    console.log(data);
    response.render("update", {
      profile: data.rows[0],
      signatureLink: false,
      layout: "main"
    });
  });
});

profileRouter.post("/profile/update", isLoggedOut, (request, response) => {
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let email = request.body.email;
  let age = request.body.age;
  let city = request.body.city;
  let url = request.body.url;
  let userId = request.session.userId;
  let password = request.body.password;
  if (password == "") {
    console.log("Empty password");
    db.updateUser(firstName, lastName, email, userId)
      .then(
        db.upsertProfile(age, city, url, userId).then(user => {
          request.session.firstName = firstName;
          request.session.lastName = lastName;

          response.redirect("/petition");
        })
      )
      .catch(e => {
        console.log("Error in the update without password", e);
      });
  } else {
    bc.hashPassword(password)
      .then(pwd => {
        db.updateUserPwd(firstName, lastName, email, password, userId).then(
          db.upsertProfile(age, city, url, userId).then(user => {
            response.redirect("/petition");
          })
        );
      })
      .catch(e => {
        console.log("Error in the update WITH password", e);
      });
  }
});
profileRouter.get("/profile/remove", (request, response) => {
  let id = request.session.userId;
  db.removeUser(id).then(() => {
    response.redirect("/logout");
  });
});
module.exports = profileRouter;
