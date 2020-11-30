export function cover(inner, outer) {
    var aspectOuter = outer.width / outer.height,
        aspectInner = inner.width / inner.height,
        width,
        height,
        x,
        y;
    outer.x = outer.x ? outer.x : 0;
    outer.y = outer.y ? outer.y : 0;
    inner.x = inner.x ? inner.x : 0;
    inner.y = inner.y ? inner.y : 0;

    if (aspectOuter > aspectInner) {
        width = outer.width;
        height = outer.width * (1 / aspectInner);
        x = outer.x;
        y = outer.y - (height - outer.height) / 2;
    } else {
        height = outer.height;
        width = outer.height * aspectInner;
        y = outer.y;
        x = outer.x - (width - outer.width) / 2;
    }

    var rect = {
        width: width,
        height: height,
        x: x,
        y: y
    };

    return rect;
}

export function contain(inner, outer) {
    var aspectOuter = outer.width / outer.height,
        aspectInner = inner.width / inner.height,
        width,
        height,
        x,
        y;
    outer.x = outer.x ? outer.x : 0;
    outer.y = outer.y ? outer.y : 0;

    if (aspectInner > aspectOuter) {
        width = outer.width;
        height = outer.width / aspectInner;
        x = 0;
        y = outer.height / 2 - height / 2;
    } else {
        width = outer.height * aspectInner;
        height = outer.height;
        x = outer.width / 2 - width / 2;
        y = 0;
    }

    var rect = {
        width: width,
        height: height,
        x: x,
        y: y
    };

    return rect;
}
