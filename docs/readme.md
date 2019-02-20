---
home: true
heroText: Modis
tagline: 依赖单独后端服务的评论服务（不完善）
actionText: 开始使用
actionLink: /guide/
footer: MIT Licensed
---

<div ref="modis"></div>

<script>
export default {
  mounted: async function() {
    await this.$nextTick();

    new Modis({
      el: this.$refs.modis,
      backend: "leancloud",
      spa: true
    });
  }
};
</script>
