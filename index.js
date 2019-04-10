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
app.get("/", (request, response) => {
  response.redirect("/register");
});
app.get("/logout", (request, response) => {
  request.session = null;
  response.redirect("/");
});

app.get("/register", (request, response) => {
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
app.get("/login", (request, response) => {
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
app.get("/delsig", (request, response) => {
  let id = request.session.userId;
  db.removeSignature(id).then(() => {
    request.session.signersId = null;
    response.redirect("/petition");
  });
});
app.get("/profile", (request, response) => {
  response.render("profile", {
    layout: "main"
  });
});
app.get("/remove", (request, response) => {
  let id = request.session.userId;
  db.removeUser(id).then(() => {
    response.redirect("/logout");
  });
});
app.get("/update", (request, response) => {
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
app.get("/petition", (request, response) => {
  if (request.session.userId) {
    let id = request.session.userId;
    db.hasSigned(id)
      .then(data => {
        console.log(
          "In the then after i checked if the user has signed already",
          data
        );
        if (data.rows.length > 0) {
          request.session.signersId = data.rows[0].id;
          response.redirect("/thanks");
        } else {
          response.render("home", {
            layout: "main"
          });
        }
      })
      .catch(e => {
        console.log("error in get petition", e);
      });
  } else {
    response.redirect("/");
  }
});

app.get("/thanks", (request, response) => {
  let id = request.session.signersId;
  let firstName = request.session.firstName;
  let lastName = request.session.lastName;
  db.getSignersNum().then(count => {
    count = count.rows[0].count;
    db.thankUser(id).then(data => {
      personObj = {
        firstName,
        lastName,
        count,
        signature: data.rows[0].signature_url
      };
      response.render("thanks", {
        signatureLink: true,
        person: personObj,
        layout: "main"
      });
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
app.get("/signers/:city", (request, response) => {
  let city = request.params.city;
  db.getSignersCity(city)
    .then(data => {
      console.log(data);
      response.render("signers", {
        city,
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

app.post("/profile", (request, response) => {
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
    if (url.indexOf("http://", 0) != 0 || url.indexOf("https://", 0) != 0) {
      url = "http://" + url;
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

app.post("/update", (request, response) => {
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
app.post("/login", (request, response) => {
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
app.post("/petition", (request, response) => {
  console.log("POST PETITION");
  let signature_url = request.body.signature;
  let userId = request.session.userId;
  db.addSignature(signature_url, userId)
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
////TO AVOID PEOPLE FROM WRITING ODD URLS
app.get("*", (request, response) => {
  console.log("THAT'S A STUPID GET REQUEST!!!");
  response.redirect("/");
});
app.listen(process.env.PORT || 8080, () => ca.rainbow("Petition"));
