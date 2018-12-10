function addSub(){
		var $user = $('[name=user]').val();
		var $phone=$("[name=phone]").val();
		var $pwd=$("[name=pwd]").val();
		var $pwd2=$("[name=pwd2]").val();
		var reg=/^[\u4E00-\u9FA5A-Za-z0-9_]+$/;//昵称正则
		var reg1=/^(\+86|0086)?\s*1[34578]\d{9}$/;//手机正则
		var reg2=/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;//验证密码
		if(reg.test($user)){
			if(reg1.test($phone)){
				if(reg2.test($pwd)){
					if($pwd===$pwd2){
						return true;
					}else{
						alert("两次密码输入不一致");
						return false;
					}
				}else{
					alert("请正确输入密码-使用字母、数字和符号两种及以上的组合，6-20个字符");
					return false;
				}
			}else{
				alert("请正确输入电话号码");
				return false;
			}
		}else{
			alert("请正确输入昵称-输入汉字、数字或字母");
			return false;
		}
}