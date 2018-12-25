<template>
  <button class="modis-button" :class="classes" @click="click" :disabled="load">
    <div class="modis-container">
      <m-svg v-if="load" name="three-dots"></m-svg>
      <slot v-else></slot>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: ""
    },
    load: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return [
        {
          "modis-button--icon": this.icon,
          "modis-button--flat": this.flat,
          "modis-button--round": this.round,
          "modis-button--active": this.active
        },
        this.color ? `modis-button--${this.color}` : "",
        this.size ? `modis-button--${this.size}` : ""
      ];
    }
  },
  methods: {
    click(e) {
      this.$emit("click", e);
    }
  }
};
</script>
