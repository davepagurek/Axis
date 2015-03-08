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

var getLocation = function(frames, currentFrame) {
    if (frames[currentFrame]) {
        return frames[currentFrame];
    } else {
        console.log(frames, currentFrame);
        return view.center;
        //TODO: Add interpolation here
    }
}

var bringJointsToFront = function(element) {
    if (element.points) {
        element.points.forEach(function(point) {
            bringJointsToFront(point);
        });
    }
    if (element.joint) element.joint.bringToFront();
};

var createPath = function(element, start, frame) {
    console.log(frame);
    var end = getLocation(element.frames, frame);
    if (element.type == "line") {
        var line = new Path.Line({
            from: start,
            to: start+end,
            strokeWidth: 10,
            strokeColor: "black",
            strokeCap: "round"
        });
        return line;
    } else if (element.type == "circle") {
        var circle = new Path.Circle({
            center: start+end/2,
            radius: end.length/2,
            strokeWidth: 10,
            strokeColor: "black",
            strokeCap: "round"
        });
        return circle;
    }
};

var clear = function(element) {
    if (element.path) element.path.remove();
    if (element.points) {
        element.points.forEach(function(point) {
            clear(point);
        });
    }
};

var create = function(element, frame, start, root) {
    frame = frame || 0;
    root = root || element
    start = start || element.location || view.center;
    var madeNewJoint = false;
    if (!element.root) {
        if (!element.joint) {
            var joint = new Path.Circle({
                radius: 5,
                strokeWidth: 20,
                strokeColor: "red",
                fillColor: "red"
            });
            element.joint = joint;
            madeNewJoint = true;
        }
        element.joint.position = start+element.end;

        element.path = createPath(element, start, frame);

    } else {
        element.location = start;
        if (!element.joint) {
            var joint = new Path.Circle({
                radius: 5,
                strokeWidth: 20,
                strokeColor: "orange",
                fillColor: "orange"
            });
            element.joint = joint;
            madeNewJoint = true;
        }
        element.joint.position = start;
    }

    if (madeNewJoint) {
        element.joint.onMouseEnter = function(event) {
            element.joint.bringToFront();
            element.joint.fillColor = "lime";
        };

        element.joint.onMouseLeave = function(event) {
            if (element.path) {
                element.joint.fillColor = "red";
            } else {
                element.joint.fillColor = "orange";
            }
        };

        element.joint.onMouseDrag = function(event) {
            element.end += event.delta;
            if (element.root) element.location += event.delta;
            clear(root);
            create(root, frame);
            bringJointsToFront(stickman);
        };
    }

    element.joint.strokeColor.alpha = 0;



    if (element.points) {
        element.points.forEach(function(point) {
            create(point, frame, start+element.end, root);
        });
    }

    element.joint.bringToFront();
};

//createPath(stickman.points[0], view.center, 0);

create(stickman, 0, view.center);

paper.view.draw();
