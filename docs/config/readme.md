# 配置

## 基本选项

### el

- 类型：`string/Element`
- 默认值：`""`

CSS 选择器或 DOM 元素，用来显示评论区域

### backend

- 类型：`string`
- 默认值：`"valine"`

选择使用哪种后端服务，当前支持`valine`、`leancloud`

### locale

- 类型：`string`
- 默认值：`"zh-CN"`

显示语言，支持如下：

- `en`：English
- `zh-CN`：Chinese Simplified

### gravatar

- 类型：`string`
- 默认值：`"https://www.gravatar.com/avatar/"`

Gravatar 头像地址

### gravatarParameters

- 类型：`string`
- 默认值：`"?d=mp"`

请求 Gravatar 头像时附加的参数

### spa

- 类型：`boolean`
- 默认值：`false`

重复调用 `new Modis` 会触发 Leancloud sdk 错误。此时需要先调用 [`Modis.initAv`](#initav) （不可重复调用），之后将该值设为 `true` 就可以重复调用 `new Modis` 。

### pathnameGenerator

- 类型：`function`
- 默认值：
  ```js
  function() {
    return window.location.pathname;
  }
  ```

默认使用 `window.location.pathname` 来区分不同页面，从而区分不同评论。

## valine 选项

### appId

- 类型：`string`
- 默认值：`""`

Leancloud 的 appId

### appKey

- 类型：`string`
- 默认值：`""`

Leancloud 的 appKey

## leancloud 选项

### appId

- 类型：`string`
- 默认值：`""`

Leancloud 的 appId

### appKey

- 类型：`string`
- 默认值：`""`

Leancloud 的 appKey

## 方法

### initAV

用来初始化 Leancloud sdk

```js
Modis.initAV({
  appId: "", //leancoud appId
  appKey: "" //leancloud appKey
});
```
