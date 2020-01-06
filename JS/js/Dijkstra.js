const fs = require('fs')        //引入读取文件模块
let node = require('./map.js') //引入node节点


let getElement = function(){
    this.pool = []        //用来存储在得到邻接链表所有元素
}

getElement.prototype.map = function(node){
    for(let i = 0 ; i < node.length ; i++){
        this.pool.push(node[i].name)
    }
}

let  lessPath = function(){
    this.relstart =null
    this.path = []    //用于存储最短路径的数组
    this.node = null   //用于存储邻接链表
    this.pool = {}    //用于存储所访问过的节点,Dijkstra算法中的初始数组
    this.nodeCount = 0 //用于存储图中元素个数
    this.start = null  //用于记录起始点
    this.end = null    //用于记录终点
    this.send = []       //用来存储转发的端口
    this.newStart = null
    this.map = []       //用来存储最后的路由转发表
}

//同步读取文件
lessPath.prototype.readFile =  function(filePath){
    let  file = fs.readFileSync(filePath , 'utf-8')      //同步读取文件，
    let  every = file.split(/\s/)                        //正则表达式匹配所有空格符，达到换行的效果
    let last = []                                         
    let n = 0
    for(let i = 0; i < every.length ; i++){             
        if(every[i]){                                    //检验正则表达式中的结果是否非法
            last[n] = every[i]
            n++
        }
    }
    this.nodeCount = last.length
    return last
}

//获取生成邻接链表
lessPath.prototype.mapList =  function(path){
    let arr = this.readFile(path)
    let nodeList = {}
    for(let item in arr){
        let every = arr[item].split(',')
        let back = this.mapListCreate(item, every)
        nodeList[back.name] = back.next
    }
    this.node =  nodeList
}
//链表创建的过程中的判断
lessPath.prototype.mapListCreate =  function(i , every){
    let head = {'name' : (+i+1).toString() , next : null}
    for(let item in every){
        if( !(every[item] == 0 || every[item] == '&') ){
            let index = +item+1
            this.objMap(head).next = new node(index.toString(), +every[item])
        }
    }
    return head
}

//分析每个节点的子节点路径和  , 算法思想：此算法需要两个集合，一个集合用来存储起点元素（我用的path变量存储）初始化权值为0，
//一个集合用来存储其他的节点元素（我用的是pool变量），先去遍历起点的子节点，而后在pool中更新他们与起点的路径值，
//而后找出最小的那个添加到path中去，pool中相应的删除，在便利新添加的节点的子节点，再在pool中刷新，以此循环
lessPath.prototype.Dijkstra =  function(){
    while(this.path.length < this.nodeCount){
        this.upDate()
        this.min()
    }
    this.mapCreate()
    console.log(this.map)
    console.log(this.path)
}

lessPath.prototype.dui = function(){
    for(let item in this.path){
        if(this.path[item].name == this.map[0].from){
            this.map.unshift(
                {'from' : this.path[item].head , 'to':this.path[item].name}
            )
        }
    }  
}

lessPath.prototype.mapCreate = function(){
    for(let item in this.path){
        if(this.path[item].name == this.end){
            this.map.unshift(
                { 'from' : this.path[item].head , 'to ' :this.path[item].name}
            )
        }
    }
    while(this.map[0].from != this.relstart){
        this.dui()
    }
}

lessPath.prototype.upDate = function(){
    let pathWeigth = this.path[this.path.length-1].weight
    let nodeNext = this.node[this.start]
    while(nodeNext.next){
        if(this.pool[nodeNext.name] != undefined && ((pathWeigth+nodeNext.weight) < this.pool[nodeNext.name].weight)){
            this.pool[nodeNext.name]  = { 'weight' : pathWeigth+nodeNext.weight ,   'head' : this.start} 
        }
        nodeNext = nodeNext.next
    }
    if(this.pool[nodeNext.name] != undefined && ((pathWeigth+nodeNext.weight) < this.pool[nodeNext.name].weight)){
        this.pool[nodeNext.name]  =   { 'weight' : pathWeigth+nodeNext.weight ,   'head' : this.start} 
    }
}

//从pool中找到最小的节点并删除 ， 并添加到path数组中
lessPath.prototype.min = function(){
    let min = Infinity
    let minNode = {}
    for(var item in this.pool){
        if(this.pool[item].weight < min){
            min = this.pool[item].weight
            minNode.name = item
            this.start = item
            minNode.weight = this.pool[item].weight
            minNode.head     = this.pool[item].head
        }
    }
    delete this.pool[minNode.name] 
    this.path.push(minNode)             //删除最小元素
}


//初始化pool数组
lessPath.prototype.initPool = function(start , end){
    for(var item in this.node){
        if(item == start){
            this.start = start
            this.relstart = start
            continue
        }else{
            this.pool[item] = { 'weight' : Infinity }
        }
    }
    this.end = end
    this.path.push({name : start , weight: 0})
}

lessPath.prototype.objMap = function(node){
    while(node.next){
        node = node.next
    }
    return node
}

// lessPath.prototype.sendStart = function(){

// }

//用于生成相应路由转发表
lessPath.prototype.sendList  = function(){
   for(let i = this.start  ;  i != this.end ;  i  = this.newStart){
        let end = this.end
        this.Dijkstra()
        this.send.push({'start' : this.path[0].name , 'end' : this.path[1].name}  )
       this.newStart = this.path[1].name
        this.path = []
        this.initPool(this.newStart  , end)
    }
}


let test =  new lessPath()
test.mapList('../data.txt')
test.initPool('1' , '6')
test.Dijkstra()
