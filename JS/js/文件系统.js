/* 
*
*node中提供的fs模块使得几乎所有的功能都有两种形式可供选择：同步与异步。
*异步方法write()和同步方法writeSync()
*
*/



/*  fs.open('a.txt' , 'r' , function(err , fd){
    if(err){
        fs.close(fd)
    }
    console.log('文件打开成功')
})  */
/* fs.open('a.txt', 'r+', function(err, fd) {
    if (err) {
        return console.error(err);
    }
   console.log("文件打开成功！");     
 }); */
/* 
*读取文件
/* */
/*   fs.readFile('../a.txt' , function(err , data){
     if(err){
         return console.log(err)
     }
     console.log('data:'+data.toString())
 }) */


/* 
*写入文件
*/
/* var data = {
    'name' : 'yy',
    'age'  : '12',
    'id'   : '2018'
}

var dataText = JSON.stringify(data)

var option = {
    encoding : 'utf8' ,
    flag     : 'w'
}

fs.writeFile('a.txt' ,dataText, option , function(err){
    if(err){
        console.log('write faild')
    }else{
        console.log('write saved')
    }
} ) */


/* 
*
*异步写入文件
*
*/
/* var fruits = ['apple' , 'origin' , 'banana' , 'pie']

function write(fd){
    if(fruits.length){
        var fruit = fruits.pop() + ' '
        fs.write(fd , fruit , null , null , function(err , bytes){
            if(err){
                console.log('write failed')
            }else{
                console.log('write:'+' '+bytes+'bytes')
                write(fd)
            }
        })
    }else{
        fs.close(fd)
    }

}

fs.open('a.txt' , 'w' , function(err , fd){
    write(fd)
}) */


/* 
*
*获取文件信息
*
*/

/*  fs.stat('../a.txt' , function(err , stats){
    if(err){
      console.log('failed')
      return 0;
    }  
    console.log(stats)
})  */

/* var stats = fs.statSync('a.txt')
console.log(stats) */

/* 
*
*列出文件 fs.readdir(path , callback)
*删除文件fs.unlink(path , callback)
*截断文件fs.truncate(path , len ,  callback) 返回true和flase
*建立(fs.mkdir(path , [mode] , callback))和删除文件(fs.rmkdir(path , callback))
*
*/

/* console.log(fs.readdirSync('../txt').length) */

//同步读取文件


const stream = require('stream')
const util = require('util')
const fs = require('fs')


/* const timeA =  new Date().getTime()
let options = {encoding:'utf-8' , flag:'r' //, highWaterMark:4
}  */

const options = {encoding : 'utf-8' , flag :'r'}
/* const options = {encoding : 'String' , flag : 'r'} */
let signs = []

//读取文件目录
function fileDir(path){
    return fs.readdirSync(path)
}

//同步读取文件
function readFileSy(filePath){
    let  file = fs.readFileSync(filePath , 'utf-8')
    let  every = file.split(/\s/)
    let last = []
    let n = 0
    for(let i = 0; i < every.length ; i++){
        if(every[i]){
            last[n] = every[i]
            n++
        }
    }
    return last
}

//以流的形式读取文件将文件内容拼接为字符串
async function  readFile(file){
    return  new Promise((res , rej) =>{
        let str = ''
        let readStream =  fs.createReadStream(file , options)
        readStream.on('data' , chunk => {
            str += chunk
        })
        readStream.on('close' , () =>{
            let every = str.split(/\s/)
            let last = []
            let n = 0
            for(let i = 0 ; i < every.length ; i++){
                if(every[i]){
                   last[n] = every[i]
                   n++
                }
            }
            res(last)
        })
    })
}

//将所得的字符串转化为数组在计算平均值
function lastArr(file){
    let arr = readFile(file)
    let sum = 0
    for(let i = 0 ; i < arr.length ; i = i+2){
        sum += Math.sqrt(Math.pow(arr[i] , 2)+Math.pow(arr[i+1] , 2))
    }
    return sum/arr.length
}

async function lastArrAsync(file){
    let arr = await readFile(file)
    let sum = 0
    for(let i = 0 ; i < arr.length ; i = i+2){
        sum += Math.sqrt(Math.pow(arr[i] , 2)+Math.pow(arr[i+1] , 2))
    }
    return sum/arr.length
}

//排序函数
//先快排，再插排
function sort(arr){
    let stardIndex={
        index : 0
    }
    let quickArr = quickSort(arr , stardIndex)
    let last = pushSort(quickArr , stardIndex)
    return last
}
//快速排序实现
function quickSort(arr , stardIndex){
    let stard = arr[0].num
    let quick = []
    quick[0] = arr[0]  //初始化快排数组
    for (let index = 1; index < arr.length; index++) {
        if(arr[index].num >= stard){
            quick.unshift(arr[index])
            stardIndex.index++
        }else{
            quick.push(arr[index])
        }
    }
    return quick
}
//插入排序实现
function pushSort(arr , stardIndex){
    //对前面的数据进行冒泡排序
    for(let i = 1 ; i < stardIndex.index ; i++){
        for(let j = 0; j < i ; j++){
            if(arr[i].num > arr[j].num){
                let change = arr[i]
                arr[i] = arr[j]
                arr[j] = change
            }
        }
    }
    //对后面的在此冒泡排序
    for(let i = stardIndex.index+2 ; i < arr.length ; i++){
        for(let j = stardIndex.index+1 ; j < i ; j++){
            if(arr[i].num > arr[j].num){
                let change = arr[i]
                arr[i] = arr[j]
                arr[j] = change
            }
        }
    }
    return arr
}

new Promise(function(res , rej){
    let newSigns = []
    let obj = {}
    const timeA = new Date().getTime()
    let files = fileDir('../txt')   //获得文件目录
    for(let i = 0 ; i < files.length ; i++){
        signs[i] = {}
        signs[i].num  = lastArrAsync("../txt/"+files[i])
        signs[i].name = files[i]
    }
    for(let i = 0 ; i < signs.length ; i++){
        signs[i].num.then(function(res){
            obj.num = res
            obj.name = signs[i].name
            newSigns.push(obj)
        })
    }
    res(newSigns)
}).then(function(res){
    let sortArr =  sort(res).splice(0,5)
    console.log(sortArr)
    const timeB = new Date().getTime()
    console.log((timeB - timeA)+'ms')
})



//滑动相关
function slip (){
    let nom = fileDir('../nom')

}


