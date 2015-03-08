window.axis = (function() {
    var axis = {};

    axis.frame = 0;
    axis.selected = 0;
    axis.lastUpdate = 0;
    axis.lastFrame = 0;

    var getLocation = function(frames, currentFrame) {
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
                var ratio = (currentFrame-prev)/(next - prev);
                return new Point(frames[prev].x + ratio*(frames[next].x-frames[prev].x), frames[prev].y + ratio*(frames[next].y-frames[prev].y));
            }
        }
    };

    axis.getLocation = function(frames,currentFrame){
        return getLocation(frames, currentFrame);
    };

    //Recursively draw jointsagain so that they end up in front of lines
    var showJoints = function(element) {
        if (element.points) {
            element.points.forEach(function(point) {
                showJoints(point);
            });
        }
        if (element.joint) {
            element.joint.bringToFront();
            element.viewJoint = true;
        }
    };

    var hideJoints = function(element) {
        if (element.points) {
            element.points.forEach(function(point) {
                hideJoints(point);
            });
        }
        if (element.joint) {
            element.viewJoint = false;
        }
        axis.clear(element);
        axis.create(element, axis.frame);
    };

    axis.select = function(element, population) {
        population.forEach(function(element) {
            hideJoints(element);
        });
        showJoints(element);
        axis.selected = element;
        paper.view.update();
    };

    var createPath = function(element, start, frame) {
        var end = getLocation(element.frames, frame);

        //Use Paper.js to draw the shape
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

    //Recursively erase paths
    axis.clear = function(element) {
        if (element.path) element.path.remove();
        if (element.points) {
            element.points.forEach(function(point) {
                axis.clear(point);
            });
        }
    };

    //Draws an object recursively
    axis.create = function(element, frame, start, root) {

        //Default parameter values
        frame = frame || 0;
        root = root || element
        start = start || new Point(0,0);

        //Find the end location of the joint for the current element
        var end = getLocation(element.frames, frame);

        //If we had to create the clickable joint for the first time or if it's just being redrawn
        var madeNewJoint = false;

        //If it's a normal element and not the root
        if (!element.root) {

            //Create a new joint if it doesn't yet exist
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

            //Move the joint to the position of the end of the line
            element.joint.position = start+end;

            //Hide joints by default
            element.viewJoint = false;

            //Draw the actual line
            element.path = createPath(element, start, frame);

        //If it's the root
        } else {

            //console.log(end, element.frames[frame]);

            //Create the joint object if it doesn't already exist
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
            element.joint.position = end;
            element.viewJoint = false;
        }

        //If we had to make a joint for the first time, add event listeners to it
        if (madeNewJoint) {

            console.log("did this " + new Date().getTime());

            //Change colour on mouseover
            element.joint.onMouseEnter = function(event) {
                if (element.viewJoint) {
                    element.joint.bringToFront();
                    element.joint.fillColor = "lime";
                }
            };

            //Change colour on mouseleave
            element.joint.onMouseLeave = function(event) {
                if (element.viewJoint) {
                    if (element.path) {
                        element.joint.fillColor = "red";
                    } else {
                        element.joint.fillColor = "orange";
                    }
                }
            };

            //Move and redraw stickman when a joint is dragged
            element.joint.onMouseDrag = function(event) {

                //axis.select(root, pop.population);

                //Only drag if there is a keyframe to change
                if ((element.frames && element.frames[axis.frame])) {
                    //Set the keyframe to the location
                    element.frames[axis.frame] += event.delta;
                    //console.log(element.frames[axis.frame]);

                    //Redraw
                    axis.clear(root);
                    axis.create(root, axis.frame);
                    showJoints(root);
                }
            };
        }

        //Make it so that the outline for the joint is transparent so you can hover over it from a distance
        element.joint.strokeColor.alpha = 0;


        //Recursively draw children
        if (element.points) {

            element.points.forEach(function(point) {
                axis.create(point, frame, start+end, root);
            });
        }

        // showJoints(element);
        paper.view.update();

    };

    //create a new Frame
    axis.createNewKeyframe = function(element){
        element.frames[axis.frame] = getLocation(element.frames, axis.frame);

        if (element.points){
            element.points.forEach(function(point){
                axis.createNewKeyframe(point, axis.frame);
            });
        }
    };

    axis.deleteKeyframe = function(element, delFrame){
        console.log(element);
        if (element.frames) {
            if (element.frames[""+delFrame]) {
                delete element.frames[""+delFrame];
            } else return;
        } else return;
        if (element.points) {
            element.points.forEach(function(point){
                axis.deleteKeyframe(point, delFrame);
            });
        }
    };

    var nextFrame = function() {
        console.log("animating: " + new Date().getTime());
        if (new Date().getTime() - axis.lastUpdate >= 1000/24) {
            axis.lastUpdate = new Date().getTime();
            pop.population.forEach(function(element) {
                axis.clear(element);
                axis.create(element, axis.frame);
                paper.view.update();
            });
            axis.frame++;
        }
        if (axis.frame <= axis.lastFrame) {
            requestAnimationFrame(nextFrame);
        } else {
            //axis.select(axis.selected, pop.popualtion);
        }
    }

    axis.animate = function() {
        axis.frame = 0;
        axis.lastUpdate = 0;
        hideJoints(axis.selected);

        requestAnimationFrame(nextFrame);
    };

    paper.view.draw();

    return axis;
}());

