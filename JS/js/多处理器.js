/* 
*
*创建进程，并能实现相互之间的通信
*process模块  ：最大特点 允许注册监听器来处理操作系统发送给一个进程的信号
*
*/


var childProcess = require('child_process')

/* var option = {
    maxBuffer:100*1024,
    encoding: 'utf8',
    timeout:5000
} */

/* var child = childProcess.exec("mkdir a" , option , function(error , stdout , stderr){//stdout , stderr 都是包含执行命令的输出的Buffer对象
    if(error){
        console.log(error.stack)
        console.log('Error Code:'+error.code)
        console.log('Error Signal:'+error.signal)
    }
    console.log('Results:\n'+stdout)
    if(stderr.length){
        console.log('Error :'+stderr)
    }
})

child.on('exit' , function(code){
    console.log('Completed with code: '+code)
}) */


/* var child = childProcess.execFile('../a.txt' , ['-n' , 'l' , 'google.com'] , option , function(error , stdout , stderr){
    if(error){
        console.log(error.stack)
        console.log('Error Code:'+error.code)
        console.log('Error Signal:'+error.signal)
    }
    console.log('Reslut:\n' +stdout)
    if(stderr.length){
        console.log('Error :'+stderr)
    }
})
child.on('exit' , function(code){
    console.log('Child over with'+code)
}) */
/* 
var spawn = childProcess.spawn
var options  = {
    env:{
        user : 'brad'
    },
    detached:false,
    stdio:['pipe' , 'pipe' , 'pipe']
}

var child = spawn('netstat' , ['-e'] , options)
child.stdout.on('data' , function(data){
    console.log(data.toString())
})

child.stderr.on('data' , function(data){
    console.log(data.toString())
})
child.on('exit' , function(code){
    console.log('Child exited with code'+code)
}) */


/* 
*
*node使用cluster模板开多进程,多开进程也达到后端在大量用户的时候完成相应
*
*/

/* var cluster = require('cluster')
var http = require('http')

if(cluster.isMaster){
    cluster.on('fork' , function(worker){
        console.log("worker:"+worker.id+"created")
    })
    cluster.on('listening' , function(worker , address){
        console.log('worker:'+worker.id+"is listening on"+address.address+":"+address.port)
    })
    cluster.on('exit' , function(worker , code , signal){
        console.log('worker:'+worker.id+'exit')
    })
    //cluster.setupMaster()
    for(var i = 0 ; i < 4 ; i++){
        cluster.fork()
    }
    Object.keys(cluster.workers).forEach(function(id){
        cluster.workes[id].on('message' , function(message){
            console.log(message)
        })
    })
} */


var cluster = require('cluster')
var http = require('http')
var cups = require('os').cpus()
var Muncpus = cups.length

if(cluster.isMaster){
    cups.forEach(() => {
        cluster.fork()
    })
    cluster.on('fork' , function(worker){
        console.log('serve create:'+worker.id)
    })
    cluster.on('listening' , function(worker , address){
        console.log('serve:'+worker.id+"is listening on"+address.address)
    })
    cluster.on('exit' , function(worker, code ,signal){
        console.log('serve'+worker.id+'die')
    })
}else{
    http.createServer(function(req , res){
        res.writeHeader(200)
        res.end('hell world')
        console.log('serve: '+process.pid+'make a respose')

    }).listen(8000)
}