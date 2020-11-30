<template>
  <div>
    <slot />
  </div>
</template>

<script>
import ScrollWatcherBase from "../utils/scrollwatcher/ScrollWatcherBase.vue";

export default {
  name: "scroll-watcher",
  mixins: [ScrollWatcherBase],
  props: {
    progressMode: { type: String, default: "contain" },
    viewportStart: { type: Number, default: 0 },
    viewportHeight: { type: Number, default: 1 },
  },
  data() {
    return {
      scrollWatcherConfig: {
        progressMode: this.progressMode,
        viewportStart: this.viewportStart,
        viewportHeight: this.viewportHeight,
      },
    };
  },
  watch: {
    scrollProgress(nv) {
      this.$emit("scroll-progress", nv);
    },
  },
  mounted() {},
};
</script>
