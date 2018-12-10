var mongoose=require("mongoose");

//数据结构
var addField=new mongoose.Schema({
	isClick:Boolean,
	prize:String
})

var MongPlayField=mongoose.model("boxs",addField);

module.exports=MongPlayField;
