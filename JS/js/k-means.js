const  fs  = require('fs')

//读取文件
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


function  club (file){
    let  year = []
    let cuntry = []
    let all = readFileSy(file)
    for(let item in all){
        cuntry.push(all[item].split(','))
    }
    for(let i  = 0 ; i < 3 ; i++){
        let every = []
        for(let j = 0 ; j <cuntry.length ; j++){
            every.push(Number( cuntry[j][i]) )
        }
        year.push(every)
    }
    return year
}

let kMeans = function(file){
    this.data = club(file)
    this.frist = {}              //记录第一行数据
    this.second = {}       //记录第二行数据
    this.third  = {}          //记录第三行数据
    this.meanArr = []    //记录个行的计算值
    this.all   =  []             //记录所有的计算后的值
    this.k =   []
    this.dis = []
    this.disObj = []
    this.A = []
    this.B = []
    this.C = []
    this.newRule  = []
}

//冒泡排序
kMeans.prototype.findMin = function(arr){
    for(let i = 0; i < arr.length ; i ++){
        for(let j  = i+1 ; j < arr.length ; j++){
            if(arr[i] < arr[j] ){
                let change = arr[i]
                arr[i]  = arr[j]
                arr[j]  =  change
            }
        }
    }
    return arr
}

kMeans.prototype.copy = function(){
    let  shallow  = []
    for(let i = 0 ; i<this.data.length ; i++){
        shallow.push([])
        for(let item in this.data[i]){
            shallow[i].push (this.data[i][item])
        }
    }
    return shallow
}

kMeans.prototype.set = function(k){
    let  newdata 
    newdata = this.copy()
    console.log(newdata)
    let frist = this.findMin(newdata[0])
    this.frist.max = frist[0]
    this.frist.min = frist[frist.length - 1]
    let second = this.findMin(newdata[1])
    this.second.max = second[0]
    this.second.min = second[second.length - 1]
    let third = this.findMin(newdata[2])
    this.third.max = third[0]
    this.third.min = third[third.length - 1]
    this.k = k
}

//计算每一年的具体的方法
kMeans.prototype.mean = function(max , min , arr){
    let meanEvery = []
    let mean 
    for(let i = 0 ; i < arr.length ; i++)
    {
        mean = (arr[i] - min)/(max - min)
        meanEvery.push(Number(mean.toFixed(2)))
    }
    this.meanArr.push(meanEvery)
}

kMeans.prototype.meanGet = function(){
    this.mean(this.frist.max , this.frist.min , this.data[0])
    this.mean(this.second.max , this.second.min , this.data[1])
    this.mean(this.third.max , this.third.min , this.data[2])
    //将分开的数组集合为每个对象
    for(let i = 0 ; i < this.meanArr[0].length ; i++){
        this.all.push(
            {'index' : i ,  '0' : this.meanArr[0][i] , '1' : this.meanArr[1][i]  , '2' : this.meanArr[2][i]}
        )
    }
}

kMeans.prototype.distance = function(){
    for(let i = 0 ; i < this.k.length ; i++){
        let distance = []
        let index = this.k[i]
        for (let j = 0 ; j < this.all.length ; j++){
            let dis =   Math.pow( (this.all[j]['0'] - this.all[index]['0']) , 2 )  + Math.pow( (this.all[j]['1'] - this.all[index]['1'])  , 2) + Math.pow( (this.all[j]['2'] - this.all[index]['2'])  ,2)
            distance.push(
                {
                    'index' : this.all[j].index ,
                    'distance' : Number( Math.sqrt(dis).toFixed(4))
            }
            )
        }
        this.dis.push(distance)
    }
}

kMeans.prototype.ABC = function(){
    this.disObj = []
    this.A = []
    this.B = []
    this.C = []
    for(let i = 0 ; i < this.dis[0].length ; i++){
        let arr  = []
        let A = this.dis[0][i] .distance,
        B = this.dis[1][i] .distance,
        C = this.dis[2][i].distance
        arr.push(A)
        arr.push(B)
        arr.push(C)
        let rule = this.findMin(arr)
        if(rule[2] == A){
            this.disObj.push(
                {index : i , 'type' : 'a'}
            )
            this.A.push({index : i})
        }else if(rule[2] == B){
            this.disObj.push(
                {index : i , 'type' : 'b'}
            )
            this.B.push({index : i})
        }else{
            this.disObj.push(
                {index : i , type:'c'}
            )
            this.C.push({index : i})
        }
    }
}

kMeans.prototype.findnew = function(arr ,index){
    let a = 0,
    b = 0,
    c = 0;
    for(let i = 0 ; i < arr.length ; i ++){
        a += this.all[arr[i].index]['0']
        b += this.all[arr[i].index]['1']
        c +=this.all[arr[i].index]['2']
    }
    this.all[this.k[index]]['0']  = (a/arr.length).toFixed(2)
    this.all[this.k[index]]['1']  = (b/arr.length).toFixed(2)
    this.all[this.k[index]]['2']  = (c/arr.length).toFixed(2)
    this.dis = []
}

kMeans.prototype.flesh = function(){
    this.findnew(this.A , 0)
    this.findnew(this.B, 1)
    this.findnew(this.C , 2)
    this.distance()
    this.ABC()
}

var  big = new kMeans('./k-means.txt')
big.set(['1' , '12' , '9'])
big.meanGet()
big.distance()
big.ABC()
// console.log(big.disObj)

var small = new kMeans('./k-means.txt')
small.set(['1' , '12' , '9'] )
small.meanGet()
small.distance()
small.ABC()
small.flesh()
// console.log(small.disObj)

function  kFlesh (){
    for(let i = 0 ; i<big.disObj.length ; i++){
        if(big.disObj[i].type != small.disObj[i].type){
            return true
        }
    }
    return false
}

function copy (arrA , arrB){
    for(let i = 0 ; i < arrA.length ; i++){
        arrA[i].type = arrB[i].type
    }
}

while(kFlesh()){
    copy(big.disObj , small.disObj)
    small.flesh()
}

console.log(small.disObj)

