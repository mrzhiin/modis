# 使用

## 引用

### NPM

```
npm i @mrzhiin/modis
```

### 浏览器

```html
<script src="path/modis.min.js"></script>
```

或者分别引入资源

```html
<script src="//cdn.jsdelivr.net/npm/leancloud-storage@3.11.0/dist/av-min.js"></script>
```

```html
<script src="path/modis.slim.min.js"></script>
```

## 调用

新建一个元素，用来显示评论

```html
<div id="modis"></div>
```

之后运行 Modis

```html
<script>
  new Modis({
    el: "#modis",
    appId: "",
    appKey: ""
  });
</script>
```
