<template>
  <canvas class="sprite-sequencer" ref="canvas" />
</template>

<script>
// import { mapState } from 'vuex';
// import Component from '~/components/Component.vue';
// import Mixin from '~/components/Mixin.vue';
import { contain, cover } from "../utils/aspect.js";

export default {
  name: "sprite-sequencer",
  props: {
    frameIndex: { type: Number, default: 105 },
    frameSources: { type: Array },
    fillMode: { type: String, default: "contain" },
  },
  data: function () {
    return { frames: [] };
  },
  computed: {
    currentFrame() {
      return this.frames[this.frameIndex];
    },
  },
  watch: {
    frameIndex() {
      this.render();
    },
    frameSources: {
      immediate: true,
      handler(nv) {
        let frames = nv.map((src) => {
          return {
            src: src,
          };
        });

        let sources = [...new Set(nv)];

        sources.forEach((src) => {
          let img = new Image();
          img.onload = () => {
            this.frames
              .filter((f) => f.src == src)
              .forEach((f) => {
                // store reference the image
                f.img = img;
                f.rect = { x: 0, y: 0, width: img.width, height: img.height };

                // render if this is the current frame
                if (this.frames.indexOf(f) == this.frameIndex) {
                  this.render();
                }
              });
          };
          img.src = src;
        });

        this.frames = frames;
      },
    },
  },
  mounted: function () {
    // convenience reference to the canvas
    this.canvas = this.$refs.canvas;
    //set the width and height of the canvas
    this.resize();
  },
  methods: {
    resize() {
      // for retina / high-dpi
      let scale = 2;

      this.canvas.width = this.canvas.offsetWidth * scale;
      this.canvas.height = this.canvas.offsetHeight * scale;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.scale(scale, scale);
    },
    render() {
      console.log(`render: ${this.frameIndex}`);
      this.ctx.clearRect(
        0,
        0,
        this.canvas.offsetWidth,
        this.canvas.offsetHeight
      );

      let frame = this.frames[this.frameIndex];
      console.log(`frame: 👉 ${JSON.stringify(frame, null, 4)}`);

      let frameRect = frame.rect;

      let fillFunction = this.fillMode == "cover" ? cover : contain;

      let destRect = fillFunction(
        {
          width: frameRect.width,
          height: frameRect.height,
        },
        {
          width: this.canvas.offsetWidth,
          height: this.canvas.offsetHeight,
        }
      );
      this.ctx.drawImage(
        frame.img,
        frameRect.x,
        frameRect.y,
        frameRect.width,
        frameRect.height,
        destRect.x,
        destRect.y,
        destRect.width,
        destRect.height
      );
    },
  },
};
</script>

<style lang="scss">
.sprite-sequencer {
  &__frame {
    position: absolute;
    left: 0;
    top: 0;

    min-height: 100px;
    min-width: 100px;
  }
  // add styles here
}
</style>
