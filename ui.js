$(document).ready(function() {
    $("#createKeyFrame").click(function(){
        $(".frame").each(function(){
            if($(this).hasClass("selected")){
                $(this).addClass("keyframe");
            }
        });
        //selected frame is now new keyframe
        newFrame = $(".selected").id;
        //create that frame (redraw, set frame to selected frame)
        pop.population.forEach(function(element) {
            axis.clear(element);
            axis.create(element, newFrame);
            axis.frame = newFrame;
        });
        //set every subelement to that frame
        pop.population.forEach(function(element) {
            axis.createNewFrame(element, axis.frame, newFrame);
        });
    });

    $("#setFrame").click(function(){
        curFrame = document.getElementById("Frame").value;
        pop.population.forEach(function(element) {
            console.log(axis.getLocation(element.frames, curFrame));
        });
    });

    $createFrame = $("#createFrame");
    var frameClick = function(){
        $(".frame").each(function(){
            $(this).removeClass("selected");
        });
        $(this).addClass("selected");
        curFrame = $(this).id;
        //TODO: code for redrawing the canvas based on the frame
        population.forEach(function(element) {
            console.log(axis.getLocation(element.frames, curFrame));
            axis.clear(element);
            axis.create(element, curFrame);
            axis.frame = newFrame;
        });
    };
    $(".frame").click(frameClick);

    var frameNum = 0;

    //button click -> create frame and add click listener
    $createFrame.click(function(){
        $('#frame_list tr').append('<td><div class="frame"></div></td>');
        $('#frame_list tr td:last .frame').click(frameClick);
        //add an id that increments for each div
        $('#frame_list tr td:last .frame').attr("id", frameNum);
        frameNum++;
    });

    $("#createPerson").click(function(){
        var newStickman = pop.addStickman();
        pop.toPaper(newStickman);
        pop.population.push(newStickman);
        axis.create(newStickman, axis.frame);
    });
});
