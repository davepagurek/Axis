window.init = function() {
    $("#createKeyFrame").click(function(){
        var popindex = 0;
        for (var i = 0; i < pop.population.length; i++){
            if (pop.population[i] == axis.selected){
                popindex = i;
                break;
            }
        }
        $(".frame_list[data-frame='" + popindex + "']").find(".frame").each(function(){
            if($(this).hasClass("selected")){
                $(this).addClass("keyframe");
            }
        });
        //selected frame is now new keyframe
        axis.frame = $(".selected").attr("id");
        //create that frame (redraw, set frame to selected frame)
        axis.createNewKeyframe(axis.selected);
        axis.clear(axis.selected);
        axis.create(axis.selected, axis.frame);

        axis.select(axis.selected, pop.population);
    });

    $createFrame = $("#createFrame");

    var frameClick = function(){
        //select every frame on the current frame
        var currentFrame = $(this).attr("data-id");
        $('.frame_list').each(function(){
            $(".frame").each(function(){
                $(this).removeClass("selected");
                if ($(this).attr("data-id") == currentFrame){
                    $(this).addClass("selected");
                }
            });
        });
        //axis.frame = $(this).attr("data-id");
        //redrawing the canvas based on the frame
        axis.frame = $(".selected").attr("data-id");
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
        $('.frame_list').each(function(){
            $(this).find('tr').append('<td class="frame"></td>');
            $(this).find('tr td:last').click(frameClick);
            //add an id that increments for each div
            $(this).find('tr td:last').attr("data-id", frameNum);
            //axis.lastFrame = frameNum;
        });
        // $('#frame_list tr').append('<td><div class="frame"></div></td>');
        // $('#frame_list tr td:last .frame').click(frameClick);
        // //add an id that increments for each div
        // $('#frame_list tr td:last .frame').attr("id", frameNum);
        // //axis.lastFrame = frameNum;
        frameNum++;
        axis.lastFrame = frameNum-1;
    });

    for(var i = 0; i < 10; i++){
        $createFrame.click();
    }

    var selectClick = function(){
        axis.select(pop.population[$(this).attr("id").charAt(6)-1], pop.population);
    };

    //creating a new stickman
    $("#createPerson").click(function(){
         var newStickman = pop.addStickman();
         pop.toPaper(newStickman);
         console.log(newStickman);
         pop.population.push(newStickman);
         axis.create(newStickman, axis.frame);
         axis.select(pop.population[pop.population.length - 1], pop.population);
         $("#element_list ul").append("<li>Dude "+pop.population.length+"</li>");
         $("#element_list ul li:last").attr("id","person"+pop.population.length);
         $("#element_list ul li:last").click(selectClick);

         //adding a new table containing the frames
         $("#table_list").append("<table class='frame_list'><tr></tr></table>");
         $("#table_list table:last").attr("data-frame", pop.population.length - 1);
         $("#table_list table:last tr").append("<td class='frame keyframe' data-id ='0'></td>");
         $("#table_list table:last tr td").click(frameClick);
         //selects the frame if it is currently selected
         if (axis.frame == 0){
            $("#table_list table:last tr td").click();
         }
         //adds a frame for every frame already existing
         // console.log($("#table_list table:last tr"));
         var length = $('.frame_list:first-child tr td').length;
         for (var i = 1; i < length; i++){
            $("#table_list table:last tr").append("<td class='frame' data-id = '" + i + "'></td>");
            $("#table_list table:last tr td:last").click(frameClick);
            if (axis.frame == i){
                $("#table_list table:last tr td").click();
             }
         }

     });

     $("li").click(selectClick);

     $("#deletePerson").click(function(){
        if (pop.population.length > 1){
            var index;
            for (var i = 0; i < pop.population.length; i++) {
                if (pop.population[i] == axis.selected) {
                    index = i;
                    break;
                }
            }
            $("li").eq(index).remove();
            $("[data-frame="+index+"]").remove();
            pop.population.splice(index,1);
            $(".element_list ul li").each(function(){
                if (parseInt($(this).attr("id").substring(6)) > index) {
                    $(this).attr("id",$(this).attr("id").substring(0,6)+(parseInt($(this).attr("id").substring(6))-1));
                }
            });
            $(".frame_list").each(function(){
                if (parseInt($(this).attr("data-table")) > index) {
                    $(this).attr("data-frame", parseInt($(this).attr("data-frame"))-1);
                }
            });
            axis.clear(axis.selected);
            axis.deleteJoints(axis.selected);
            paper.view.update();
        }
     });

    $("#animate").click(function(){
        axis.animate(frameNum-1);
    });

    $("#deleteKeyFrame").click(function(){
        if(axis.frame != 0) {
            $(".frame").each(function(){
                if($(this).hasClass("selected")){
                    $(this).removeClass("keyframe");
                }
            });
            axis.deleteKeyframe(axis.selected,axis.frame);
            axis.clear(axis.selected);
            axis.create(axis.selected, axis.frame);
            axis.select(axis.selected, pop.population);
            paper.view.update();
        }
    });

    $("#save").click(function(){
        //pop.save();
        $("#saveDialogue").click();
    });

    $("#saveDialogue").change(function() {
        pop.save(this.value);
    });

    $("#open").click(function(){
        //pop.open();
        $("#openDialogue").click();
    });

    $("#openDialogue").change(function() {
        //alert(this.value);
        pop.open(this.value);
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
            $("[data-id='" + (parseInt(axis.frame)+1) + "']").click();
        } else if (event.keyCode == PREV_FRAME && parseInt(axis.frame)>0) {
            $("[data-id='" + (axis.frame-1) + "']").click();
        }
        return false;
    });

    window.makeFrames = function(popList){
        $('#table_list').html("");

        var totalFrames = [];
        popList.forEach(function(element) {
            console.log(Object.keys(element.frames));
            totalFrames.push.apply(totalFrames, Object.keys(element.frames));
        });
        totalFrames = totalFrames.sort(function(a, b) {
            return parseInt(a)-parseInt(b);
        });

        popList.forEach(function(element) {

            frameNum = 0;
            $('#table_list').append("<table class='frame_list'></table>")
            $('#table_list .frame_list:last').append("<tr></tr>");

            var list = Array.prototype.sort.call(Object.keys(element.frames));
            for(i = 0; i <= totalFrames[totalFrames.length - 1]; i++){
                $('#table_list .frame_list:last tr').append('<td class="frame"></td>');
                $('#table_list .frame_list:last tr').find('td:last').click(frameClick);

                //add an id that increments for each div
                $('#table_list .frame_list:last tr').find('td:last').attr("data-id", frameNum);

                frameNum++;

                if(element.frames[i]){
                    $('#table_list .frame_list:last tr').find('td:last').addClass("keyframe");
                }
                axis.lastFrame = frameNum;
            }
        });
        axis.frame = 0;
        selectFrame();
    };

    window.selectFrame = function() {
        $('.frame_list').each(function(){
            $(".frame").each(function(){
                $(this).removeClass("selected");
                if ($(this).attr("data-id") == axis.frame){
                    $(this).addClass("selected");
                }
            });
        });

    }
};
