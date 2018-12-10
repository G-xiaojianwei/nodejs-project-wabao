var express=require("express");
var multer=require("multer");
var fs=require("fs");
var MongUserModel=require("../models/addUser.js");
var MongPlayField=require("../models/addField.js");
var MongPlayPrize=require("../models/addPrize.js");
var MongPlayAward=require("../models/addAward.js");
var encry=require("../src/base.js");
var router=express.Router();

//设置上传文件的目录
var upload=multer({dest:"public/uploads/"});

//注册功能
router.post("/addUser",(req,res)=>{
	// console.log(req.body);
	console.log(req.body)
	//添加数据
	var userName=req.body.user;
	var userPhone=req.body.phone;
	var userPwd=encry(req.body.pwd);
	var userPwd1=req.body.pwd;
	var userPwd2=req.body.pwd2;
	var reg=/^[\u4E00-\u9FA5A-Za-z0-9_]+$/;//昵称正则
	var reg1=/^(\+86|0086)?\s*1[34578]\d{9}$/;//手机正则
	var reg2=/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;//验证密码
	//验证
	if(!reg.test(userName) || !reg1.test(userPhone) || !reg2.test(userPwd1) || userPwd1 !== userPwd2){
		res.send("<script>alert('添加失败');window.location.href='/page/reg';</script>");
	}
		MongUserModel({
			userName,
			userPhone,
			userPwd		
		}).save().then((info)=>{
			if(info){
				res.send("<script>alert('添加成功');window.location.href='/page/login';</script>");
			}else{
				res.send("<script>alert('添加失败');window.location.href='/page/reg';</script>");
			}
		})
	console.log(userName,userPhone,userPwd)
})

//登录功能
router.post("/loginUser",(req,res)=>{
	var loginPhone=req.body.phone;
	var loginPwd=encry(req.body.pwd);
	MongUserModel.findOne({userPhone:loginPhone,userPwd:loginPwd}).then((info)=>{
		if(info){
			//设置登录状态
			req.session.userId=info._id;

			res.send("<script>alert('登录成功');window.location.href='/page/index';</script>");
		}else{
			res.send("<script>alert('登录失败');window.location.href='/page/login';</script>");
		}
	})
})
//退出功能
router.get("/logOut",(req,res)=>{
	req.session.destroy();
	res.send("<script>window.location.href='/page/login';</script>");
})


//上传文件功能
router.post("/upload",upload.single("file"),(req,res)=>{
	//console.log(req.file)
	//得到了数据，为其重新命名

	fs.rename( req.file.path , req.file.destination+req.session.userId+".jpg",()=>{
		res.send("<script>alert('上传成功');window.location.href='/page/userInfo';</script>")
	});

})

//添加田地功能
router.post("/addBox",(req,res)=>{
	// console.log(req.body)
	//思想：把数据库里面的个数删除重写
	//保存数据
	var count=req.body.field;
	console.log()
	//新数组
	var result=[req.body];
	MongPlayField.remove({}).then(()=>{
		for(var i=0;i<count;i++){
			//使用promise
			var promise=new Promise((resolve,reject)=>{
				//进行增加
				MongPlayField({
					isClick:false
				}).save().then((info)=>{
				resolve();
				});
			});
			result.push(promise);
		}

		Promise.all(result).then((info)=>{
			res.send({"code":0}); //表示成功
		});
	});
});

//点击挖出田地
router.get("/winning",(req,res)=>{
	var bid=req.query.bid;
	MongPlayField.update({_id:bid},{$set:{isClick:true}}).then((info)=>{
		if(info){
			//当用户点击的时候，通过概率随机产生奖品发送过去
			//产生一个随机数
			//获取奖品
			MongPlayPrize.find().then((info)=>{
				var oneSetArr=new Array();
				var twoSetArr=new Array();
				var threeSetArr=new Array();
				info[0].prize.forEach((item)=>{
					if(item.selectName=="一等奖"){
						oneSetArr.push(item.prize);
					}else if(item.selectName=="二等奖"){
						twoSetArr.push(item.prize);
					}else if(item.selectName=="三等奖"){
						threeSetArr.push(item.prize);
					}
					
				})
				var randomNum=Math.random();//得到o-1;
				if(randomNum<=0.01){
					//一等奖
					//产生随机数
					var rand=parseInt(Math.random()*(oneSetArr.length-1));//得到o-1;
					oneSetArr[rand];
					// console.log(oneSetArr,rand);
					res.send({"code":0 ,"prize":oneSetArr[rand],"setPrize":"一等奖"});
				}else if(randomNum>0.01 && randomNum<=0.11){
					//二等奖
					var rand=parseInt(Math.random()*(twoSetArr.length-1));//得到o-1;
					// console.log(twoSetArr,rand);
					res.send({"code":0 ,"prize":twoSetArr[rand],"setPrize":"二等奖"});
				}else if(randomNum>0.11 && randomNum<=0.31){
					//三等奖
					var rand=parseInt(Math.random()*(threeSetArr.length-1));//得到o-1;
					// console.log(threeSetArr,rand);
					res.send({"code":0 ,"prize":threeSetArr[rand],"setPrize":"三等奖"});
				}else{
					//无奖
					res.send({"code":0,"prize":"无","setPrize":"无"});
					console.log("无");
				}
			})
			
		}
	})
})

//设置奖项
router.post("/setPrize",(req,res)=>{
	var setPrize=req.body.setPrize;
	MongPlayPrize.findOne().then((info)=>{
		
		if(info){
			//第一次之后的
			// console.log(info.prize)
			info.setPrize.push(setPrize)
			var newSetPrize = new Set(info.setPrize)
			// console.log(newPrize)
			MongPlayPrize.update({},{$set:{setPrize:[...newSetPrize]}}).then((info)=>{
				res.send({"code":0})
			})
		}else{
			//第一次创建表单
			MongPlayPrize({
				setPrize:[setPrize]
			}).save().then((info)=>{
				res.send({"code":0})
			})
		}
	})
	

})


//添加奖品
router.post("/addPrize",(req,res)=>{
	// console.log(req.body)
	var prize=req.body.prize;
	var selectName=req.body.selectName;

	MongPlayPrize.findOne().then((info)=>{
			//判断prize里面是否有值
			if(info.prize.length===0){
				MongPlayPrize.update({},{$set:{prize:req.body}}).then((info)=>{
					if(info){
						res.send({"code":0})
					}
				})
			}else{
				var newP=[];
				//先判断里面有没有相同的
				info.prize.forEach((item)=>{
						newP.push(item.prize);
				})
				const set = new Set(newP);
				//如果找不到同的，就添加
				if(!set.has(prize)){
					info.prize.push(req.body);
					MongPlayPrize.update({},{$set:{prize:info.prize}}).then((info)=>{
						if(info){
						res.send({"code":0})
					}
					})
				}else{
					res.send({"code":1})
				}


				
			}
	})
		// res.send({"code":0});
})

//删除奖品
router.post("/deletePrize",(req,res)=>{

	var deletePrize=req.body.deletePrize;
	console.log(deletePrize)
	MongPlayPrize.find().then((info)=>{
		var newDelete=[];
		info[0].prize.forEach((item)=>{
			if(item.prize!==deletePrize){
				newDelete.push(item);
			}
		})
			MongPlayPrize.update({},{$set:{prize:newDelete}}).then((info)=>{
				if(info){
				res.send({"code":0})
			}
		})
	})
})


//中奖用户及奖品存放
router.post("/award",(req,res)=>{
	var date = new Date();
	date.setHours(date.getHours()+8);
	if(req.session.userId){
		MongPlayAward({
			prize:req.body.data.prize,
			setPrize:req.body.data.setPrize,
			userId:req.session.userId,
			date:date.toLocaleString()
	}).save().then((info)=>{
		if(info){
			res.send({"code":0})
		}
	})
	}
	
})

router.post("/record",(req,res)=>{
	console.log(req.body.reDate)
	if(!req.session.userId){
		res.send("<script>window.location.href='/page/login';</script>");
		return;
	}
	var	beforeNum=(req.body.reDate-1)*4;
	var awardArr=[];
	var promise2=new Promise((resolve,reject)=>{
		MongPlayAward.find({userId:req.session.userId}).then((info)=>{
			resolve(info);
		})
	})
	awardArr.push(promise2)
	var promise3=new Promise((resolve,reject)=>{
		MongPlayAward.find({userId:req.session.userId}).skip(beforeNum).limit(4).then((info)=>{
			resolve(info);
		})
	})
	awardArr.push(promise3)

	Promise.all(awardArr).then((info)=>{
		res.send({
			info,
			"code":0
		})
	})
})



//暴露接口
module.exports=router;