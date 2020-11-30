<template>
  <div class="app">
    <scroll-watcher
      class="app__scroll-watcher"
      @scroll-progress="onScrollProgress"
    />
    <sprite-sequencer
      class="app__sprite"
      :frame-sources="frameSources"
      :frame-index="frameIndex"
    />
  </div>
</template>

<script>
import sprite from "../public/sprite/sprite.json";
import SpriteSequencer from "./components/SpriteSequencer.vue";
import ScrollWatcher from "./components/ScrollWatcher.vue";

function supportsWebp() {
  var c = document.createElement("canvas");
  if (c.getContext && c.getContext("2d")) {
    return c.toDataURL("image/webp").indexOf("data:image/webp") == 0;
  } else {
    return false;
  }
}

export default {
  name: "App",
  components: {
    SpriteSequencer,
    ScrollWatcher,
  },
  data() {
    return {
      frameIndex: 0,
    };
  },
  computed: {
    frameSources() {
      return supportsWebp ? sprite.webp : sprite.png;
    },
  },
  methods: {
    onScrollProgress(p) {
      this.frameIndex = Math.round(p * (this.frameSources.length - 1));
    },
  },
};
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
}
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  color: #2c3e50;

  &__sprite {
    border: 1px solid black;
    box-sizing: border-box;
    width: 90vw;
    height: 90vh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__scroll-watcher {
    height: 500vh;
    border: 1px solid green;
  }
}
</style>
