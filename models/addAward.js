var mongoose=require("mongoose");

//数据结构
var addAward=new mongoose.Schema({
	prize:String,
	setPrize:String,
	userId:String,
	date:Date
})

var MongPlayAward=mongoose.model("award",addAward);

module.exports=MongPlayAward;
