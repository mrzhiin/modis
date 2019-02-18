module.exports = {
  title: "Modis",
  base: "/modis/",
  head: [
    [
      "script",
      {
        src:
          "https://cdn.jsdelivr.net/npm/@mrzhiin/modis@1.0.3/dist/modis.min.js"
      }
    ],
    [
      "script",
      {
        src: "/main.js"
      }
    ]
  ],
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/" },
      { text: "配置", link: "/config/" }
    ],
    sidebar: {
      "/guide/": ["", "use", "backend"]
    },
    repo: "https://github.com/mrzhiin/modis"
  }
};
