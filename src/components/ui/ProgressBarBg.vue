<template>
  <div class="progress-bar-bg">
    <div :class="progressClass" :style="progressStyle"></div>
  </div>
</template>

<script>
export default {
  name: "ProgressBarBg",
  props: {
    progress: {type: Number, max: 100, min: 0, default: 0},
    variant: {type: String, default: "primary"}
  },
  computed: {
    progressClass: function () {
      const res = ['progress'];
      if (['primary', 'danger'].includes(this.variant)) {
        res.push("progress_" + this.variant)
      }
      return res.join(' ');
    },
    progressStyle: function () {
      return {
        width: this.progress + "%"
      }
    }
  }
}
</script>

<style lang="scss">
.progress-bar-bg {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: -1;

  .progress {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    transition: width 0.5s;

    &_primary {
      background: #F5F9FF;
    }

    &_danger {
      background: #fff5f5;
    }
  }
}
</style>
