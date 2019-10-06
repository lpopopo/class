/* 
*思路整理
*首先上传的时候应该除了上传.md文件之外，还应该将自己的title上传，
*上传之后的后台将.md文件转化为html文件存储在服务器上
*请求时将html中的文件内容作为模板发送渲染给前端
*/


// const fs = require('fs')
// const mark = require('marked')
// const express = require('express')

// let app = express()
// app.get('/md' , function(req , res){
//     let file = fs.readFile('../js.md' , function(err , data){
//         if(err){
//             res.send('file is not find')
//         }else{
//             let html = mark(data.toString())
//             res.send(html)
//         }
//     })
// })

// app.listen(3000)



