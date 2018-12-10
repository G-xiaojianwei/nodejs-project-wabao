var express=require("express");
var mongoose=require("mongoose");
var session=require("express-session");
var pageRouter=require("./routers/pageRouter.js");
var apiRouter=require("./routers/apiRouter.js");
var app=express();

//配置ejs
app.set("views","./views");
app.set("view engine","ejs");



//设置css
app.use(express.static("public"));
// 设置post传输
app.use(express.json());
app.use(express.urlencoded());

//设置session
app.use(session({
	secret:"@#$%$%#@$@#$@%$",
	name:"sessionId",
	cookie:{
		maxAge:1000*60*60*24
	}
}));

//配置路由
app.use("/page",pageRouter);
app.use("/api",apiRouter);

app.use((req,res)=>{
		if(req.url==="/favicon.ico"){
			return;
		}
		//设置重定向
		res.redirect("/page/index");
})
//连接服务器变量
var port=3000;
var hostName="localhost";

//连接数据库变量
var mongUrl="mongodb://localhost:27017/wabao";

//连接数据库
mongoose.connect(mongUrl,(err)=>{
	if(err){
		console.log("数据库连接失败");
	}else{
		console.log("数据库连接成功");
		app.listen(port,hostName,(err)=>{
			if(err){
				console.log("服务器启动失败");
			}else{
				console.log("服务器启动成功");
			}
		})
	}
})