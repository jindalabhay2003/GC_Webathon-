module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else res.redirect("/logout");
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) res.redirect("/profile-page");
    else return next();
  },
  isAdmin: (req, res, next) => {
    if (req.session.isAdmin) return next();
    else res.redirect("/logout");
  },
  notAdmin: (req, res, next) => {
    if (req.session.isAdmin) res.redirect("/request/admin");
    else return next();
  },
};
