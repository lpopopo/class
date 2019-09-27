var stream = require('stream')
var util = require('util')
var fs = require('fs')

/* 
* Readable流
*/

/* util.inherits(Answer , stream.Readable)

function Answer(){
    stream.Readable.call(this);
    this.quotes = ['yes' , 'no' , 'maybe']
    this._index = 0;
}

Answer.prototype._read = function(){
    if(this._index > this.quotes.length){
        this.push(null)
    }else{
        this.push(this.quotes[this._index])
        this._index += 1
    }
}

var  r = new  Answer()
console.log('read' + r.read().toString()) 
 r.on('data' , function(data){
    console.log('Data CallBack' + data.toString())
})
r.on('end' , function(){
    console.log('no more answer')
}) */

/* 
*
*
*
* writable流
*
*
*/

/* util.inherits(Write , stream.Writable)
function Write(){
    stream.Writable.call(this)
    this.data = new Array()
}
Write.prototype._write = function(data , encoding , CallBack){
    this.data.push(data.toString('utf8'))
    console.log('add:' + data)
    CallBack()
}

var w = new Write()
w.write('item' , 'utf8' )
w.end('over')
console.log(w.data) */


/* 
*
*
*
*Duplex流
*
*
*
*/
/* util.inherits(MyDuplex , stream.Duplex)
function MyDuplex (){
    stream.Duplex.call(this)
    this.data = []
}
MyDuplex.prototype._read = function(){
    var chunk = this.data.shift()
    if(chunk == 'stop'){
        this.push(null)
    }else{
        this.push(chunk)
        
    }
}
MyDuplex.prototype._write = function(data , encoding , CallBack){
    if(data == 'stop'){
        this.data.push('sto')
    }else{
        this.data.push(data)
    }
}
var d = new MyDuplex()
d.on('data' , function(chunk){
    console.log('read:' + chunk.toString())
})
d.on('end' , function(){
    console.log('no more read')
})

d._write('stop')
d._write('yy')
d._write('zsy')
d._write('ls') */

/* 
*
*
*Transform 流
*
*
*/

/* util.inherits(JsonTranform , stream.Transform)
function JsonTranform(){
    stream.Transform.call(this)
}
JsonTranform.prototype._transform = function(obj , encoding , CallBack){
    var data = obj ? JSON.parse(obj) : ''
    this.emit('object' , data)
    Object.handled = true
    this.push(JSON.stringify(data))
    CallBack()
}
JsonTranform.prototype._flush = function(cb){
    cb()
}

var t = new JsonTranform()
t.on('object' , function(object){
    console.log('name:%s' ,object.name)
    console.log('color:%s' , object.color )
})
t.on('data' , function(data){
    console.log('data:' + data.toString())
}) */

/* t.write('{"name" : "yy" , "color" : "blue"}')
t.write('{"name" : "ww" , "color" : "red"}')
t.write('{"name" : "zz" , "color" : "pink"}') */


/* 
*
*
*用fs模块创建可读可写流
*
*
*/
/* const w = fs.createWriteStream('a.txt')

w.write('123A')
w.write('456B')

const r = fs.createReadStream('a.txt')
r.on('data' , function(data){
    console.log('the data is in the a.txt:'+data.toString())
})
r.on('end' , function(){
    console.log('no more to read')
}) */

/* 
*
*
*从Readable流到Writable流的管道通信
*
*
*/
/* const zlib = require('zlib')
const rs = stream.Readable({
    read(){
        var data = fs.readFileSync('../a.txt')
        console.log(data)
        this.push(data)
        this.push(null)
    }
})

const ws = stream.Writable({
    write(data , encoding , cb){
        fs.writeFileSync('./b.txt' , data)
        cb()
    }
})

rs.pipe(ws)

ws.on('pipe' , data=>{

}) */

/* 
*
*
*压缩流与管道(将一个文件读再压缩写入另一个文件)
*
*
*/
/* const zlib = require('zlib')
var gzip = zlib.createGzip()//创建压缩流
var inFile = fs.createReadStream('../a.txt')
var outFile = fs.createWriteStream('../b.gz')
inFile.pipe(gzip).pipe(outFile)/* 将文件压缩之后通过管道的传输进行写入另外的文件中 */

/* 解压文件 */
/* setTimeout(function(){
    var gunzip = zlib.createUnzip({flush: zlib.Z_FULL_FLUSH})
    var inFile = fs.createReadStream('../b.gz')
    var outFile = fs.createWriteStream('../b.txt')
    inFile.pipe(gunzip).pipe(outFile)
} , 3000) */



/* 
*流式文件读取
*/

const timeA =  new Date().getTime()
let options = {encoding:'utf-8' , flag:'r' /* , highWaterMark:4 */}
var readStream = fs.createReadStream('../a.txt' , options )
let str = ''
readStream.on('data' , function(chunk){
    str += chunk
})
readStream.on('close' , function(){
    console.log('read close')
    console.log(str.length)
    const timeB =  new Date().getTime()
    console.log(timeB - timeA)
})



