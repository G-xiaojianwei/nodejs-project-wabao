$(function(){
    var ptotal=null;
    var dtotal=null;
    var setPrize=null;
    var prize=null;
    var date=null;
    //一来就请求
    var arr=[];
    var promise=new Promise((resolve,reject)=>{
         $.ajax({
            type:"post",
            url:"/api/record",
            data:{"reDate":1},
            dataType:"json",
            success:function(data){
                if(data.code===0){
                   //总数 data.info[0].length
                   //内容 data.info[1]
                  resolve(data);
                }
            }
        })
    })
   arr.push(promise);

   Promise.all(arr).then(function(info){
        dtotal=info[0].info[0].length;
        ptotal=Math.ceil(info[0].info[0].length/4);
        setPrize=info[0].info[1][1].setPrize;
        prize=info[0].info[1][1].prize;
        date=info[0].info[1][1].date;
        // console.log(info[0].info[1])
        info[0].info[1].forEach(function(){
            $(".model>ul").append('<li><b style="float: left;"><span style="color: #FF7200;font-size: 0.18rem"><span id="a">'+setPrize+'</span><span id="b">'+prize+'</span></span></b><span style="float: right;"><span id="c">'+date.slice(0,10)+'<span></span></li>')

        })
        
       // $("#a").text(setPrize);
       // $("#b").text(prize);
       // $("#c").text(date);
        new Page({
        id: 'pagination',
        pageTotal: ptotal, //必填,总页数
        pageAmount: 3,  //每页多少条
        dataTotal: dtotal, //总共多少条数据
        curPage:1, //初始页码,不填默认为1
        pageSize: 3, //分页个数,不填默认为5
        showPageTotalFlag:false, //是否显示数据统计,不填默认不显示
        showSkipInputFlag:false, //是否支持跳转,不填默认不显示
        getPage: function (page) {
            //获取当前页数

            //ajax
            $.ajax({
                type:"post",
                url:"/api/record",
                data:{"reDate":page},
                dataType:"json",
                success:function(data){
                    if(data.code===0){
                       //总数 data.info[0].length
                       //内容 data.info[1]
                       this.dataTotal=data.info[0].length;
                       this.pageTotal=Math.ceil(data.info[0].length/4);
                        // console.log(info[0].info[1])
                        console.log(data.info[1])
                         $(".model>ul").text("");
                        data.info[1].forEach(function(item){
                            setPrize=item.setPrize;
                            prize=item.prize;
                            date=item.date;
                            $(".model>ul").append('<li><b style="float: left;"><span style="color: #FF7200;font-size: 0.18rem"><span id="a">'+setPrize+'</span><span id="b">'+prize+'</span></span></b><span style="float: right;"><span id="c">'+date.slice(0,10)+'<span></span></li>')

                        })
                    }
                }
            })
           console.log(page);
        }
    })
   })
    
})
    

$(function(){
    console.log($("#pagination ul"))
})