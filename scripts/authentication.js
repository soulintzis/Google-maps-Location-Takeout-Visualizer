const passport = require("passport");

module.exports = {
  authenticationMiddlewareAdmin: function() {
    return (req, res, next) => {
      if (!typeof req.session.passport != undefined) {
        if (req.isAuthenticated() && req.user.admin === true) {
          if(req.route.path === '/'){
            res.redirect("/admin_api/admin");
          }else{
            return next();
          }
        } else {
          res.redirect("/login");
        }
      }
    };
  },
  authenticationMiddleware: function() {
    return (req, res, next) => {
      if (!typeof req.session.passport != undefined) {
        console.log(
          `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
        );
        if (req.isAuthenticated() && req.user.admin === false) {
          if(req.route.path === '/'){
            res.redirect("/home");
          }else{
            return next();
          }
        } else {
          res.redirect("/login");
        }
      }
    };
  }
}