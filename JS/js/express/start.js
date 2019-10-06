const  express  = require('express')
const app = express()

const http = require('http')
const https = require('https')
const fs = require('fs')
const url = require('url')



/* 
*配置express 
*/
/* app.get('/' , function(req , res){
    res.send('hello world \n')
    console.log(req.route)
})
app.get('/user' , function(req , res){
    res.send('hello world user')
})

app.listen(3000) */

/* 
*路由中应用参数
*/
/* app.get('/user' , function(req , res){
    let query = req.query
    res.send(query)
}) */

/* 
*正则表达式匹配路由
*/
/* app.get(/^\/user/ , function(req , res){
    res.send(req.query)
}) */

/* 
*使用已定义的参数应用路由参数
*/
/* app.get('/user/:id' , function(req , res){
    res.send(req.params['id'])
}) */


/* 
*为已定义的参数应用回掉函数
*/
/* app.get('/user' , function(req , res){
    let urlChange = url.parse(req.url , true)
    let query = urlChange.query
    res.send('id =' + query.index+'\n')
}) */



/* 
*了解http request 对象
*/

/* app.get('/user' , function(req , res){
    console.log('originaUrl is: '+req.originalUrl+'\n')
    console.log('protocol is: '+req.protocol+'\n')
    console.log('IP is : ' +req.ip+'\n')
    console.log('path is : ' +req.path+'\n')
    console.log('host is: '+req.host+'\n')
    console.log('method is:'+req.method+'\n')
    console.log('query is :'+req.query+'\n')
    console.log('Secure is:'+req.secure+'\n')
    console.log('headers is:'+JSON.stringify(req.headers , null , 2)+'\n')
}) */

/* 
*使用response对象
*/

app.get('/user' , function(req , res){
    res.set('Content' , 'text/plain')
    console.log(res.get('Content'))
    res.location('https://www.baidu.com')
    res.send()
})

app.listen(3000)