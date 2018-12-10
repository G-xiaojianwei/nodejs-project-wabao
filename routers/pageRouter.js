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

	var result1=[];
	var result=[];

	//得到的是游戏宝箱的个数以及信息
	var promise=new Promise((resolve,reject)=>{
		MongPlayField.find().then((info)=>{
			result1.push(info)
			resolve(result1);
		})
	})
	result.push(promise);

	//得到的是中奖人的信息
	var promise1=new Promise((resolve,reject)=>{
		
		MongPlayAward.find().then((infos)=>{

			var userArr=[];
			var userInfo=new Array();
			if(infos.length==0){
				resolve(userInfo);
				return;
			}
			infos.forEach((item)=>{
				userArr.push(item.userId);
			})
			var s=new Set(...[userArr]);
			userInfo.push(infos)
			//得到了中奖的人
			for(var val of s ){
				//val 得到中奖的人之后，去用户数据库中寻找中奖人的昵称或电话
				MongUserModel.findOne({_id:val}).then((info)=>{
					// console.log(info)
					userInfo.push({"uId":info._id,"uName":info.userName});
					if(userInfo.length===(s.size+1)){
						resolve(userInfo);
						// console.log(userInfo)
					}
					
				})

			}
		})

	})

	result.push(promise1);


	Promise.all(result).then((info)=>{
		//info[0][0] 宝箱信息 
		var newUserInfo=[];
		// console.log(info)
		// console.log(info[0][0])
		// console.log(info[1][0].length)
		for(var i=1;i<info[1].length;i++){
			for(var j=0;j<info[1][0].length;j++){
				if(info[1][i].uId==info[1][0][j].userId){
					newUserInfo.push({"newName":info[1][i].uName,"newSetPrize":info[1][0][j].setPrize,"newPrize":info[1][0][j].prize})
				}
			}
		}
		res.render("play",{
			FieldNum:info[0][0],
			allArr:newUserInfo
		})
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
	res.render("/upgo");
	
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


router.get("/record",(req,res)=>{
	//获取session
	if(!req.session.userId){
		res.send("<script>window.location.href='/page/login';</script>");
		return;
	}
	MongPlayAward.find({userId:req.session.userId}).limit(4).then((info)=>{
		res.render("record",{
			info
		})
	})
})

//导出，暴露接口

module.exports=router;