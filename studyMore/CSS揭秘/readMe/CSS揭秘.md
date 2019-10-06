#  CSS揭秘

#### 注意事项

**em**

1 em = 当前字体尺寸

**rem**

rem 指的是 Root em ，指的是根元素的字体大小， 在web文档中的根元素就是`html`元素，默认的html字体大小为`16px`

 

对一个按钮添加一些效果

```css
padding: 6px 16px;
border: 1px solid #446d88;
background: #58a linear-gradient(#77a0bb, #58a);
border-radius: 4px;
box-shadow: 0 1px 5px gray;
color: white;
text-shadow: 0 -1px 1px #335166;
font-size: 20px;
line-height: 30px;
```

这段代码的可维护性就存在一定的问题

首先：如果我们改变字体大小， 或者想改变按钮的大小，就必须改变font-size 和  line-height , 因为我们把两个属性写成了绝对值。**所以当两个值之间相互依赖时，应该用相互关系的代码表示。**如：

```css
font-size:20px;
line-height:1.5;
```

如果我们对父级的字号进行修改，就不得不对其子元素进行相应的修改，反而，如果我们将子元素的font-size设为百分比或者将其使用em单位就方便得多。

在将按钮的其他属性单位改成em就可以做到自由协调缩放(具体内容见代码)



**`currentColor`**

它是从`SVG`那里借鉴而来，他没有固定绑定的值，而是一直被解析为color。它会自动从文本颜色哪里得到颜色。(具体案列见code)



**继承**

inherit, inherit 可以用在任何`css`属性中，他绑定到父级的计算值。对伪元素而言绑定到他的宿主元素。



**关于响应式**

每个媒体查询都会增加开销，添加的媒体查询越多，`css`代码就越经不住折腾。**你只因将它作为最后的手段**

本来我们所用的盒子就是弹性的(见CSS揭秘43页)，其实很多的媒体查询都是不必要的。



#### 多重边框

​                  **border-shadow:   0px          0px         5px        10px         red;**

其属性前面可接受四个参数 ，第一个为水平的偏移量 ， 第二个为垂直方向的偏移量

第三个参数为阴影的模糊的距离 ， 第四个参数为阴影在水平扩散的距离

**outline**

可以用来做虚线边框

在使用outline的情况中，在使用border-radius的时候outline得边框并不会随border的变化而变化，这被css工作组认为为bug ，至今未被修复。

**波点**

利用径向渐变，可以创建圆和椭圆，甚至是其中的一部分。

利用css预处理器可以达到可维护性，

**棋盘**

在这里棋盘中的每一个的正方形的组成都可以看成是两个三角形的组合拼凑而成，而三角形的构成在前面已经进行相应的实现了。主要是利用linear-gradient属性将三角形实现，而后则将三角形进行拼凑，拼凑的方式通过background-position进行移动拼凑。

在这里主要说的是有另一中新方法进行更加简单的实现。css新方法，定义了一种新型的渐变方式，称为角向渐变，也是上文中的background中的repeating-conic-gradient属性，生成方式为所有色标变化都由一条射线绕一点推动进行。

#### 伪随机背景

**蝉原则：**

利用质数来提高伪随机性

#### 连续的图像边框

连续的图像边框就是利用background的linear-gradient属性从white到white的渐变背景，这里需要设置得就是background-clip属性。将linear-gradient所设置的背景知道padding-box就结束，而在之后的url()引入图片中设置background-clip到border-box就形成了连续边框的样子。

```css
padding: 1em;
border: 1em solid transparent;
background:
 linear-gradient(white, white) padding-box,
 url(stone-art.jpg) border-box 0 / cover;
```





## 形状

#### 自定义椭圆

border-radius可以接受两个值 ， 一个水平方向，一个垂直方向。接受px，也接受百分比。

border-radius还可以对四个角中的每一个进行相应的设置。可以单独设定，还可以一起设定 ， 从左上角开始，顺时针方向依次应用到四个角。

#### 平行四边形

可以通过skew()方法对矩形进行斜向拉伸 ， 但是此方法不仅会让容器变形，而且会让字体也一起变形。

所以我们需要的是一种容器发生变化而字体内容并不会发生改变的方法。

解决方法

1.可以使用两层HTML元素，先对外层元素使用skew()，而后再对内层元素进行相对应反向skew(),可以实现

2.可以将所有的变形样式和属性都添加到伪元素上，在将伪元素的尺寸拉伸到父级元素的尺寸。从而使父级元素不会受到相应的影响。

####菱形

对于菱形而言，在css中并没有完全的属性进行相应的直接变换。

解决方法1：

使用两层HTML元素，外层元素先旋转45°，然后子元素在进行相应的反方向45°旋转回来。

这里需要注意的是旋转后，子元素的高度对应的就是父级元素的对角线，所以还得做相应的调节。

可以使子元素的宽高变为原来的根号2倍，或者使用scale()

方法二：

可以使用clip-path属性

```css
img {
 clip-path: polygon(50% 0, 100% 50%,
 50% 100%, 0 50%);
 transition: 1s clip-path;
}
img:hover {
 clip-path: polygon(0 0, 100% 0,
 100% 100%, 0 100%);
}
```

他可以进行HTML元素的剪裁，甚至还可以用在动画上。

#### 切角效果

解决方法一：

依旧可以利用渐变色设计出一个三角形，对元素进行掩盖。

**弧形切角**

与切角不同的是，弧形切角的实现的方式就是将渐变用径向渐变实现

```css
background: #58a;
background:
 radial-gradient(circle at top left,
 transparent 15px, #58a 0) top left,
 radial-gradient(circle at top right,
 transparent 15px, #58a 0) top right,
 radial-gradient(circle at bottom right,
 transparent 15px, #58a 0) bottom right,
 radial-gradient(circle at bottom left,
 transparent 15px, #58a 0) bottom left;
background-size: 50% 50%;
background-repeat: no-repeat
```





