window.axis = (function() {
    var axis = {};

    axis.getLocation = function(frames, currentFrame) {
        if (!frames) return new Point(0, 0);
        //if frame exists, return it
        if (frames[currentFrame]) {
            return frames[currentFrame];
        } else {
            var prev = 0;
            var next = Number.MAX_VALUE;
            //finds the previous keyframe + next keyframe
            for (var frame in frames){
                if (parseInt(frame, 10) > prev && parseInt(frame, 10) < currentFrame){
                    prev = parseInt(frame, 10);
                }
                if (parseInt(frame, 10) < next && parseInt(frame, 10) > currentFrame){
                    next = parseInt(frame, 10);
                }
            }
            //if current frame is further than last keyframe, return position at last keyframe
            if (next == Number.MAX_VALUE){
                return frames[prev];
            }
            //else, perform linear interpolation and calculate the x,y depending on the frame progress between prev and next frames
            else{
                var ratio = currentFrame/(next - prev);
                return new Point(frames[prev].x + ratio*(frames[next].x-frames[prev].x), frames[prev].y + ratio*(frames[next].y-frames[prev].y));
            }
        }
    };

    var showJoints = function(element) {
        if (element.points) {
            element.points.forEach(function(point) {
                showJoints(point);
            });
        }
        if (element.joint) element.joint.bringToFront();
    };

    var createPath = function(element, start, frame) {
        var end = axis.getLocation(element.frames, frame);
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
        var end = axis.getLocation(element.frames, frame);
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

    //create a new Frame
    axis.createNewFrame = function(element, frame){
        frame = frame || 0;

        element.frames[frame] = element.location; 

        if (element.points){
            element.points.forEach(function(point){
                axis.createNewFrame(point, frame)
            });
        }
    };


    //createPath(population.stickman.points[0], view.center, 0);

    paper.view.draw();



    return axis;
}());

