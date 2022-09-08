<template>
  <div id="app">
    <header id="header">
      <router-link to="/">
        <Logo/>
      </router-link>
    </header>
    <main id="main">
      <router-view/>
    </main>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap');

html, body {
  height: 100%;
}

body {
  padding: 0;
  margin: 0;

  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 19px;
  height: 100%;
  position: relative;
}

#app {
  min-height: 100%;
  display: grid;

}

#main {
  min-height: 100%;
}

#header {
  padding: 32px;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;

}

.container {
  max-width: 960px;
  margin: 0 auto;
}

.text-muted {
  color: #ccc;
}

.text-error {
  color: maroon;
}

%btn_link-shared {
  text-decoration: underline;

  &:active {
    top: 0px;
    left: 0px;
  }
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  position: relative;
  text-decoration: none;
  display: inline-block;

  &:active {
    top: 1px;
    left: 1px;
  }

  &:disabled:hover,
  &:disabled {
    cursor: default;
    opacity: 0.9;
  }

  &_primary {
    background: #5FA0F8;
    background: linear-gradient(180deg, #5FA0F8 0%, #3E83F7 100%);
    color: #fff;

    &:hover {
      background: #3E83F7;
      background: linear-gradient(180deg, #3E83F7 0%, #5FA0F8 100%);
    }

    &:disabled:hover,
    &:disabled {
      background: linear-gradient(180deg, #5FA0F8 0%, #3E83F7 100%);
    }
  }

  &_link.btn {
    @extend %btn_link-shared;
  }

  &_link_primary.btn {
    @extend %btn_link-shared;
    color: #5FA0F8;
  }

  &_link_secondary.btn {
    @extend %btn_link-shared;
    color: #ccc;
  }

}
</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Logo from './components/Logo.vue';

@Component({
  components: {
    Logo,
  },
})
export default class App extends Vue {}
</script>
