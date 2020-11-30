/* =============================================================================

(FIGURE 5-b)

A visual explanation of the difference between 'cover' progress mode and
'contain' progress mode. Basic idea:

Use 'cover' if you want progress to start when the element first enters
the viewport from the bottom and end when it fully exits from the top.

Use 'contain' if you want progress to start when the element is fully in
the viewport (as much as possible) and end once it starts to leave. contain
has slighty different behavior if the element is taller than the viewport.

-------------------------------------     -------------------------------------
        progressMode = 'cover'                  progressMode = 'contain'
-------------------------------------     -------------------------------------

    0.0          0.5          1.0              0.0          0.5          1.0

                                #####
+---------+  +---------+  +--#####--+     +---------+  +---------+  +--#####--+
|         |  |  #####  |  |         |     |         |  |  #####  |  |  #####  |
|         |  |  #####  |  |         |     |  #####  |  |  #####  |  |         |
+--#####--+  +---------+  +---------+     +--#####--+  +---------+  +---------+
    #####
                                #####
                                #####                                     #####
                                #####                        #####        #####
+---------+  +--#####--+  +--#####--+     +--#####--+  +--#####--+  +--#####--+
|         |  |  #####  |  |         |     |  #####  |  |  #####  |  |  #####  |
|         |  |  #####  |  |         |     |  #####  |  |  #####  |  |  #####  |
+--#####--+  +--#####--+  +---------+     +--#####--+  +--#####--+  +--#####--+
    #####                                     #####        #####
    #####                                     #####
    #####

============================================================================= */

const watcherElementDefaults = {
    // the area of the viewport that gets watched, default is the full screen but a single
    // line in the middle of the screen could be specified as {viewportTop: 0.5, viewportHeight: 0}
    viewportStart: 0,
    viewportHeight: 1,

    // TODO: better names than cover and contain?
    // see Figure 5-b above, options are 'cover' and 'contain'
    progressMode: 'cover',

    // called when page the scrolls, regardless of where the element is relative to the viewport
    onScroll: null,

    // called on page scroll if progress is 0 to 1
    onProgress: null,

    // called when the element enters the viewport
    onEnter: null,
    onEnterFromAbove: null,
    onEnterFromBelow: null,

    // called when the element exits the viewport
    onExit: null,
    onExitToAbove: null,
    onExitToBelow: null,

    // called when the element enters or exits the viewport
    onEnterOrExit: null
};

class ScrollWatcherElement {
    constructor(element, options) {
        Object.assign(this, watcherElementDefaults, options);

        this.element = element;
        this.isFirstUpdate = true;
        this.frameCount = 0;

        this.calc = {
            element: element,
            viewport: {}
        };

        this.updatePosition();
        this.updateProgress(window.scrollY);
    }

    // called by ScrollWatcher on resize
    updatePosition() {
        if (!this.element) {
            return;
        }

        // update the viewport
        this.calc.windowHeight = window.innerHeight;
        this.calc.viewport.top = this.calc.windowHeight * this.viewportStart;
        this.calc.viewport.height = this.calc.windowHeight * this.viewportHeight;
        this.calc.viewport.bottom = this.calc.viewport.top + this.calc.viewport.height;

        // get the dimensions and location of the watched element
        var r = this.element.getBoundingClientRect();
        this.calc.elementRect = {
            top: r.top + window.scrollY,
            bottom: r.top + r.height + window.scrollY,
            height: r.height
        };

        if (this.progressMode === 'contain') {
            // CONTAIN PROGRESS
            // Occurs as the element overlaps the viewport (details in comments below)

            if (this.calc.elementRect.height <= this.calc.viewport.height) {
                // If element is smaller than viewport...
                // overlapping begins when the bottom of the element meets the bottom of the viewport
                this.calc.progressBegin = Math.round(this.calc.elementRect.bottom - this.calc.viewport.bottom);
                this.calc.progressDuration = Math.round(this.calc.viewport.height - this.calc.elementRect.height);
            } else {
                // If element is larger than viewport...
                // begin when the top of the element is at the top of the viewport
                this.calc.progressBegin = Math.round(this.calc.elementRect.top - this.calc.viewport.top);
                this.calc.progressDuration = Math.round(this.calc.elementRect.height - this.calc.viewport.height);
            }
        } else {
            // cover PROGRESS
            // Occurs as any part of the element is within any part of the viewport

            this.calc.progressBegin = Math.round(this.calc.elementRect.top - this.calc.viewport.bottom);
            this.calc.progressDuration = Math.round(this.calc.viewport.height + this.calc.elementRect.height);
        }

        this.calc.progressEnd = this.calc.progressBegin + this.calc.progressDuration;
    }

    // called by ScrollWatcher on window scroll events
    updateProgress(scrollTop) {
        this.calc.wasInViewport = this.calc.isInViewport;
        this.calc.wasAboveViewport = this.calc.isAboveViewport;
        this.calc.wasBelowViewport = this.calc.isBelowViewport;

        // delta
        this.calc.lastScrollTop = this.calc.currentScrollTop ? this.calc.currentScrollTop : scrollTop;
        this.calc.currentScrollTop = scrollTop;
        this.calc.scrollDelta = scrollTop - this.calc.lastScrollTop;

        // progress
        this.calc.actualProgress = (scrollTop - this.calc.progressBegin) / this.calc.progressDuration;
        this.calc.progress = Math.max(0, Math.min(1, this.calc.actualProgress));

        // viewport
        this.calc.isAboveViewport = this.calc.actualProgress > 1;
        this.calc.isBelowViewport = this.calc.actualProgress < 0;
        this.calc.isInViewport = this.calc.actualProgress > 0 && this.calc.actualProgress <= 1;

        // scroll callback
        if (this.onScroll) {
            this.onScroll(this.calc);
        }

        // progress callback
        if ((this.calc.isInViewport || this.calc.wasInViewport) && this.onProgress) {
            this.onProgress(this.calc);
        }

        // enter callbacks
        if (
            (!this.calc.wasInViewport && this.calc.isInViewport) ||
            (this.calc.wasAboveViewport && !this.calc.isAboveViewport) ||
            (this.calc.wasBelowViewport && !this.calc.isBelowViewport)
        ) {
            if (this.onEnter) {
                this.onEnter(this.calc);
            }

            if (this.onEnterOrExit) {
                this.onEnterOrExit(this.calc);
            }

            if (this.calc.wasBelowViewport && !this.calc.isBelowViewport && this.onEnterFromBelow) {
                this.onEnterFromBelow(this.calc);
            }

            if (this.calc.wasAboveViewport && !this.calc.isAboveViewport && this.onEnterFromAbove) {
                this.onEnterFromAbove(this.calc);
            }
        }

        // exit callbacks
        if ((this.calc.wasInViewport && !this.calc.isInViewport) || (this.isFirstUpdate && this.calc.isAboveViewport)) {
            if (this.onExit) {
                this.onExit(this.calc);
            }

            if (this.onEnterOrExit) {
                this.onEnterOrExit(this.calc);
            }

            if (this.calc.isAboveViewport && this.onExitToAbove) {
                this.onExitToAbove(this.calc);
            }

            if (this.calc.isBelowViewport && this.onExitToBelow) {
                this.onExitToBelow(this.calc);
            }
        }

        this.isFirstUpdate = false;
    }
}

export default ScrollWatcherElement;
