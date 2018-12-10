//引入express
var express=require("express");
var MongPlayField=require("../models/addField.js");
var MongUserModel=require("../models/addUser.js");
var MongPlayPrize=require("../models/addPrize.js");
var MongPlayAward=require("../models/addAward.js");
var router=express.Router();

//登录页面
router.get("/login",(req,res)=>{
	res.render("login");
})

//登录注册
router.get("/reg",(req,res)=>{
	res.render("reg");
})

//管理员页面

router.get("/admin",(req,res)=>{

	//查询田块
	MongPlayField.find().then((infos)=>{

		// console.log(infos.length)
		
		//查询奖项
		MongPlayPrize.find().then((info)=>{
					res.render("admin",{
						FieldNum:infos.length,
						setPrize:info[0].setPrize,
						prize:info[0].prize
					});
		})
		
	})
})

//主页面
router.get("/index",(req,res)=>{
	//判断登录状态
	if(req.session.userId){
			MongUserModel.findOne({_id:req.session.userId}).then((info)=>{
			res.render("index",{
				user:info
			});
			})
			
	}else{
		res.send("<script>window.location.href='/page/login';</script>");
	}
	
})

// 游戏页面
router.get("/play",(req,res)=>{
	if(!req.session.userId){
		res.send("<script>alert('请您重新登录');window.location.href='/page/login';</script>");
	}
	MongPlayField.find().then((info)=>{
		res.render("play",{
			FieldNum:info
		});
	})
})

// 个人中心页
router.get("/userInfo",(req,res)=>{
	if(!req.session.userId){
		res.send("<script>alert('请您重新登录');window.location.href='/page/login';</script>");
	}
	res.render("userInfo")
})

//奖品信息播报页
router.get("/upgo",(req,res)=>{
	var infoArr=[];
	var result=[];
	//查询奖品数据库，把获奖名单发出来
	
		// ne.forEach((item)=>{

		// 	infoArr.push(item);
		// })

		MongPlayAward.find().then((infos)=>{
			infos.forEach((item)=>{
				var promise=new Promise((resolve,reject)=>{
				//开始
				MongUserModel.find({_id:item.userId}).then((info)=>{
					infoArr.push({"uName":info[0].userName,"uPrize":item.prize,"uSetPrize":item.setPrize})
					resolve(infoArr);
			})
		})
		result.push(promise);
		
	})
			Promise.all(result).then((info)=>{
				res.render("upgo",{
					allArr:info[info.length-1]
				})
			});
	})	
	
})


router.get("/list",(req,res)=>{
	//查询中奖人数
	var listNum=new Array();
	var list=[];
	MongPlayAward.find().then((info)=>{
		//从数据库里面取出来，得出所有的数据
		info.forEach((item)=>{
			list.push(item.userId);
		})
		
		//得到用户，及用户的奖品个数
		list.forEach((item)=>{
			if(listNum[item]==undefined){
				listNum[item]=1;
			}else{
				listNum[item]++;
			}

		})
		//把用户的id改为用户的昵称
		//先得到那两个唯一的id
		var newList=[];
		var row=[];
		var a=new Set(list);
		var newName;
		for(var attr in listNum){
			var promise1=new Promise((resolve,reject)=>{
					MongUserModel.find({_id:attr}).then((info)=>{
					newName=info;
					resolve(newName);
				})
				})
				row.push(promise1)
			}
		Promise.all(row).then((info)=>{
			var best=[];
			info.forEach((item)=>{

				for(var val in listNum){
					if(val==item[0]._id){
						best.push({"aName":item[0].userName,"aNum":listNum[val]})
					}
				}
				
			})
			for(var i=0;i<best.length;i++){
					var temp;
					if(best[i].aNum<best[i+1].aNum){
						temp=best[i];
						best[i]=best[i+1];
						best[i+1]=temp;
					}
					res.render("list",{best})
			}
		})
			
	})

})

//导出，暴露接口

module.exports=router;