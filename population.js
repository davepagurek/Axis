var stickman = {
    name: "root",
    root: true,
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
population.push(stickman);

var addStickman = function(location, name) {
    var newStickman = JSON.parse(JSON.stringify(stickman));
    newStickman.name = name;
    newStickman.location = location;
    population.push(newStickman);
}

population.forEach(function(element) {
    create(element, 0, view.center);
});
