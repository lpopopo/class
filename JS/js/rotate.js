const fs = require('fs')


// function readFileByBit(path , start , size ){
//             fs.open(path , 'r' , function(err , fd){
//                 if(err) throw err 
//                 let buf = Buffer.alloc(size)
//                 fs.read(fd , buf , 0 , size , start , function(err , bit){
//                      console.log( buf[0])
//                 })
//             })
// }

//将 buffer数据转成十进制
function  buffToInt(arr){
    let heightInt  = 0
for(let i = 0 ; i  < arr.length ; i++){
    heightInt += arr[i]*Math.pow(256 , i)
}   
return heightInt
}

//确定位数
function  bit(bitDeep){
    return bitDeep/8
}

//将读取的ｂuffer文件转成宽高相等的格式
function   toArr(pic , width , height ,  len , more){
    let arr = []
    for(let i = 0 ;  i < pic.length ; i = i+width*len + 1){
        let rang = pic.slice(i , i+width*len)
        if(arr.length < height){
            arr.push(rang)
        }else{
            more.push(rang)
        }
    }
    return arr
}

//将图片信息做矩阵变化
function transposition(picArr , width ,height){
    let arr = []
    for(let i = 0 ; i < width; i++ ){
        let rang = []
        for(let j = 0 ; j < picArr.length ; j++){
            rang.unshift( new Buffer( [picArr[j][i] ]) )
        }
        arr.push( Buffer.concat( rang  ,  height ))
    }
    return arr
}

let buff = fs.readFileSync('../map.bmp')

//图片内容 数据
let pic = buff.slice(54 )
//位图深度
let bitDeep = buff.slice(28 , 30)
bitDeepInt = buffToInt(bitDeep)
//图片的高度
let   height = buff.slice(22, 26)
//图片的宽度
let  width = buff.slice(18, 22)
//多余数据
let more = []


let heightInt = buffToInt(height)
let widthInt = buffToInt(width)

let  len  = bit(bitDeepInt)

let picArr = toArr(pic , widthInt , heightInt , len , more)
let pictranform = transposition(picArr , widthInt  , heightInt)

let headfrist = buff.slice(0 , 18)
let headlast = buff.slice(26,54)
let length = headlast.length+height.length+width.length+headlast.length

// let last  = Buffer.concat([headfrist , height , width , headlast ], length ) 
// for(let i = 0 ; i < pictranform.length ; i++){
//     let newbuff = new Buffer(pictranform[i])
//     last = Buffer.concat( [last , newbuff] ,  length+(i+1)*800)
// }

let newbuff = Buffer.concat( pictranform , 600 * 800)
let last = Buffer.concat([headfrist , height , width , headlast ,  newbuff ], buff.length)

more ? last = Buffer.concat([last ] , buff.length) : last = Buffer.concat([last] , more[0] , buffs.length )

fs.writeFileSync('../test.bmp' , last , function(err){
    if(err){
        console.log(err)
    }else{
        console.log('ok')
    }
})
