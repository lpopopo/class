/* 
*利用mongoose来使用结构化模式与验证
*/
const mongoose = require('mongoose')
const schema = mongoose.Schema


const testSchema = new schema({
    name : {
        type:String,
        default:'ls'
    },
    age:{
        type:Number,
        index:true,
        unqiue:true,
        sparse:true,
    }
})

const url = "mongodb://yy:123456@localhost:27017/"

mongoose.connect(url ,function(err , db) {
/*         console.log('connect success')
        const test = db.collection('test')
        test.find({name : 'ls'} , function(err , item){
            item.toArray(function(err , item){
                console.log(item)
            })
        }) */

        let test = mongoose.model('test' , testSchema , 'test') //重点 model的第三个参数一定得有。
        test.find({} , function(err , res){
            if(err){
                console.log('err is: '+err)
            }else{
                console.log(res)
/*                   test.create({name :'kity' , age : '12'} , function(err , res){
                    console.log(res)
                })  */
            }
        })
/*         let query =  test.find({name : 'ls'} , function(err , doc){ //删除所有name为'ls'的值
            let del = test.remove()
            del.where({age : '12'})
            del.exec(function(err , res){
                console.log(res)
            })
        }) */
            /* 
            *添加元素
            */
/*            test.create({naem : 'ls', age : '14'} , function(err , res){
            console.log(res)
        }) */
        /* 
        *更新元素
        */
       //更新单独文件
/*         let query = test.findOne().where({name : 'ls' , age :'20'})
        let up = query.update({
            $set:{age : '18'}
        })
        up.exec(function(err , res){
                console.log(res)
        }) */
        /* 
        *更新多个文档
        */
/*         test.find({} , function(err , doc){
           let query = test.update({} , {$set : {age : '19'}})
           query.setOptions({multi : true})//设置true ， 按条件将所有符合条件的记录都刷新
           query.exec(function(err , res){
               console.log(res)
           })
       }) */
       
})

setTimeout(function(){
    mongoose.disconnect()
} , 3000)
