// Super simple tweening
// Usage: tween(from: 0, to: 1, dur: 1000, update: (v) => {}, complete: () => {}, ease: 'linear');

const EaseIn = power => t => Math.pow(t, power);
const EaseOut = power => t => 1 - Math.abs(Math.pow(t - 1, power));
const EaseInOut = power => t =>
    t < 0.5 ? EaseIn(power)(t * 2) / 2 : EaseOut(power)(t * 2 - 1) / 2 + 0.5;

const Easing = {
    linear: EaseInOut(1),
    easeInQuad: EaseIn(2),
    easeOutQuad: EaseOut(2),
    easeInOutQuad: EaseInOut(2),
    easeInCubic: EaseIn(3),
    easeOutCubic: EaseOut(3),
    easeInOutCubic: EaseInOut(3),
    easeInQuart: EaseIn(4),
    easeOutQuart: EaseOut(4),
    easeInOutQuart: EaseInOut(4),
    easeInQuint: EaseIn(5),
    easeOutQuint: EaseOut(5),
    easeInOutQuint: EaseInOut(5),
};

let nextTweenId = 1;
let activeTweens = {};

function tweenValue(from, to, cb, { time, done, easeFunc, delay } = {}) {
    const id = nextTweenId++;
    activeTweens[id] = true;
    const ease = easeFunc || Easing.linear;
    const diff = from - to;
    const targetTime = time;
    delay = delay ? delay : 0;
    let start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - (start + delay);
        if (activeTweens[id]) {
            if (elapsed >= delay) {
                const percentage = Math.min((elapsed - delay) / targetTime, 1);
                cb(from - ease(percentage) * diff);
            }
            if (elapsed < targetTime + delay) {
                window && window.requestAnimationFrame(step);
            } else {
                cb(to);
                done && done();
            }
        }
    }
    window && window.requestAnimationFrame(step);
    return id;
}

export { Easing };

export default function tween({
    from = 0,
    to = 1,
    dur = 1000,
    delay = 0,
    update = null,
    complete = null,
    ease = 'easeInOutQuart',
}) {
    if (typeof ease === 'string' || ease instanceof String) {
        ease = Easing[ease];
    }
    let id = tweenValue(from, to, update, {
        time: dur,
        done: complete,
        delay: delay,
        easeFunc: ease,
    });
    return {
        cancel: function () {
            delete activeTweens[id];
        },
    };
}
