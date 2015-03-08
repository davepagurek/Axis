$(document).ready(function() {
    $("#createKeyFrame").click(function(){
        $(".frame").each(function(){
            if($(this).hasClass("selected")){
                $(this).addClass("keyframe");
            }
        });
        newFrame = document.getElementById("Frame").value;
        pop.population.forEach(function(element) {
            axis.clear(element);
            axis.create(element, newFrame);
            axis.frame = newFrame;
        });
        console.log(newFrame);
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
    };
    $(".frame").click(frameClick);

    $createFrame.click(function(){
        $('#frame_list tr').append('<td><div class="frame"></div></td>');
        $('#frame_list tr td:last .frame').click(frameClick);
    });

    $("#createPerson").click(function(){
        var newStickman = pop.addStickman();
        pop.toPaper(newStickman);
        pop.population.push(newStickman);
        axis.create(newStickman, axis.frame);
        axis.select(pop.population[pop.population.length - 1], pop.population);
    });

    // $("#animate").click(function(){
    //     lastUpdate = new Date().getTime();
    //     window.requestAnimationFrame(function(){
    //         while(new Date().getTime() - lastUpdate >= (1/24)){
    //             lastUpdate = new Date().getTime();

    //         }
    //     });
    // });

    $("deletePerson").click(function(){
        
    });
});
