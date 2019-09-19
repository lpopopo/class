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









