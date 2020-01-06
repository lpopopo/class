# share

## JSON.stringify()

在我们使用redux改变状态的时候,都会使用深拷贝的方法对原来的状态进行深拷贝之后在进行修改，在return返回．

实现最简单的深拷贝的方法就是

```javascript
JSON.parse(JSON.stringify())
```

### JSON.stringify() 的特性

在使用JSON.stringify()有些许的注意事项

- **对于 `undefined`、任意的函数以及 `symbol` 三个特殊的值分别作为对象属性的值、数组元素、单独的值时 `JSON.stringify()`将返回不同的结果。**

  ```javascript
  const obj = {
    a: 'aaa',
    b:undefined,
    c:Symbol('c'),
    d:()=>{console.log('1')}
  }
  console.log(JSON.stringify(obj))     //{"a":"aaa"}
  
  const arr = ['aaa' , undefined , Symbol('c') , ()=>{console.log('d')}]
  
  console.log(JSON.stringify(arr)) //["aaa",null,null,null]
  ```

  `undefined`、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 `null`（出现在数组中时）。函数、undefined 被单独转换时，会返回 undefined，如`JSON.stringify(function(){})` or `JSON.stringify(undefined)`.

- 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

- toJOSN方法

如果一个被序列化的对象拥有 `toJSON` 方法，那么该 `toJSON` 方法就会覆盖该对象默认的序列化行为：不是该对象被序列化，而是调用 `toJSON` 方法后的返回值会被序列化，例如：

````javascript
var obj = {
  foo: 'foo',
  toJSON: function () {
    return 'bar';
  }
};
JSON.stringify(obj);      // '"bar"'
JSON.stringify({x: obj}); // '{"x":"bar"}'
````



### JSON.stringify()的第二个参数

JOSN.stringify()的第二个参数可以是函数也可以是数组.

```javascript
//此时的key只是一个空字符串,而value是整个对象 ,第一个被传入 replacer 函数的是 {"":{}}
JSON.stringify(obj ,  (key , value)=>{
 })

JSON.stringify(obj, (key, value) => {
  switch (true) {
    case typeof value === "undefined":
      return "undefined";
    case typeof value === "symbol":
      return value.toString();
    case typeof value === "function":
      return value.toString();
    default:
      break;
  }
  return value;
})                                                        //"{"a":"aaa","b":"undefined","c":"Symbol(c)","d":"()=>{console.log('1')}"}"


//但第二个参数为数组时 ,数组的值就代表了将被序列化成 JSON 字符串的属性名。
const test = {
  a: 'a',
  b:'b',
  c:'c',
  d:'d'
}
console.log(JSON.stringify(test , ['a' , 'b']))
```

### JOSN.stringify()的第三个参数

指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；如果该参数没有提供（或者为 null），将没有空格.

## Taro

[官方文档](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)

**Taro** 是一套遵循 [React](https://reactjs.org/) 语法规范的 **多端开发** 解决方案。

现如今市面上端的形态多种多样，Web、React-Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

使用 **Taro**，我们可以只书写一套代码，再通过 **Taro** 的编译工具，将源代码分别编译出可以在不同端（微信/百度/支付宝/字节跳动/QQ小程序、快应用、H5、React-Native 等）运行的代码。

### 安装

```
//首先，你需要使用 npm 或者 yarn 全局安装@tarojs/cli，或者直接使用npx:
$ npm install -g @tarojs/cli
```

### 初始化项目

```
taro init myapp
```

### 运行

```
//运行微信小程序
npm run dev:weapp
//打包编译成为小程序
npm run bulid:weapp
```

