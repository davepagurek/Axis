$(document).ready(function() {
    $("#createKeyFrame").click(function(){
        $(".frame").each(function(){
            if($(this).hasClass("selected")){
                $(this).addClass("keyframe");
            }
        });
        //selected frame is now new keyframe
        axis.frame = $(".selected").id;
        //create that frame (redraw, set frame to selected frame)
        pop.population.forEach(function(element) {
            axis.clear(element);
            axis.create(element, axis.frame);
        });
        //set every subelement to that frame
        pop.population.forEach(function(element) {
            axis.createNewFrame(element, axis.frame, axis.frame);
        });
    });

    $("#setFrame").click(function(){
        axis.frame = $(".selected").id;
        pop.population.forEach(function(element) {
            console.log(axis.getLocation(element.frames, axis.frame));
        });
    });

    $createFrame = $("#createFrame");
    var frameClick = function(){
        $(".frame").each(function(){
            $(this).removeClass("selected");
        });
        $(this).addClass("selected");
        axis.frame = $(this).id;
        //TODO: code for redrawing the canvas based on the frame
        pop.population.forEach(function(element) {
            console.log(axis.getLocation(element.frames, axis.frame));
            axis.clear(element);
            axis.create(element, axis.frame);
        });
    };
    $(".frame").click(frameClick);

    var frameNum = 1;

    //button click -> create frame and add click listener
    $createFrame.click(function(){
        $('#frame_list tr').append('<td><div class="frame"></div></td>');
        $('#frame_list tr td:last .frame').click(frameClick);
        //add an id that increments for each div
        $('#frame_list tr td:last .frame').attr("id", frameNum);
        frameNum++;
    });
    for (var i = 0; i<10; i++){
        $createFrame.click();
    }

    $("#createPerson").click(function(){
        var newStickman = pop.addStickman();
        pop.toPaper(newStickman);
        pop.population.push(newStickman);
        axis.create(newStickman, axis.frame);
    });
});
