const { app } = require("./index");
const supertest = require("supertest");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

test("Not logged In?? So REGSITER", () => {
  cookieSession.mockSessionOnce({
    userId: null
  });
  return supertest(app)
    .get("/")
    .then(res => {
      expect(res.header.location).toBe("/register");
    });
});

test("Logged In? So go to Petition", () => {
  cookieSession.mockSessionOnce({
    userId: 1
  });
  return supertest(app)
    .get("/login")
    .then(res => {
      expect(res.header.location).toBe("/petition");
    });
});
test("GET Logged In and Signed the Petition? THANKS", () => {
  cookieSession.mockSessionOnce({
    userId: 1,
    signersId: 1
  });
  return supertest(app)
    .get("/petition")
    .then(res => {
      expect(res.header.location).toBe("/thanks");
    });
});
test("POST Logged In and Signed the Petition? THANKS", () => {
  cookieSession.mockSessionOnce({
    userId: 1,
    signersId: 1
  });
  return supertest(app)
    .post("/petition")
    .then(res => {
      expect(res.header.location).toBe("/thanks");
    });
});
test("GET THANKS -> Logged In and NOT Signed the Petition? PETITION!", () => {
  cookieSession.mockSessionOnce({
    userId: 1,
    signersId: null
  });
  return supertest(app)
    .get("/thanks")
    .then(res => {
      expect(res.header.location).toBe("/petition");
    });
});
test("GET SIGNERS -> Logged In and NOT Signed the Petition? PETITION!", () => {
  cookieSession.mockSessionOnce({
    userId: 1,
    signersId: null
  });
  return supertest(app)
    .get("/signers")
    .then(res => {
      expect(res.header.location).toBe("/petition");
    });
});
