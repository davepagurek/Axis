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

        axis.select(axis.selected, pop.population);
    });

    $createFrame = $("#createFrame");
    var frameClick = function(){
        $(".frame").each(function(){
            $(this).removeClass("selected");
        });
        $(this).addClass("selected");
        axis.frame = $(this).attr("id");
        //TODO: code for redrawing the canvas based on the frame
        axis.frame = $(".selected").attr("id");
        pop.population.forEach(function(element) {
            //console.log(axis.getLocation(element.frames, axis.frame));
            axis.clear(element);
            axis.create(element, axis.frame);
        });
        axis.select(axis.selected, pop.population);
    };
    $(".frame").click(frameClick);

    var frameNum = 1;

    //button click -> create frame and add click listener
    $createFrame.click(function(){
        $('#frame_list tr').append('<td><div class="frame"></div></td>');
        $('#frame_list tr td:last .frame').click(frameClick);
        //add an id that increments for each div
        $('#frame_list tr td:last .frame').attr("id", frameNum);
        axis.lastFrame = frameNum;
        frameNum++;
    });

    var selectClick = function(){
        axis.select(pop.population[$(this).attr("id").charAt(6)-1], pop.population);
    };
    $("#createPerson").click(function(){
         var newStickman = pop.addStickman();
         pop.population.push(newStickman);
         axis.create(newStickman, axis.frame);
         axis.select(pop.population[pop.population.length - 1], pop.population);
         $("#element_list ul").append("<li>Dude "+pop.population.length+"</li>");
         $("#element_list ul li:last").attr("id","person"+pop.population.length);
         $("#element_list ul li:last").click(selectClick);
     });
     $("li").click(selectClick);

    $("#animate").click(function(){
        axis.animate();
    });

    $("#deleteKeyFrame").click(function(){
        if(axis.frame != 0) {
            pop.population.forEach(function(element){
                axis.deleteKeyframe(element,axis.frame);
            });
        }
    });

    $(window).keydown(function(event){
        var NEXT_FRAME = 190;
        var PREV_FRAME = 188;
        var ANIMATE = 13;
        var NEW_FRAME = 78;
        var NEW_KEYFRAME = 32;
        if (event.keyCode == NEW_FRAME) {
            $("#createFrame").click();
        } else if (event.keyCode == NEW_KEYFRAME) {
            $("#createKeyFrame").click();
        } else if (event.keyCode == ANIMATE) {
            $("#animate").click();
        } else if (event.keyCode == NEXT_FRAME && parseInt(axis.frame)+1<=parseInt(axis.lastFrame)) {
            $("#" + (parseInt(axis.frame)+1)).click();
        } else if (event.keyCode == PREV_FRAME && parseInt(axis.frame)>0) {
            $("#" + (axis.frame-1)).click();
        }
        return false;
    });
});
