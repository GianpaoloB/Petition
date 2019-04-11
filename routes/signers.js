const express = require("express");
const signersRouter = express.Router();
const { hasSigned } = require("./middleware");
const db = require("../utils/db");

signersRouter.get("/signers", hasSigned, (request, response) => {
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
signersRouter.get("/signers/:city", hasSigned, (request, response) => {
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
