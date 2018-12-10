const crypto = require('crypto');
function encry(pwd){
	const secret = '@$##@#@$@##@$$@#$@#$@#';
	const hash = crypto.createHmac('sha256', secret)
                   .update(pwd)
                   .digest('hex');
    return hash;
}

module.exports=encry;