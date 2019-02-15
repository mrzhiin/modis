<template>
  <div>
    <div ref="modis"></div>
  </div>
</template>

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

