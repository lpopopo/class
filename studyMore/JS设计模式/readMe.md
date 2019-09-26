# JavaScript设计模式

### 高阶函数

#### 函数节流

在一些函数被频繁调用的时候，往往会造成浏览器的卡顿，在实际情况中我们往往是不需要如此频繁的代用。

以下是函数频繁调用的场景：

**`window.onresize`**:当浏览器窗口大小被随机推动而改变的时候，这个事件触发的频率非常之高。

​	**`mousemove`**:如果给一个div节点绑定了摇曳事件(主要是`mousemove`)

**函数节流原理**：他们的共同的问题就是函数执行的频率太高，而我们只需要做的事情就是降低它们触发的频率。

很显然我们需要用到`setTimeout`

这里只要是利用`setTimeout`将需要执行得函数进行相应的延时效果。

```javascript
function throttle(fn , time){
    var timer ,  //初始定时器
        frist = true ,//是否为第一次调用
        _self = fn //保存需要延时函数
    return function(){
        var args = arguments,//保存传递的参数
            _that = this     //保存this的指向
        if(frist){           //如果第一次执行，立即执行相应函数
            _self.apply(_that , args)
            return frist = false     //改变第一次记录值
        } 
        if(timer){                  //如果定时器函数存在，代表延时在进行中，
                                    //每一个定时器函数生成时，都会返回唯一的id值进行相应的指定
            return false
        }
        timer = setTimeout(function(){
            clearTimeout(timer)
            timer = null            //清空timer
            _self.apply(_that , args)
        } , time || 500)
    }
}
```

#### 分时函数

当我们在短时间内进行在浏览器上渲染或者生成大量的DOM节点时，会造成浏览器的卡顿和假死。

**解决方法之一**就是利用`setInterval` 定时器将原本需要的过程分为块，在不同的时间段中执行。

```javascript
var timeChunk = function(ary , fn , count){
    var obj , t , len = ary.length
    var start = function(){//Math.min((count || 1) , ary.length) 增加代码健壮性。
        for(let i = 0 ; i < Math.min((count || 1) , ary.length) , i++){
            obj = ary.shift()//删除并返回数组的第一个元素
            fn(obj)
        }
    }
    return function(){
        t = setInterval(function(){
            if(ary.length === 0) clearInterval(t)
            start()
        } , 200)  //每个200ms执行一次start函数
    }
}
```



**解决方法之二**

```requestAnimationFrame```

此方法会根据你的屏幕刷新时间进行，他保证了回掉函数在屏幕刷新一次只会执行一次，这样就不会引起丢帧得现象。

栗子

```javascript
//
let total = data.length , index = 0 , once = 20
function loop(elemnt , data){
    return function(){
        if(total < 0){
            return false
        }
        let page = Math.min(once , total)
        window.requesAnimationFrame(function(){
            let father = document.creatElement('ul')
            for(let i = 0 ; i < page  ; i++){
                let li = document.creatElement('li')
                li.innerText = data.shift()
                father.appchild(li)
            }
            total -= page
            elemt.appchild(father)
            loop(elemnt , data)
        })
    }
}
```

**解决方法之三**

```javascript
//document.createDocumentFragment
//文档片段接口，表示一个没有父级文件的最小文档对象。它被作为一个轻量版的Document使用，用于存储已排好版的
//或尚未打理好格式的XML片段。最大的区别是因为DocumentFragment不是真实DOM树的一部分，它的变化不会触发//DOM树的（重新渲染) ，且不会导致性能等问题。
//可以使用document.createDocumentFragment方法或者构造函数来创建一个空的DocumentFragment

//代码修改之后
let total = data.length , index = 0 , once = 20
function loop(elemnt , data){
    return function(){
        if(total < 0){
            return false
        }
        let page = Math.min(once , total)
        let frament = document.creatDocumentFragment() 
        window.requesAnimationFrame(function(){
            let father = document.creatElement('ul')
            for(let i = 0 ; i < page  ; i++){
                let li = document.creatElement('li')
                li.innerText = data.shift()
                frament.appchild(li)
            }
            total -= page
            elemt.appchild(father)
            loop(elemnt , data)
        })
    }
}
```



