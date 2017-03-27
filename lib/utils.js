var logger = require("./logHelper.js").helper;



//生成错误对象
exports.createApiError = function createApiError (code, msg) {
    var err = new Error(msg);
    err.error_code = code;
    err.error_message = msg;
    return err;
}
