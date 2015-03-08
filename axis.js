var getLocation = function(frames, currentFrame) {
    if (!frames) return new Point(0, 0);
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
    var end = getLocation(element.frames, frame);
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
        element.joint.position = start+end;

        element.path = createPath(element, start, frame);

    } else {
        element.location =element.location || start;
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
            if ((element.frames && element.frames[frame]) || element.root) {
                if (element.root) {
                    element.location += event.delta;
                } else {
                    element.frames[frame] += event.delta;
                }
                clear(root);
                create(root, frame);
                bringJointsToFront(stickman);
            }
        };
    }

    element.joint.strokeColor.alpha = 0;



    if (element.points) {

        element.points.forEach(function(point) {
            create(point, frame, start+end, root);
        });
    }

    element.joint.bringToFront();
};

//createPath(stickman.points[0], view.center, 0);

paper.view.draw();