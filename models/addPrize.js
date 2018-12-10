var mongoose=require("mongoose");

//数据结构
var addPrize=new mongoose.Schema({
	prize:Array,
	setPrize:Array
})

var MongPlayPrize=mongoose.model("prize",addPrize);

module.exports=MongPlayPrize;
