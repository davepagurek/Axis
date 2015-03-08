$(document).ready(function() {
    $("#createKeyFrame").click(function(){
        $(".frame").each(function(){
            if($(this).hasClass("selected")){
                $(this).addClass("keyframe");
            }
        });
        //selected frame is now new keyframe
        axis.frame = $(".selected").attr("id");
        //create that frame (redraw, set frame to selected frame)
        pop.population.forEach(function(element) {
            axis.createNewKeyframe(element);
            axis.clear(element);
            axis.create(element, axis.frame);
        });
    });

    $("#setFrame").click(function(){
        axis.frame = $(".selected").attr("id");
        pop.population.forEach(function(element) {
            //console.log(axis.getLocation(element.frames, axis.frame));
            axis.clear(element);
            axis.create(element, axis.frame);
        });
    });

    $createFrame = $("#createFrame");
    var frameClick = function(){
        $(".frame").each(function(){
            $(this).removeClass("selected");
        });
        $(this).addClass("selected");
        axis.frame = $(this).attr("id");
        //TODO: code for redrawing the canvas based on the frame
        $("#setFrame").click();
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
        axis.select(pop.population[pop.population.length - 1], pop.population);
    });

    $("#animate").click(function(){
        axis.animate();
    });
});
