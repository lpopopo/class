const url = require('url')  //用于解析url ， 查询字符串
const http = require('http')

http.createServer(function(req , res){
    var data = ''
    var json = ""
    req.on('data' , function(chunk){
        data += chunk
    })
    req.on('end' , function() {
         json = data.toString()
         console.log(json)
    })
    res.writeHead(200)
    res.write(data)//写入加载到页面中
    res.end()
}).listen(3000)


var option = {
    host:'127.0.0.1',
    path:'/',
    port:'3000',
    method:'POST'
}
function readJson(res){
    var resData = ''
    res.on('data' , function(chunk){
        resData += chunk
    })
    res.on('end' , function(){
        console.log('end')
/*         var dataObj = JSON.parse(resData)
        console.log(dataObj) */
})
}
var req = http.request(option , readJson)
req.write('{"name" : "yy" , "age" : "12" , "id" : "123"}')//被写入请求数据流
req.end()
