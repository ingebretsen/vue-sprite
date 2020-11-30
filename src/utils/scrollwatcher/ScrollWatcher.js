import ScrollWatcherElement from './ScrollWatcherElement.js';

/*
        ScrollWatcher is intended to be used as a static class. The primary
        external method is ScrollWatcher.watch which is called with an element
        and a series of options. Details about the options are in the file
        ScrollWatcherElement.js.

        Basic usage:

            ScrollWatcher.watch(element, {
                onProgress: (e) => console.log(e.progress)
            });


        If you want to override the global ScrollWatcher defaults, call ScrollWatcher.init()
        with the options to override (before calling watch).

    */

const scrollWatcherDefaults = {};

class ScrollWatcher {
    static init(options) {
        ScrollWatcher.elements = [];
        ScrollWatcher.frames = 0;
        ScrollWatcher.framesRAF = 0;

        ScrollWatcher.options = { ...scrollWatcherDefaults, ...options };

        window.addEventListener('resize', ScrollWatcher._onResize);
        window.addEventListener('scroll', ScrollWatcher._onScroll);

        ScrollWatcher._isInitialized = true;
    }

    static watch(element, options) {
        if (!ScrollWatcher._isInitialized) {
            ScrollWatcher.init();
        }

        var watcherElement = new ScrollWatcherElement(element, options);
        ScrollWatcher.elements.push(watcherElement);

        return watcherElement;
    }

    static removeWatch(watcherElement) {
        var idx = this.elements.indexOf(watcherElement);
        this.elements = this.elements.slice(0, idx).concat(this.elements.slice(idx + 1, this.elements.length));
    }

    static _onResize() {
        ScrollWatcher.elements.forEach((element) => {
            element.updatePosition();
        });
    }

    // handle normal scroll events
    static _onScroll() {
        var scrollTop = window.scrollY;
        var i = 0;
        for (; i < ScrollWatcher.elements.length; i++) {
            ScrollWatcher.elements[i].updateProgress(scrollTop);
        }
    }

    // static extend(initOptions, watchOptions, callbacks) {
    //     app.controls.ScrollWatcherElement._extend(options, callbacks);
    // }
}

export default ScrollWatcher;
