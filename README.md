# Modis

A comment system depends on Lencloud.

**Warning:This is not perfect yet**

## Getting Started

### Installation

You can download `modis.min.js` or `modis.slim.min.js`.

- `modis.min.js`

```html
<script src="path/modis.min.js"></script>
```

- `modis.slim.min.js`

```html
<script src="//cdn.jsdelivr.net/npm/leancloud-storage@3.11.0/dist/av-min.js"></script>
<script src="path/modis.slim.min.js"></script>
```

### Usage

```html
<div id="modis"></div>
<script>
  new Modis({
    el: "#modis",
    appId: "",
    appKey: ""
  });
</script>
```

## Options

| Option   | Type           | Description             | Default |
| -------- | -------------- | ----------------------- | ------- |
| `el`     | string/Element | CSS selector or Element |         |
| `appId`  | string         | Leancloud appId         |         |
| `appKey` | string         | Leancloud appKey        |         |
| `locale` | string         | Language                | `zh-CN` |

### _Languages_

- `en`:English

- `zh-CN`:Chinese Simplified
