const mongo = require('mongodb')
const mongoClient = mongo.MongoClient

const url = "mongodb://localhost:27017/"

 mongoClient.connect(url , function(err , client){  //首先通过mongodb.client 连接数据库
    if(err){
        console.log('connent err with :'+err)
    }else{
         var db = client.db('admin')               //选中admin库
         if(db){
            console.log("db exit")
            const admin = db.admin()
            admin.listDatabases(function(err, res){
            })
            const test = db.collection('test')   //选中admin库中test表
/* 
*
*更新操作
*
*/
/*             test.find({name : 'yy'} , {
                
            } , function(err , item){
                item.toArray(function(err , res){
                    console.log(res)
                })
                test.updateOne({name : 'yy'} ,
                {$set:{age : '19' , update:true}},
                {upsert:true , multi:true , w:1},
                function(err , res){
                    test.find({name : 'yy'} ,{

                    } , function(err , item){
                        item.toArray(function(err , res){
                            console.log(res)
                        })
                    })
                }
                )
            }) */
/* 
*删除操作
*/
/*             test.remove({nmae:'ls'} ,function(err , res){

            }) */
/* 
*插入操作
*/          
/*             let newUser = {
                name: 'ls',
                age : '10'
            }
            test.insert(newUser , function(err , res){
                console.log(res)
            })  */
/* 
*query高级用法
*/           
/*               test.find({ age : {  $gt : '14' , $lt:'16' }}).forEach(function(err , item){ //特别注意 ， query中的 20 一定是字符串 ， 否则查询不成功
                if(err) console.log(err)
                console.log(item)
            })  */

/* 
*对结果进行分组
*/
            test.aggregate([   //首先，此函数有两个参数 ， 第一个为配置项 $match 先选择自己的匹配要求文档 ， $group 是自己
                               //得到的结果中想包含的数据 ， 会将相同属性的名字何为一个,第二个参数为一个回调函数
                {$match : {name : 'ls'}} ,   
                {$group:{ _id : '$name' , total:{ $sum : 1} } }
            ] , function(err , res){
                res.toArray(function(err , res){
                    console.log(res)
                })
            })
            client.close()
        }else{
            console.log('db is not exited')
        }
    }
})

