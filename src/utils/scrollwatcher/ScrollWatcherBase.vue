<script>
import ScrollWatcher from './ScrollWatcher';

export default {
    data: function() {
        return {
            scrollProgress: null,
            srollActualProgress: null,
            isAboveViewport: false,
            isBelowViewport: false,
            isInViewport: true,
            isScrolling: true,

            // derived classes can override this
            scrollWatcherConfig: {
                progressMode: 'cover',
                viewportStart: 0,
                viewportHeight: 1
            }
        };
    },
    created() {},
    mounted() {
        ScrollWatcher.watch(this.$el, {
            ...this.scrollWatcherConfig,
            onScroll: (e) => {
                this.scrollProgress = Math.round(e.progress * 10000) / 10000;
                this.srollActualProgress = e.actualProgress;
                this.isAboveViewport = e.isAboveViewport;
                this.isBelowViewport = e.isBelowViewport;
                this.isInViewport = e.isInViewport;

                if (this.scrollTimeout) {
                    clearTimeout(this.scrollTimeout);
                }
                this.scrollTimeout = setTimeout(() => {
                    this.isScrolling = false;
                }, 50);

                this.isScrolling = true;
            }
        });
    },

    methods: {}
};
</script>
