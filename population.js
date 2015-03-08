var stickman = {
    name: "root",
    root: true,
    frames: { 
        0: new Point(0, 0) 
    },
    points: [
        {
            name: "body",
            frames: {
                0: new Point(0, -80)
            },
            type: "line",
            points: [
                {
                    name: "head",
                    frames: { 0: new Point(0, -50) },
                    type: "circle"
                },
                {
                    name: "armTopLeft",
                    frames: {
                        0: new Point(-50, 25)
                    },
                    type: "line",
                    points: [
                        {
                            name: "armBottomLeft",
                            frames: { 0: new Point(-25, 50) },
                            type: "line"
                        }
                    ]
                },
                {
                    name: "armTopRight",
                    frames: { 0: new Point(50, 25) },
                    type: "line",
                    points: [
                        {
                            name: "armBottomRight",
                            frames: { 0: new Point(25, 50) },
                            type: "line"
                        }
                    ]
                }
            ]
        },
        {
            name: "legTopLeft",
            frames: { 0: new Point(-20, 80) },
            type: "line",
            points: [
                {
                    name: "legBottomLeft",
                    frames: { 0: new Point(-10, 80) },
                    type: "line"
                }
            ]
        },
        {
            name: "legTopRight",
            frames: { 0: new Point(20, 80) },
            type: "line",
            points: [
                {
                    name: "legBottomRight",
                    frames: { 0: new Point(10, 80) },
                    type: "line"
                }
            ]
        }
    ]
};

var population = [];

var addStickman = function(location, name) {
    var newStickman = JSON.parse(JSON.stringify(stickman));
    console.log(newStickman);
    // newStickman.name = name;
    // newStickman.location = location;
    population.push(newStickman);
}

population.push(stickman);
// addStickman(stickman.location, stickman.name);

population.forEach(function(element) {
    axis.create(element, 0, view.center);
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