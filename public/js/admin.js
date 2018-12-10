$(function(){
	//添加田地
	$(".btn1").on("touchstart",function() {
			var field=$("#field").val();
			$.ajax({
				type:"post",
				url:"/api/addBox",
				data:{field},
				dataType:"json",
				success:function(data){
						if(data.code===0){
							alert('添加成功');
							window.location.reload();
						}
				}
			})
	})
	//设置奖项
	$(".btn3").on("touchstart",function(){
		var setPrize=$("#setPrize").val();
		$.ajax({
			type:"post",
			url:"/api/setPrize",
			data:{setPrize},
			dataType:"json",
			success:function(data){
				if(data.code===0){
					alert("奖项设置成功");
					window.location.reload();
				}
			}
		})
	})
	//添加奖品
	$(".btn2").on("touchstart",function(){
		var prize=$("#prize").val();
		var selectName=$("#selectName").val();
		$.ajax({
			type:"post",
			url:"/api/addPrize",
			data:{prize,selectName},
			dataType:"json",
			success:function(data){
				if(data.code===0){
					alert("添加奖品成功");
					window.location.reload();
				}else if(data.code===1){
					alert("添加奖品失败");
				}
			}
		})
	})

	$(".btn4").on("touchstart",function(){
		var deletePrize=$("#deletePrize").val();
		console.log(deletePrize);
		$.ajax({
			type:"post",
			url:"/api/deletePrize",
			data:{deletePrize},
			dataType:"json",
			success:function(data){
				if(data.code===0){
					alert("删除奖品成功");
					window.location.reload();
				}
			}
		})
	})
})