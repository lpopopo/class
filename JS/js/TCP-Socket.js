/* 
*
*了解TCP服务器和Socket对象
*
*/

var net = require('net')

/* 
*连接服务器
*/
/* var client = net.connect({port:80 , host:'localhost'} , function(){
    console.log('net successful')
    client.write('Somethings\r\n')
})

client.on('data' , function(data){
    console.log(data.toString())
    client.end()
})

client.on('end' , function(){
    console.log('net end')
}) */


/* 
*
*创建net.serve 对象
*
*/
/* var serve = net.createServer(function(client){
    console.log('Client connect')
    client.on('data' , function(data){
        console.log('net send :'+data.toString())
    })
    client.on('end' , function(){
        console.log('net end')
    })
    client.write('hello world')
})

serve.listen(8000 , function(){
    console.log('serve listening')
})
 */

/* 
*
*基本的TCP套接字客户端
*
*/

//第一步，建立连接,接受处理数据，发送数据
/* function getConect(){
var client = net.connect({port:80,host:'localhost'} , function(client){
    this.setTimeout(500)//设置时间延迟
    this.setEncoding('utf8')//设置编码
    this.on('data', function(data){//监听服务器返回的数据
        console.log(data.toString())
        this.end()
    })
    this.on('end' , function(){
        console.log('net end')
    })
    this.on('error' , function(err){
        console.log('error is'+JSON.stringify(err))
    })
    this.on('timeout' , function(){
        console.log("net time out")
    })
    this.on('close' , function(){
        console.log('net close')
    })
    this.write('yy')
    
})
return client
}

function writeDate(socket , data){
    var success = !socket.write(data)//如果写入数据过多就会使用drain事件，write()函数在缓冲区满的时候返回flase
    if(!success){
        (function(socket , data){
            socket.once('drain' , function(){
                writeDate(socket , data)
            })
        })(socket , data)//使用闭包将为完全写入的数据保存下来
    }
}


var conent = getConect() */


/* 
*
*TCP实现服务端
*创建serve对象，监听端口，接受数据，写入数据
*/

var serve = net.createServer(function(client){
    client.on('data' , function(data){
        console.log('data is:' + data.toString())
        client.end()
    })
    client.on('end' , function(){
        console.log('data end')
    })
    client.on('error' , function(err){
        console.log('err is:'+JSON.stringify(err))
    })
})
serve.listen(8000,function(){
    serve.on('close' ,function(){
        console.log('net close')
        serve.on('error' , function(err){
            console.log(JSON.stringify(err))
        })
    })
})
