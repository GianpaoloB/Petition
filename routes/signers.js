const express = require("express");
const signersRouter = express.Router();
const { hasNotSigned } = require("./middleware");
const db = require("../utils/db");

signersRouter.get("/signers", hasNotSigned, (request, response) => {
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
signersRouter.get("/signers/:city", hasNotSigned, (request, response) => {
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

module.exports = signersRouter;
