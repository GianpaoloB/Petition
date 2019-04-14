const express = require("express");
const petitionRouter = express.Router();
const { hasSigned, hasNotSigned } = require("./middleware");
const db = require("../utils/db");

petitionRouter.get("/petition", hasSigned, (request, response) => {
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
});

petitionRouter.post("/petition", hasSigned, (request, response) => {
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

petitionRouter.get("/thanks", hasNotSigned, (request, response) => {
  let id = request.session.signersId;
  let firstName = request.session.firstName;
  let lastName = request.session.lastName;
  db.getSignersNum()
    .then(count => {
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
    })
    .catch(err => {
      console.log("The thank you page is giving problem", err);
      response.redirect("logout");
    });
});

petitionRouter.get("/petition/unsign", hasNotSigned, (request, response) => {
  let id = request.session.userId;
  db.removeSignature(id).then(() => {
    request.session.signersId = null;
    response.redirect("/petition");
  });
});

module.exports = petitionRouter;
