var mongoose=require("mongoose");

//数据结构
var addModel=new mongoose.Schema({
	userName:String,
	userPhone:Number,
	userPwd:String
})

var MongUserModel=mongoose.model("user",addModel);

module.exports=MongUserModel;
