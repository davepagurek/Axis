$(document).ready(function() {
    $("#createKeyFrame").click(function(){
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

    var frameClick = function(){
        $(".frame").each(function(){
            $(this).removeClass("selected");
        });
        $(this).addClass("selected");
    };
    $(".frame").click(frameClick);

    $("#createFrame").click(function(){
        $('#frame_list tr').append('<td><div class="frame"></div></td>');
        $('#frame_list tr td:last .frame').click(frameClick);
    });

    $("#createPerson").click(function(){
        var newStickman = pop.addStickman();
        pop.toPaper(newStickman);
        pop.population.push(newStickman);
        axis.create(newStickman, axis.frame);
    });
});