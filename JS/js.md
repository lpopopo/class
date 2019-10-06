

`eval`可以用来欺骗词法      `P18`在严格模式的程序中，`eval(..)`在运行时有其自己的词法作用域，意味着其 中的声明无法修改所在的作用域。



**立即执行函数表达式**

由于函数被包含在一对 ( ) 括号内部，因此成为了一个表达式，通过在末尾加上另外一个 ( ) 可以立即执行这个函数，比如` (function foo(){ .. })()。`第一个 ( ) 将函数变成表 达式，第二个 ( ) 执行了这个函数。 

```javascript
(function foo() {
var a = 3;
console.log( a ); // 3
})();
```
##闭包

闭包是什么：

闭包指的有权访问另一个函数作用域的变量函数。

闭包产生的过程：

首先 ， 一个函数创建的过程中，会预先创建一个包含全局作用域的作用链，这个作用域链被保存在内部的[[Scope]]属性中。

而在调用的时候会为函数创建一个执行环境，然后通过复制[[Scope]]中属性构造起执行环境的作用域链，此后又有一个活动对象被推入到作用域链的前端，（及函数本身的活动对象）。无论什么时候再函数中访问变量，就会从作用域链中搜寻相应的变量的名字。

![avatar](./img/functionB.png)

一般来讲，函数执行完毕之后，局部的活动对象会被销毁。但是闭包就有所不同。在函数内部定义的函数实际上将外部函数的活动对象添加到了自己的作用域链中。因为函数定义函数作用域链中引用了外部函数的活动对象，所以在外部函数执行完成之后，他的活动对象并不会被回收，仍然保存在内存中，直到不在被引用。

![avatar](./img/functionA.png)



```javascript
for (var i=1; i<=5; i++) {
setTimeout( function timer() {
console.log( i );
}, i*1000 );
}
```

首先解释 6 是从哪里来的。这个循环的终止条件是 i 不再 <=5。条件首次成立时 i 的值是
6。因此，输出显示的是循环结束时 i 的最终值。
仔细想一下，这好像又是显而易见的，延迟函数的回调会在循环结束时才执行。事实上，
当定时器运行时即使每个迭代中执行的是 `setTimeout(.., 0)`，所有的回调函数依然是在循
环结束后才会被执行，因此会每次输出一个 6 出来。

```javascript
for (var i=1; i<=5; i++) {
(function() {
setTimeout( function timer() {
console.log( i );
}, i*1000 );
})()
}
//当前的i通过引用来最终寻得，故闭包只能取得包含函数中任何变量的最后一个值，这是因为闭包所保存的是整个变量对象，而不是某个特殊的变量。
//如果作用域是空的，那么仅仅将它们进行封闭是不够的。仔细看一下，我们的 IIFE 只是一
//个什么都没有的空作用域。它需要包含一点实质内容才能为我们所用。
//它需要有自己的变量，用来在每个迭代中储存 i 的值:
 
方式一： 
for (var i=1; i<=5; i++) {
(function() {
var j = i;
setTimeout( function timer() {
console.log( j );
}, j*1000 );
})();
}



function createFunctions(){
 var result = new Array();
 for (var i=0; i < 10; i++){ //此时for循环相当于创建了10个函数，并且每一个的i都指向外部函数的作用
 result[i] = function(){     //域链，在再此后执行function时通过引用找到i就是i最终的结果了
 return i;
 };
 }
 return result;
} 
方式二：
function createFunctions(){    
 var result = new Array();
 for (var i=0; i < 10; i++){
 result[i] = function(num){  //因为函数是按值传入，所以在num每一次都可以接收到i不同的值
 return function(){
 return num;
 };
 }(i);
 }
 return result;
} 
```


```javascript
function test(){
  var arr = [];
  for(var i = 0;i < 10;i++){
    arr[i] = function(){
      return i;
    };
  }
  for(var a = 0;a < 10;a++){
    console.log(arr[a]());
  }
}
test(); // 连续打印 10 个 10
```


for 循环头部的 let 不仅将 i 绑定到了 for 循环的块中，事实上它将其重新绑定到了循环 的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。 下面通过另一种方式来说明每次迭代时进行重新绑定的行为：

```javascript
 {
let j;
for (j=0; j<10; j++) {
let i = j; // 每个迭代重新绑定！
console.log( i );
}
}

for(let i = 1 ; i<=5 ; i++){
	setTimeout(function timer(){
		console.log(i)
	} , i*1000)
}

```

##函数节流和防抖
前言：由于对DOM的操作非常消耗性能，所以应当减少DOM操作，
而防抖意味着就是在一项操作中不执行这个函数，而当这项操作暂停下来的时候在进行这项函数的执行。
节流就是在规律的进行相关的函数的执行。相当于游乐园排队，不管后面排了多少人，每30分钟只放10人进去项目游玩

`https://juejin.im/post/5c87b54ce51d455f7943dddb`



浮点数值的最高精度是 17 位小数，但在进行算术计算时其精确度远远不如整数。例如，0.1 加 0.2
的结果不是 0.3，而是 0.30000000000000004。



**`NaN`**

`NaN`，即非数值（Not a Number）是一个特殊的数值，这个数值用于表示一个本来要返回数值的操作数
未返回数值的情况（这样就不会抛出错误了）。例如，在其他编程语言中，任何数值除以 0都会导致错误，
从而停止代码执行。但在` ECMAScript`中，任何数值除以 0会返回` NaN`①，因此不会影响其他代码的执行。
`NaN `本身有两个非同寻常的特点。首先，任何涉及` NaN` 的操作（例如 `NaN/10`）都会返回` NaN`，这
个特点在多步计算中有可能导致问题。其次，`NaN` 与任何值都不相等，包括` NaN`本身.

① 原书如此，但实际上只有 0 除以 0 才会返回 `NaN`，正数除以 0 返回 Infinity，负数除以 0 返回-Infinity。



```javascript
var num1 = parseInt("10", 2); //2 （按二进制解析）
var num2 = parseInt("10", 8); //8 （按八进制解析）
var num3 = parseInt("10", 10); //10 （按十进制解析）
var num4 = parseInt("10", 16); //16 （按十六进制解析）
```



```javascript
var result = "23" < "3"; //true
```

确实，当比较字符串"23"是否小于"3"时，结果居然是 true。这是因为两个操作数都是字符串，
而字符串比较的是字符编码（"2"的字符编码是 50，而"3"的字符编码是 51）。



```javascript
alert(person instanceof Object); // 变量 person 是 Object 吗？
alert(colors instanceof Array); // 变量 colors 是 Array 吗？
alert(pattern instanceof RegExp); // 变量 pattern 是 RegExp 吗？
```





如果 slice()方法的参数中有一个负数，则用数组长度加上该数来确定相应的位
置。例如，在一个包含 5 项的数组上调用 slice(-2,-1)与调用 slice(3,4)得到的
结果相同。如果结束位置小于起始位置，则返回空数组。



splice()的主要用途是向数组的中部插入项，但使用这种方法的方式则有如下 3 种。
 删除：可以删除任意数量的项，只需指定 2 个参数：要删除的第一项的位置和要删除的项数。
例如，splice(0,2)会删除数组中的前两项。
 插入：可以向指定位置插入任意数量的项，只需提供 3 个参数：起始位置、0（要删除的项数）
和要插入的项。如果要插入多个项，可以再传入第四、第五，以至任意多个项。例如，
splice(2,0,"red","green")会从当前数组的位置 2 开始插入字符串"red"和"green"。
 替换：可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需指定 3 个参数：起
始位置、要删除的项数和要插入的任意数量的项。插入的项数不必与删除的项数相等。例如，
splice (2,1,"red","green")会删除当前数组位置 2 的项，然后再从位置 2 开始插入字符串
"red"和"green"。
splice()方法始终都会返回一个数组，该数组中包含从原始数组中删除的项（如果没有删除任何
项，则返回一个空数组）。



**数组位置方法**

ECMAScript 5 为数组实例添加了两个位置方法：`indexOf()`和` lastIndexOf()。`这两个方法都接收
两个参数：要查找的项和（可选的）表示查找起点位置的索引。其中，`indexOf()`方法从数组的开头（位
置 0）开始向后查找，`lastIndexOf()`方法则从数组的末尾开始向前查找。

**迭代方法**

ECMAScript 5 为数组定义了 5 个迭代方法。每个方法都接收两个参数：要在每一项上运行的函数和
（可选的）运行该函数的作用域对象——影响 this 的值。传入这些方法中的函数会接收三个参数：数
组项的值、该项在数组中的位置和数组对象本身。根据使用的方法不同，这个函数执行后的返回值可能
会也可能不会影响方法的返回值。以下是这 5 个迭代方法的作用。
 every()：对数组中的每一项运行给定函数，如果该函数对每一项都返回 true，则返回 true。
 filter()：对数组中的每一项运行给定函数，返回该函数会返回 true 的项组成的数组。     **过滤器**
 forEach()：对数组中的每一项运行给定函数。这个方法没有返回值。
 map()：对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组。
 some()：对数组中的每一项运行给定函数，如果该函数对任一项返回 true，则返回 true。
以上方法都不会修改数组中的包含的值。
在这些方法中，最相似的是 every()和 some()，它们都用于查询数组中的项是否满足某个条件。
对 every()来说，传入的函数必须对每一项都返回 true，这个方法才返回 true；否则，它就返回
false。而 some()方法则是只要传入的函数对数组中的某一项返回 true，就会返回 true。请看以下
例子。

```javascript
var numbers = [1,2,3,4,5,4,3,2,1];
var everyResult = numbers.every(function(item, index, array){
 return (item > 2);
});
alert(everyResult); //false
var someResult = numbers.some(function(item, index, array){
 return (item > 2);
});
alert(someResult); //true 

var numbers = [1,2,3,4,5,4,3,2,1];
var filterResult = numbers.filter(function(item, index, array){
 return (item > 2);
});
alert(filterResult); 

var numbers = [1,2,3,4,5,4,3,2,1];
var mapResult = numbers.map(function(item, index, array){
 return item * 2;
});
alert(mapResult); //[2,4,6,8,10,8,6,4,2] 

var numbers = [1,2,3,4,5,4,3,2,1];
var mapResult = numbers.map(function(item, index, array){
 return item * 2;
});
alert(mapResult); //[2,4,6,8,10,8,6,4,2] 
```

在默认情况下，`sort()`方法按升序排列数组项——即最小的值位于最前面，最大的值排在最后面。
为了实现排序，`sort()`方法会调用每个数组项的 `toString()`转型方法，然后比较得到的字符串，以
确定如何排序。即使数组中的每一项都是数值，`sort()`方法比较的也是字符串，

```javascript
var values = [0, 1, 5, 10, 15];
values.sort();
alert(values); //0,1,10,15,5 
```





function 中的arguments对象并非是一个真正的Array ， 但类似与Array，

arguments.callee  callee是arguments得一个属性， 用来指向当前的函数。

```javascript
function fun() {
    console.log(arguments.callee);
}
fun();//fun() { console.log(arguments.callee);}
```

callee也可以用来指向匿名函数。

arguments.callee.caller

caller是function对象的一个属性用于返回一个function引用、它返回调用它的function对象、若直接在全局环境下调用fun1 则返回null、在fun2里调用之后返回fun2





```javascript
var falseObject = new Boolean(false);
var result = falseObject && true;
alert(result); //true
var falseValue = false;
result = falseValue && true;
alert(result); //false 
```

**在Boolean表达式中所有的对象都将转换为true** 



**按照惯例，构造函数始终都应该以一个大写字母开头，而非构造函数则应该以一个小写字母开头。**

任何函数，只要通过 new 操作符来调用，那它就可以作为构造函数；





**动态原型模式**

换句话说，可以通过
检查某个应该存在的方法是否有效，来决定是否需要初始化原型。来看一个例子。

```javascript
function Person(name, age, job){
 //属性
 this.name = name;
 this.age = age;
 this.job = job; 
 //方法
 if (typeof this.sayName != "function"){

 Person.prototype.sayName = function(){
 alert(this.name);
 };

 }
} 

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName(); 
```

注意构造函数代码中加粗的部分。这里只在 sayName()方法不存在的情况下，才会将它添加到原
型中。这段代码只会在初次调用构造函数时才会执行。此后，原型已经完成初始化，不需要再做什么修
改了。不过要记住，这里对原型所做的修改，能够立即在所有实例中得到反映。因此，这种方法确实可
以说非常完美。其中，if 语句检查的可以是初始化之后应该存在的任何属性或方法——不必用一大堆
if 语句检查每个属性和每个方法；只要检查其中一个即可。对于采用这种模式创建的对象，还可以使
用 instanceof 操作符确定它的类型。



**还有一点需要提醒读者，即在通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这
样做就会重写原型链，**

```javascript
function SuperType(){
 this.property = true;
}
SuperType.prototype.getSuperValue = function(){
 return this.property;
};
function SubType(){
 this.subproperty = false;
}
//继承了 SuperType
SubType.prototype = new SuperType();
//使用字面量添加新方法，会导致上一行代码无效
SubType.prototype = {
 getSubValue : function (){
 return this.subproperty;
 },
 someOtherMethod : function (){
 return false;
 }
};
var instance = new SubType();
alert(instance.getSuperValue()); //error!
```

**借用构造函数**

在解决原型中包含引用类型值所带来问题的过程中，开发人员开始使用一种叫做借用构造函数
（constructor stealing）的技术（有时候也叫做伪造对象或经典继承）。这种技术的基本思想相当简单，即
在子类型构造函数的内部调用超类型构造函数。别忘了，函数只不过是在特定环境中执行代码的对象，
因此通过使用 apply()和 call()方法也可以在（将来）新创建的对象上执行构造函数，如下所示：

```javascript
function SuperType(){
 this.colors = ["red", "blue", "green"];
}
function SubType(){
 //继承了 SuperType
 SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors); //"red,blue,green" 
```

**寄生组合式继承**

```javascript
function SuperType(name){
 this.name = name;
 this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function(){
 alert(this.name);
};
function SubType(name, age){
 SuperType.call(this, name); //第二次调用 SuperType()

 this.age = age;
}
SubType.prototype = new SuperType(); //第一次调用 SuperType()
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
 alert(this.age);
}; 
```

因为在组合式继承中有两次构造函数的调用，在第一次调用时此时的SuperType中拥有name和colors属性，但是在第二次由于subType的重写需要在次指向自身，从而调用自己的构造函数还再次的重写SuperType，由于使用call方法，故此时在subType中也拥有name和colors属性，故在此时SuperType原型中的name和colors被屏蔽。

故有此衍生寄生组合式继承

```javascript
function inheritPrototype(subType, superType){
 var prototype = Object(superType.prototype); //创建对象
 prototype.constructor = subType; //增强对象
 subType.prototype = prototype; //指定对象
} 
```



**函数柯里化**

将多个传参的函数转化成只有一个参数的函数

可以推迟函数的执行

```javascript
function add(x , y , z){
    return x + y + z
}

function carry(f){
    var len = f.length
    var arr = []
    return function(arg){
        arr.push(arg)
        if(arr.length < len){
            return arguments.callee
        }else{
            return f.apply(this ,arr)
        }
    }
}

var b = carry(add)
b = b(1)
b = b(2)
b = b(3)
console.log(b)


function carryA(f , arg){
    let len = f.length
    let arr = []
    return (...arg)=>{
        arr.push(...arg)
        if (arr.length < len){
            return carryA.call(this , f , arg)
        }else{
            return f.apply(this , arr)
        }
    }
}

```





webpack  DevServer 反向代理

json-server  模拟 BFF

浏览器硬储存



es6  生成器  anasy await  promise

330

递归调用栈，

当执行函数时，会将函数压入栈中 （实际上是将函数中的局部变量存储在栈中）， 

![avatar](C:\Program Files (x86)\Sublime Text3\HTML\usual\js学习心得\img\调用栈.png)

栈帧

栈帧是指为一个函数调用单独分配的那部分栈空间。

如果一个函数中没有引用另外的函数时，执行完毕后就是被推出栈，所占有的内存也会随之被释放。

尾调用：

在函数执行的最后一步调用，并返回这个函数，

```javascript
function f(x){
  return g(x);
}

// 尾调用正确示范2.0
function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
```

尾递归优化

正常情况下，A函数中调用一个B函数，当A函数执行到调用B函数的时候(假设此时调用B函数并非是最后一步的执行)，此时就会将B函数压入栈中，而如今B函数为当前帧，执行B函数，当B函数执行完毕之后就将执行权移交给A函数。而A函数中的变量，以及调用B函数的位置信息等就都会保存在当前的A函数帧中。

就是在进行尾递归时调用的函数**若并没有引用当前函数的局部变量**(即闭包)的情况下，A函数已然执行到了最后一步，没有在需要执行的地步，按照上述的正常的情况，此时还应当将A函数的帧留在栈中，而将B函数压入栈并进行执行，然而A函数的存在并没有必要，

所以为尾递归优化就会在上述尾递归的情况下将A函数退出栈



设计模式与架构模式

