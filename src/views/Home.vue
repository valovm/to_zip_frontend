<template>
  <Converter></Converter>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Converter from '../components/Converter.vue';

@Component({
  components: {
    Converter,
  },
})
export default class Home extends Vue {}
</script>


<style lang="scss">
.home {
  height: 100%;
  display: grid;
  align-content: space-around;
}
</style>
