$(function () {


    /*------------------------------------ Subscribe form ----------------------------------*/
 

    //Subscribe form
    $("#ID_FormSubscribe").submit(function (e) {
        e.preventDefault();


        //SAVE IN WEB STORAGE FOR LATER POSSIBLE USE, e.g. WHEN USER ORDERS AND ENTES SHIPPING DETAILS
        sessionStorage.setItem("CapturedName", $("#SubscribeName").val());
        sessionStorage.setItem("CapturedPhone", $("#SubscribePhone").val());
        sessionStorage.setItem("CapturedEmail", $("#SubscribeEmail").val());

        //DISPLAY REMARK & Welcome User
        $(".Cls_RemackContainer").css("display", "block");
        $(".Clc_ClosingRemark").outerHeight($(".Cls_FormContents").height());
        $(".Cls_FormContents").addClass("HideContents");
        $(".Clc_ClosingRemark p small").text((sessionStorage.getItem("CapturedName").length>20)? sessionStorage.getItem("CapturedName").substring(0,15)+'...':sessionStorage.getItem("CapturedName"))
        $(".Clc_ClosingRemark p").hide().fadeIn(3000,
            function () {
                $("#ID_FormSubscribe").trigger("reset"); //reset form
                $(".Cls_FormContents").css("display", "none"); //remove the inputs from display to avoid tab 
                $(".Cls_RemackContainer").css("position", "initial"); //restore container's position from CSS's absolute in order to maintain height (esp mobile view)
            });



    })
    
    //alert(window.name)//window.name = "myWindowName";

});