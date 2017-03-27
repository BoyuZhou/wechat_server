var express = require('express');
var router = express.Router();

var middleware = require('../lib/middleware');

/* GET home page. */
router.get('/', middleware.authentication,function(req, res, next) {
    var echostr   = req.query.echostr;
  res.render({"echostr": echostr});
});

module.exports = router;
