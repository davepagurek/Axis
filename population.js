var stickman = {
    name: "root",
    frames: { 0: { x: 360, y: 240 } },
    root: true,
    points: [
        {
            name: "body",
            frames: {
                0: { x: 0, y: -80 }
            },
            type: "line",
            points: [
                {
                    name: "head",
                    frames: { 0: { x: 0, y: -50 } },
                    type: "circle"
                },
                {
                    name: "armTopLeft",
                    frames: {
                        0: { x: -50, y: 25 }
                    },
                    type: "line",
                    points: [
                        {
                            name: "armBottomLeft",
                            frames: { 0: { x: -25, y: 50 } },
                            type: "line"
                        }
                    ]
                },
                {
                    name: "armTopRight",
                    frames: { 0: { x: 50, y: 25 } },
                    type: "line",
                    points: [
                        {
                            name: "armBottomRight",
                            frames: { 0: { x: 25, y: 50 } },
                            type: "line"
                        }
                    ]
                }
            ]
        },
        {
            name: "legTopLeft",
            frames: { 0: { x: -20, y: 80 } },
            type: "line",
            points: [
                {
                    name: "legBottomLeft",
                    frames: { 0: { x: -10, y: 80 } },
                    type: "line"
                }
            ]
        },
        {
            name: "legTopRight",
            frames: { 0: { x: 20, y: 80 } },
            type: "line",
            points: [
                {
                    name: "legBottomRight",
                    frames: { 0: { x: 10, y: 80 } },
                    type: "line"
                }
            ]
        }
    ]
};

var population = [];

var toPaper = function(element) {
    if (null == element || "object" != typeof element) {
        return;
    }
    if (element.frames) {
        for (var frame in element.frames) {
            // alert(JSON.stringify(element.frames[frame]));
            var p = new Point(element.frames[frame].x, element.frames[frame].y);
            // alert(JSON.stringify(p));
            element.frames[frame] = p;
            // alert(JSON.stringify(element.frames));
        }
    }
    for (var attr in element) {
        toPaper(element[attr]);
    }
};

var addStickman = function(obj) {
    var newStickman = JSON.parse(JSON.stringify(obj));
    return newStickman;
};

population.push(addStickman(stickman));

population.forEach(function(element) {
    toPaper(element);
    axis.create(element, 0);
});