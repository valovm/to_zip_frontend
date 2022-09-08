<template>
  <a :class="btnClass" @click="onClickHandler" role="button">
    <slot></slot>
  </a>
</template>


<script>
export default {
  name: "Btn",
  props: {
    variant: {type: String, default: "primary"},
    onClick: {type: Function}
  },
  computed: {
    btnClass: function () {
      const res = ['btn'];
      if (['primary', 'link', 'link_secondary', 'link_primary'].includes(this.variant)) {
        res.push("btn_" + this.variant)
      }
      return res.join(' ');
    },
  },
  methods: {
    onClickHandler() {
      if (this.onClick) {
        this.onClick();
      }
    }
  }
}
</script>

