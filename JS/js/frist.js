const stream = require('stream')
const util = require('util')
const fs = require('fs')


/* const timeA =  new Date().getTime()
let options = {encoding:'utf-8' , flag:'r' //, highWaterMark:4
}  */

/* const options = {encoding : 'utf-8' , flag :'r'} */
const options = {encoding : 'String' , flag : 'r'}
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
    let arr = readFileSy(file)
    let sum = 0
    for(let i = 0 ; i < arr.length ; i = i+2){
        sum += Math.sqrt(Math.pow(arr[i] , 2)+Math.pow(arr[i+1] , 2))
    }
    return sum/arr.length*2
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

const timeA = new Date().getTime()
let files = fileDir('../txt')   //获得文件目录
for(let i = 0 ; i < files.length ; i++){
    signs[i] = {}
    signs[i].num  = lastArr("../txt/"+files[i])
    signs[i].name = files[i]
}
let sortArr =  sort(signs).splice(0,6)
console.log(sortArr)
let signsIndex = slip(sortArr)
let signsIndexSort = sort(signsIndex)
console.log(signsIndexSort.splice(0 , 2))
const timeB = new Date().getTime()
console.log((timeB - timeA)+'ms')



//滑动相关
function slip (fileArr){
    let nom = fileDir('../norm')
    let nomFiles = []
    let files = []
    for(let i = 0 ; i < fileArr.length ; i++){
        files[i] = {}
        files[i].num = readFileSy('../txt/'+fileArr[i].name)
        files[i].name = fileArr[i].name
    }
    for(let i = 0 ; i < nom.length ; i++){
        nomFiles[i] = {}
        nomFiles[i].num = readFileSy('../norm/'+nom[i])
        nomFiles[i].name = nom[i]
    }
    let signsFinal = signSlip(files , nomFiles)
    return signsFinal
}


//每个信号之间的相关滑动计算
function slipCompute(files , nomFiles){
    let slipArr = []
    let max = 0
    for(let i = 0 ; i < files.length ; i = i+nomFiles.length ){
        for(let j = i ; (j- i) < nomFiles.length ; j=j+2 ){
            let shi = files[j] * nomFiles[j-i]  - files[j+1]*nomFiles[j-i+1]
            let xi = files[j]*nomFiles[j-i+1] + files[j+1]*nomFiles[j-i]
            let every = Math.pow(shi , 2)+Math.pow(xi , 2)
            if(every > max){
                max = every
            }
        }
    }
    return max
}

//3*6中滑动计算
function signSlip(files , nomFiles){
    let all = []
    for(let i = 0 ; i < nomFiles.length ; i++){
        for(let j = 0 ; j < files.length ; j++){
            all.push({
                'num' : slipCompute(files[j].num , nomFiles[i].num),
                'name': files[j].name+'+'+nomFiles[i].name
            })
        }
    }
    return all
}

