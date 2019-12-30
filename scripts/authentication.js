const passport = require("passport");

module.exports = {
  authenticationMiddleware: function() {
    return (req, res, next) => {
      if (!typeof req.session.passport != undefined) {
        console.log(
          `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
        );
        if (req.isAuthenticated()) {
          if(req.route.path === '/'){
            res.redirect("/home");
          }else{
            return next();
          }
        } else {
          res.redirect("/");
        }
      }
    };
  }
};
