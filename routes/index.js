var express = require('express');
var router = express.Router();

var util = require('../lib/utils');

/* GET home page. */
router.get('/', util.authentication,function(req, res, next) {
    var echostr   = req.query.echostr;
  res.render({"echostr": echostr});
});

module.exports = router;
