/* 
*
*此部分内容为第10张内容 (使用其他node.js模块)
*
*/


/* 
*
*node中的os模块(获得操作系统的信息)
*
*/
/* const os = require('os')

console.log(os.totalmem()) */

/* 
*
*until模块
*
*/
const util = require('util')
//格式化字符串
/* console.log(util.format('%s = %s' , 'item' , 'iten'))
console.log(util.format('1' , '2' , '3')) */

//检查对象类型
/* console.log(['1' , '2' , '3'] instanceof Array)
console.log(util.isArray([1,2,3])) */

//同步写入输出流


//将javascpt对象转换成字符串
/* let data = {
    'name' : 'yy',
    'age'  : '12',
    'id'   : '2018210407'
}
console.log(util.inspect(data)) */

//从其他对象继承功能
/* var say = {
    'jump' : function(){
        console.log('i can jump')
    }
}
function test(){
    this.jump = new say.jump//inherits 源码中是当此对象在创建时才继承生成相应的功能  http://yijiebuyi.com/blog/ea4b2a30f73596a08ce85211626b68e5.html
}
util.inherits(test , say.jump)

var a = new test
a.jump */

/* 
*
*使用dns模块
*解析dns域名，查找域，或做反向代理
*
*/

var dns = require('dns')
dns.resolve4('www.baidu.com' , function(err , addresses){
    console.log('IPv4 addresses:'+JSON.stringify(addresses , false , ' '))
    console.log(addresses)
})
