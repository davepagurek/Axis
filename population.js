var stickman = {
    name: "root",
    frames: { 0: { x: 360, y: 240 } },
    root: true,
    frames: { 
        0: new Point(0, 0) 
    },
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
}

var addStickman = function(obj) {
    if (null == obj || "object" != typeof obj) {
        return obj;
    }

    var newStickman = {};
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            newStickman[attr] = addStickman(obj[attr]);
        }
    }

    return newStickman;
}

population.push(stickman);

// population.push(addStickman(stickman));

// addStickman(stickman.location, stickman.name);

population.forEach(function(element) {
    toPaper(element);
    alert(axis.create);
    axis.create(element, 0);
});



window.setFrame = function(){
    curFrame = document.getElementById("Frame").value;
    population.forEach(function(element) {
        console.log(axis.getLocation(element.frames, curFrame));
    });
}

window.createFrame = function(){
    curFrame = document.getElementById("Frame").value;
    population.forEach(function(element) {
        axis.createNewFrame(element, curFrame);
    });
}
