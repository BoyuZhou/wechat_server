var logger = require("./logHelper.js").helper;
var path = require('path');
var parseUrl = require('url').parse;
var js2xmlparse = require('js2xmlparser');

//校验身份
exports.authentication = function (req, res, next) {
    var token="sheyuran";
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var echostr   = req.query.echostr;
    var nonce     = req.query.nonce;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = token;
    oriArray.sort();
    var original = oriArray.join('');
    var jsSHA = require('jssha');
    var shaObj = new jsSHA(original, 'TEXT');
    var scyptoString=shaObj.getHash('SHA-1', 'HEX');
    if(signature == scyptoString){
    //验证成功
    next();

    } else {
    //验证失败

    logger.writeErr('验证用户信息失败');
    res.apiError({
        error_code: 400,
        error_message: '验证用户信息失败'
    })
    }
}

//捕获错误
exports.apiErrorHandle = function (err, req, res, next) {
    if( typeof res.apiError === 'function') {
        return res.apiError(err);
    }
    next();
}

//扩展响应api
exports.extendAPIOutput = function (req, res, next) {
    res.xml = function (data) {
        res.setHeader('content-type', 'text/xml');
        res.end(js2xmlparse('data', data));
    }

    function output (data) {
        var type = path.extname(parseUrl(req.url)).pathname;
        switch(type){
            case '.xml':
                return res.xml(data);
            case '.json':
                return res.json(data);
        }
    }
    //响应成功结果
    res.apiSuccess = function (data) {
        res.end({
            status : 'OK',
            result : data
        });
    };

    //响应失败的结果
    res.apiError = function (err) {
        res.end({
            status: 'Error',
            error_code: err.error_code || 'UNKNOW',
            error_message: err.error_message || err.toString()
        });
    }

    next();

}
