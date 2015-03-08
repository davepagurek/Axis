window.axis = (function() {
    var axis = {};

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

    var showJoints = function(element) {
        if (element.points) {
            element.points.forEach(function(point) {
                showJoints(point);
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

    axis.create = function(element, frame, start, root) {
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
                    axis.create(root, frame);
                    showJoints(root);
                }
            };
        }

        element.joint.strokeColor.alpha = 0;



        if (element.points) {

            element.points.forEach(function(point) {
                axis.create(point, frame, start+end, root);
            });
        }
    };

    //createPath(population.stickman.points[0], view.center, 0);

    paper.view.draw();

    window.setFrame = function(){
        curFrame = document.getElementById("Frame").value;
        console.log(curFrame);
        console.log(document.getElementById("Frame").value);
    }

    window.createFrame = function(){
        curFrame = document.getElementById("Frame").value;
    }
    return axis;
}());

