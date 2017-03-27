var express = require('express');
var router = express.Router();
var jsSHA = require('jssha');
var xml=require('node-xml');
var util = require('../lib/utils');
/*
<xml>
<ToUserName><![CDATA[toUser]]></ToUserName> //开发者微信号
<FromUserName><![CDATA[fromUser]]></FromUserName> //发送者账号
<CreateTime>1348831860</CreateTime> //消息创建时间
<MsgType><![CDATA[text]]></MsgType> //text
<Content><![CDATA[this is a test]]></Content> //文本消息内容
<MsgId>1234567890123456</MsgId> //消息id，64位整型
</xml>
*/


/* GET users listing. */
router.get('/',util.authentication, function(req, res, next) {

    var post_data="";
    req.on("data",function(data){post_data=data;});
    req.on("end",function(){
    var xmlStr=post_data.toString('utf-8',0,post_data.length);
    //解析消息代码

    // 定义解析存储变量
var ToUserName="";
var FromUserName="";
var CreateTime="";
var MsgType="";
var Content="";
var tempName="";
//开始解析消息
var parse=new xml.SaxParser(function(cb){
    cb.onStartElementNS(function(elem,attra,prefix,uri,namespaces){
         tempName=elem;
    });
    cb.onCharacters(function(chars){
        chars=chars.replace(/(^\s*)|(\s*$)/g, "");
        if(tempName=="CreateTime"){
            CreateTime=chars;
        }
    });
    cb.onCdata(function(cdata){
            if(tempName=="ToUserName"){
                ToUserName=cdata;
            }else if(tempName=="FromUserName"){
                FromUserName=cdata;
            }else if(tempName=="MsgType"){
                MsgType=cdata;
            }else if(tempName=="Content"){
                Content=cdata;
            }
            console.log(tempName+":"+cdata);
        });
   cb.onEndElementNS(function(elem,prefix,uri){
         tempName="";
   });
   cb.onEndDocument(function(){
          //按收到的消息格式回复消息
   });
});
 parse.parseString(xmlStr);


    //回发消息代码
    CreateTime=parseInt(new Date().getTime() / 1000);
    var msg="";
    if(MsgType=="text"){
       msg="谢谢关注,你说的是:"+Content;
       //组织返回的数据包
       var sendMessage='<xml><ToUserName><![CDATA['+FromUserName+']]></ToUserName><FromUserName><![CDATA['+ToUserName+']]></FromUserName><CreateTime>'+CreateTime+'</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA['+msg+']]></Content></xml>';
        res.send(sendMessage);
    }

    })

});

module.exports = router;
