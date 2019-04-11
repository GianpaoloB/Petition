module.exports = {
  isLoggedIn,
  isLoggedOut,
  hasSigned,
  hasNotSigned
};

function isLoggedOut(req, res, next) {
  if (!req.session.userId && req.url != "/register" && req.url != "/login") {
    return res.redirect("/register");
  }
  next();
}

function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/petition");
  }
  next();
}

function hasNotSigned(req, res, next) {
  if (!req.session.signersId) {
    return res.redirect("/petition");
  }
  next();
}

function hasSigned(req, res, next) {
  if (req.session.signersId) {
    return res.redirect("/thanks");
  }
  next();
}
