<template>
  <svg class="modis-svg">
    <use :xlink:href="link" />
  </svg>
</template>

<script>
// ICON
let icons = require.context("@/assets/icon", true, /\.svg$/);
icons.keys().forEach(icons);

export default {
  props: {
    name: {
      type: String,
      default: ""
    }
  },
  computed: {
    link() {
      return `#modis-${this.name}`;
    }
  }
};
</script>
