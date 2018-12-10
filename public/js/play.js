$(function(){
	// var w=0;
	// setInterval(function(){
	// 	$(".nei_line").css("width",w+"%");
	// 	w++;
	// },1000)
	
	
	var j=$("li.yesplay").length
		console.log(j)
		if(j!==0){
			var newl=$("li").length;
			$.ajax({
			type:"post",
			url:"/api/addBox",
			data:{"field":newl},
			dataType:"json",
			success:function(data){
				if(data.code===0){
					console.log(111)
					window.location.reload();
					setTimeout(function(){
						$(".loading").fadeOut();
					},1000)
					

				}
			}

		})
		}
})
		
	
	


$(function(){
	var bool=true;
	var n=10;
	var ds=0;
	//点击游戏的方法
	function startOk(){
		
		if(ds==0){
			ds++;
			$(".model1").css("display","none");
			var i=0.132;
			timer=setInterval(bar,1000)
			function bar() {
				$(".bar").css("width",i+"rem");
				n--;
				i=i+0.132;
				$(".left").html(n+"s");
				if(n<0){
					clearInterval(timer);
					time=null;
					n=10;
					bool=true;
					$(".bar").css("width","0rem");
					$(".left").html(n+"s");
					$(".startBtn").css("display","block");
					ds=0;
				}	
			}
		}
			
		
	}

	$(".img_a").on("touchstart",function(){
		$(".startBtn").hide();
		startOk();
	})

	$(".xxBtn").on("touchstart",startOk);


	//事件委托
		var $max=$(".max");
		var $maxLi=$max.find("li.noplay");
		//委托写法
		$max.on("touchstart","li.noplay",function(e){
			e.stopPropagation;
			console.log(bool)
			var bid=this.dataset.bid;//得到自定义属性data-bid的值
			var This=this;//留住this
			if(n!==10){
				if(bool){
				setTimeout(()=>{
					$.ajax({
						url:"/api/winning",
						data:{bid},
						dataType:"json",
						success:function(data){
							// console.log(This.offset().top)
							if(data.code === 0){
								// $(This).addClass("animated bounceIn");
								$("#xcc").css("display","block");
								var left=$(This).offset().left;
								var top=$(This).offset().top;
								$("#xcc").attr("class","animated swing")
								$("#xcc").css("left",left+10+"px");
								$("#xcc").css("top",top+"px");
								setTimeout(function(){
									$(This).append("<span>"+data.prize+"</span>");
									$(This).attr('class','yesplay');
								// console.log("yes")

								//点击之后就停止定时器并把游戏恢复到最初状态
								clearInterval(timer);
								timer=null;
								n=10;
								bool=true;
								$(".bar").css("width","0rem");
								$(".left").html(n+"s");
								ds=0;
								$(".model1").css("display","block");
								//获取奖励把奖励存放到个人信息中
								//判断是否有奖，无奖就算了
								console.log(data)
								$("#xcc").attr("class","");
								$("#xcc").css("display","none");
								if(data.setPrize!="无"){
									if($("#audio").autoplay){
										console.log(1)
									}else{
										 audio.play();
									}
									//上传到数据库中
									$(".pinfo").css("display","block");
									$(".sp").html(data.setPrize);
									$(".pp").html(data.prize);
									$(".model1 img").attr("src","/img/hao.png");
									$.ajax({
										type:"post",
										url:"/api/award",
										data:{data},
										dataType:"json",
										success:function(data){
											if(data.code===0){
												console.log("奖品上传成功");
											}
										}

									})

								}else{
									
									$(".pinfo").css("display","none");
									$(".model1 img").attr("src","/img/noPrize.png");
								}
								},1500)

								
							}

							//查询nopaly的个数
							var liNum=$max.find("li.noplay").length;
							if(liNum === 0){
								//查看进度条时间
								//从新使用ajax请求添加宝箱、
								//添加定时器
								var newTime=setInterval(newReq,1000);
								function newReq(){
									if(n===0){
										clearInterval(newTime);
										newTime=null;
										$.ajax({
										type:"post",
										url:"/api/addBox",
										data:{"field":$max.find("li").length},
										dataType:"json",
										success:function(data){
											if(data.code===0){
												window.location.reload();
											}
										}

										})
									
									}
								}
								
								
							}
						}

					})
				})
			}

		bool=false;
		}
	})

})