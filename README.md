# Modis

[![](https://img.shields.io/travis/com/mrzhiin/modis.svg)](https://travis-ci.com/mrzhiin/modis)
[![](https://img.shields.io/npm/v/@mrzhiin/modis.svg)](https://www.npmjs.com/package/@mrzhiin/modis)

Comment service for web

## Getting Started

### Installation

Use NPM or Yarn

```shell
npm i @mrzhiin/modis

yarn add @mrzhiin/modis
```

Use Browser

- Full

```html
<script src="path/modis.min.js"></script>
```

- Lite

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
    backend: "leancloud",
    backendConfig: {
      appId: "",
      appKey: ""
    }
  });
</script>
```

## Options

| Option               | Type           | Description                                              | Default                            |
| -------------------- | -------------- | -------------------------------------------------------- | ---------------------------------- |
| `el`                 | string/Element | CSS selector or Element                                  |                                    |
| `locale`             | string         | Language                                                 | `zh-CN`                            |
| `gravatar`           | string         | Gravatar request URL                                     | `https://www.gravatar.com/avatar/` |
| `gravatarParameters` | string         | Gravatar request URL's combining parameters(Don't use s) | `?d=mp&s=60`                       |
| `pageSize`           | number         | Number of comment displayed per page                     | `10`                               |
| `pathnameGenerator`  | function       |                                                          |                                    |
| `theme`              | string         | Theme                                                    | `auto`                             |
| `backend`            | string         | Backend service                                          | `leancloud`                        |
| `backendConfig`      | object         | Backend service config                                   |                                    |

## Backend service

### leancloud

| Option   | Type    | Description          | Default |
| -------- | ------- | -------------------- | ------- |
| `appId`  | string  | Leancloud App appId  | ``      |
| `appKey` | string  | Leancloud App appKey | ``      |
| `spa`    | boolean |                      | `false` |

### valine

| Option   | Type    | Description          | Default |
| -------- | ------- | -------------------- | ------- |
| `appId`  | string  | Leancloud App appId  | ``      |
| `appKey` | string  | Leancloud App appKey | ``      |
| `spa`    | boolean |                      | `false` |

## [Document](https://modis.netlify.com/)
