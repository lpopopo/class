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

### 单例模式

**定义:**  保证一个类仅有一个实例 ，并提供一个访问它的全局访问点

JavaScript是一门无类的语言，生搬单例模式的概念并无意义。在JavaScript中创建对象的方法非常的简单。我们只需要一个"唯一"的对象，而没有必要向传统面向对象语言首先为它创建一个"类"

```javascript
var createDiv = (function(element){
    var div 
    return function(){
        if(!div){
            div = document.createElement(element)
        }
        return div
    }
})()
```

### 策略模式

**定义:** 定义一系列的算法，把它们的一个一个封装起来，并且使他们可以互相替换。

策略模式的目的就是将算法的使用与算法的实现分开。

一个基于策略方式的程序至少由两个部分组成。第一个部分的是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。第二部分就是环境类Context,Context接受客户的请求，随后把请求委托给某一个策略类。

**使用策略模式实现缓慢动画**

```javascript
        //这些算法都接受4个参数，分别为动画已消耗的时间，小球的位置，小球的目标位置，动画的持续时间，返回值为动画应当处在的位置。
        var tween = {
            linear(runTime , pos , desPos , costTime){
                return desPos*runTime / costTime + pos
            },
            easeIn(runTime , pos , desPos , costTime){
                return desPos*(runTime /= costTime) + pos
            },
            strongEaseIn(runTime , pos , desPos , costTime){
                return desPos * (runTime /= costTime)*Math.pow(runTime , 4) + pos
            },
            strongEaseout(runTime , pos , desPos , costTime){
                return desPos*((runTime = runTime / costTime - 1)*Math.pow(runTime , 4) - 1)+pos
            },
            sineaseIn(runTime , pos , desPos , costTime){
                return desPos * (runTime /= costTime)*Math.pow(runTime , 2) + b   
            },
            sineaseOut(runTime , pos , desPos , costTime){
                return desPos*( (runTime = runTime / costTime - 1)*Math.pow(runTime , 2) + 1)+pos
            }
        }
        //创建一个动画的类
        var animation = function(dom){
            this.dom = dom       //定义操作的DOM元素
            this.startTime = 0   //定义动画开始的时间
            this.startPos = 0    //定义元素的其实位置
            this.endPos = 0      //定义元素的停止位置
            this.cssName = null  //定义元素需要改变的css属性名
            this.easing = null   //元素动画需要的缓动算法
            this.duration = 0    //定义动画持续时间
        }
        //动画开始函数， 初始化数据
        animation.prototype.start = function(cssName, duration  , endPos , easing){
            this.startTime = +new Date
            this.cssName = cssName 
            this.duration = duration 
            this.endPos = endPos
            this.easing = tween[easing]

            var self = this
            var timer = setInterval(function(){
                if(self.step() == false){
                    clearInterval(timer)
                }
            } , 17) //以17ms刷新一次的速度进行动画播放
        }

        //step函数，代表每一帧所做的事情
        animation.prototype.step = function(){
            var costTime = +new Date
            if(costTime >= this.startTime + this.duration){
                this.update(this.endPos)
                return false
            }
            var pos = this.easing(costTime - this.startTime , this.startPos , this.endPos-this.startPos , this.duration)
            this.update(pos)
        }
        //每一帧的更新函数
        animation.prototype.update = function(pos){
            this.dom.style[this.cssName] = pos + 'px'
        }
```

**策略模式重构表单验证**

先看一段代码

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>表单验证</title>
        <meta charset="utf-8">
    </head>
    <body>
        <form action="" method="post" id="userForm">
            <label>请输入你的名字：<input name="userName" type="text"></label>
            <label>请输入你的电话号码：<input name="userPone" type="text"></label>
            <label>请输入你的密码：<input name="userPassworld" type="password"></label>
        </form>
    </body>
    <script>
        var form = document.querySelector('#userForm')
        form.onsubmit = function(){
            if(form.userName.value === ''){
                alert("用户名格式不对")
                return false
            }
            if(form.userPassworld.value.length < 6){
                alert('你的电话号码格式不对')
                return false
            }
            if(!(/(^1[3|5|8][0-9]{9}$)/.test(form.userPone.value))){
                alert('你的电话号码格式不对')
            }
        }
    </script>
</html>
```

一般情况下我们就是使用这样的方法进行相应的表单验证，但是这样的写法在你进行相应的规则修改的时候，显得有些麻烦，而且代码的复用性也是十分的差

所以下面使用策略模式进行表单的重构：

```javascript
        var register = {
            //检查不为空系列
            isMull(value , errorMsg){
                if(value === ''){
                    return errorMsg
                }
            },
            //检查长度匹配系列
            isLength( value , length , errorMsg){
                if(value.length < length){
                    return errorMsg
                }
            },
            //手机号码格式
            isPone(value , reg ,errorMsg){
                if(!(reg.test(value))){
                    return errorMsg
                }
            }
        }        
        //实现一个类实现Context的作用
        var validator = function(){
            this.ruleSeclte = []    //存储表单验证的结果返回值
        }
        validator.prototype.add = function(dom , rules , errorMsg){
            let rulesArr = rules.split(":")
            let rulesGet = rules.shift()
            this.rulesArr.unshift(dom.value).push(errorMsg)
            this.ruleSeclte.push(
                register[rulesGet].apply(dom , rulesArr)
            )
            
        }

        validator.prototype.start = function(){
            for(var i in this.ruleSeclte){
                alert(this.ruleSeclte[i])
            }
        }
```



