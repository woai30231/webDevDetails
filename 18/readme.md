我们在开发的过程中，经常会有这样一种情况，函数被频繁的调用，如果这个函数执行了某些dom操作的话，那么浏览器将会非常耗费性能，从而影响用户体验。

比如下面的代码，我们在滚动的过程中，会频繁的调用函数：

```html
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>demo</title>
    <style type="text/css">
        body{
            height:3000px;
        }
    </style>
</head>
<body>
    <script>
        function fn(){
            console.log("invoke fn function");
        };
        document.body.onscroll = fn;
    </script>
</body>
</html>
```

我们打开浏览器，然后打开控制台，滚动鼠标的时候，控制台频繁的打印“invoke fn function”。我们这里为了显示，所以没有涉及到相关dom操作，但是实际开发过程中，更多场景是操作dom，那么将会使你的浏览器瞬间卡卡的感觉，有没有法子来限制一下fn的调用频率呢，答案是可以的，对此，我们将上面的代码改变如下：

```html
```
