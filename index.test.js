const { app } = require("./index");
const supertest = require("supertest");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

test("Request to / is successful", () => {
  return supertest(app)
    .get("/")
    .then(res => {
      expect(res.redirect).toBe("/");
    });
});
