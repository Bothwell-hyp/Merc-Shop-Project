
$(function () {

    $("#ID_MoreButton").click(function () {
        //Fcn_ShowMore();

        $("#ID_Dots").toggle("slow").parents("#ID_TeamText").find("#ID_MoreToBeDisplayed").slideToggle("linear")
    })


})