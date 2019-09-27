/* 
*设计和实现索引可以让你提高数据库的性能
*实现副本集合分片提供了额外的性能提升和高可用性
*/

const mongoose = require('mongoose')
const schema = mongoose.Schema
const mongo = require('mongodb')
const GridStore = require('mongodb').GridStore
const Grid = require('gridfs-stream')
const fs = require('fs')

const url = "mongodb://yy:123456@localhost/admin/"

/* const testSchma = new schema({
    name :String,
    age:{
        type:Number,
        index:true,  //实现索引
    }
})

mongoose.connect(url , function(err , db){

    let test = mongoose.model('test' , testSchma , 'test')
    let query = test.find({})
    query.exec(function(err , res){
        console.log(res)
    })

})

setTimeout(function(){
    mongoose.disconnect()
} , 3000)
 */

/* 
*
*部署一个分片的 MongoDB集群的过程包括几个步骤:首先设置服务器的不同类型,然后配置
*数据库和集合，遵循以下基本步骤
*1.创建配置服务器的数据库实例  mongod --configsvr --dbpath  <path> --port <port>
*2.启动查询路由的服务器        
*3.将分片添加到集群            
*4.在数据库上使用分片
*5.在集合上启用分片
*6.建立分片的标记范围
*/


 
/* 
*GridFS store 
*GridFS 把大文档拆分成块，这些块被存储在一个集合中，而用于访问该文档的元数据被存储在另一个集合中。
*/

mongoose.connect(url  , function(err , db ){
    let grid = Grid(db ,mongo)
    let data = new Buffer('hello world')
    var gridOptions = {
        _id : 'testFile',
    }
    let fileReadStream = grid.createWriteStream({
        filename : 'test.txt'
    })

    fs.createWriteStream('./').pipe(fileReadStream)
    db.close()
})