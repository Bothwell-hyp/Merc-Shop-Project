$(function () {
    /* -----------------------------------------
    NOTE:
    GET-IN-TOUCH-PANEL refers to the whole thing
    that slides in and out as a whole.
    STAND BY IS WHEN THE PANEL IS HIDEN, 
    FULL VIEW IS WHEN ITS PULLED OUT INTO VIEW
     ----------------------------------------- */


    let CurrentDisplayMode = "";
    let ViewMode = "";
    let PanelState = "NothingYet"; //Just initialise

    //Attach action links that a user can click to open mail client/phone app/location
    $("#ID_OurTel").click(function () { location.href = "tel:" + $(this).text(); })
    $("#ID_OurEmail").click(function () { location.href = "mailto:" + $(this).text(); })





    /*----------------------------- DERTEMINING AND ADJUSTING FOR DESKTOP/MOBILE SIZES ------------------------ */


    //0) WHEN PAGE LOADS OR WINDOW RESIZES,  DISPLAY ADJUSTS AND APPLIES AUTOMATICALLY - All we later need is Cls_ShowFullView for from standby to fullview and vice versa 
    $(window).on({
        resize: function () { ApplyDisplayMode(GetDisplayMode());},
        load: function () { ViewMode = "STANDBY"; ApplyDisplayMode(GetDisplayMode()) }
    })


    //1) GET DISPLAY MODE FIRST (MOBILE OR DESKTOP)
    function GetDisplayMode() {
        //DETERMINE WINDOW SIZE
        if ($(window).width() > 600 && ((CurrentDisplayMode == "Mobile") || (CurrentDisplayMode == ""))) { //ensure it doesnt run repeatedly on each similar call i.e. screen mode still on Desktop already (event bubbling)
            CurrentDisplayMode = "Desktop";
        }

        if ($(window).width() <= 600 && ((CurrentDisplayMode == "Desktop") || (CurrentDisplayMode == ""))) { //ensure it doesnt run repeatedly on each similar call i.e. screen mode still on Desktop already (event bubbling)
            CurrentDisplayMode = "Mobile";
        }
    }



    //2.a) APPLY GENERAL CLASES THAT DEFINE THE GET-IN-TOUCH-PANEL, before any other altering dynamic changes or @media query
    function GeneralClasses() {
        //a) APPLY GENERAL CLASSES FIRST - meant for desktop, but Mob (Mobile) relies and adjusts these too, clear everything first then add the classes
        $("#ID_GetInTouchPanel").removeClass().addClass("Cls_GetInTouchPanel Cls_GetInTouchPanel_Hover");
        $("#ID_Standby, #ID_OurContactDetails, #ID_YourContactDetails, #ID_ContactContainer").removeClass().addClass("Cls_FloatHeight");
        $("#ID_Standby").addClass("Cls_Standby"); //cleared above already
        $("#ID_Standby .fa-mobile").addClass("Cls_Standby_fa-mobile");
        $("#ID_Standby .fa-phone-alt").addClass("Cls_Standby_fa-phone-alt");
        $("#ID_Standby p").removeClass().addClass("Cls_Standby_p");
    }


    //2) THEN APPLY RESPECTIVE DISPLAY MODE 
    //(simply applying the css classes to match the screen size)
    function ApplyDisplayMode() {

        //2.b) IF Desktop SCREEN
        if (CurrentDisplayMode == "Desktop") {

            //IF CLOSSING THE PANEL INTO STANDBY MODE
            if (ViewMode == "STANDBY" && !(PanelState == "Desktop:STANDBY")) {
                PanelState = "Desktop:STANDBY" //State tracker to avoid code repetitions when css already applied
                GeneralClasses(); //Called from exteneral function so as to run only when needed, not on every window resize

                $("#ID_Standby .fa-phone-alt").removeClass("CueIconHide");//Show cue icon on standby
            }

            //IF OPENING INTO FULLVIEW
            if (ViewMode == "FULLVIEW" && !(PanelState == "Desktop:FULLVIEW")) {
                PanelState = "Desktop:FULLVIEW" //State tracker to avoid code repetitions when css already applied
                GeneralClasses(); //Called from exteneral function so as to run only when needed, not on every window resize

                $("#ID_GetInTouchPanel").addClass("Cls_ShowFullView");
                $("#ID_Standby .fa-phone-alt").addClass("CueIconHide"); // Hide cue icon 
                $("#ID_GetInTouchPanel").removeClass("Cls_GetInTouchPanel_Hover Cls_GetInTouchPanel_Mob_Hover"); //remove the hover effect when panel is in full view

            }
        }


        //2.c) IF MOBILE SCREEN
        if (CurrentDisplayMode == "Mobile") {

            //IF CLOSING
            if (ViewMode == "STANDBY" && !(PanelState == "Mobile:STANDBY")) {
                PanelState = "Mobile:STANDBY" //State tracker to avoid code repetitions when css already applied
                GeneralClasses(); //Called from exteneral function so as to run only when needed, not on every window resize

                //ADD MOBILE STANDBY CLASSES   
                $("#ID_GetInTouchPanel").addClass("Cls_GetInTouchPanel_Mob_Standby Cls_GetInTouchPanel_Mob_Hover");
                $("#ID_ContactContainer").addClass("Cls_ContactContainer_Mob_Standby");


                // REMOVE MOBILE FULLVIEW CLASES
                $("#ID_GetInTouchPanel").removeClass("Cls_GetInTouchPanel_Mob_FullView");
                $("#ID_Standby").removeClass("Cls_Standby_Mob_FullView");
                $("#ID_Standby p").removeClass("Cls_Standby_Mob_Fullview_p");
                $("#ID_Standby .fa-mobile").removeClass("Cls_Standby_Mob_Fullview_fa");
                $("#ID_Standby .fa-phone-alt").removeClass("Cls_Standby_Mob_FullView_fa-phone-alt");
                $("#ID_ContactContainer").removeClass("Cls_ContactContainer_Mob_Fullview");
            }

            //IF OPENING
            if (ViewMode == "FULLVIEW" && !(PanelState == "Mobile:FULLVIEW")) {
                PanelState = "Mobile:FULLVIEW" //State tracker to avoid code repetitions when css already applied
                GeneralClasses(); //Called from exteneral function so as to run only when needed, not on every window resize

                $("#ID_GetInTouchPanel").css("visibility", "hidden");
                //REMOVE MOBILE STANDBY CLASSES   
                $("#ID_GetInTouchPanel").removeClass("Cls_GetInTouchPanel_Mob_Standby Cls_GetInTouchPanel_Mob_Hover Cls_GetInTouchPanel_Hover");
                $("#ID_ContactContainer").removeClass("Cls_ContactContainer_Mob_Standby");


                // APPLY MOBILE FULLVIEW CLASES
                $("#ID_GetInTouchPanel").addClass("Cls_GetInTouchPanel_Mob_FullView");
                $("#ID_Standby").addClass("Cls_Standby_Mob_FullView");
                $("#ID_Standby p").addClass("Cls_Standby_Mob_Fullview_p");
                $("#ID_Standby .fa-mobile").addClass("Cls_Standby_Mob_Fullview_fa");
                $("#ID_Standby .fa-phone-alt").addClass("Cls_Standby_Mob_FullView_fa-phone-alt");
                $("#ID_ContactContainer").addClass("Cls_ContactContainer_Mob_Fullview");


                //NOW SHOW DISPLAY CONTAINER
                //$("#ID_GetInTouchPanel").addClass("Cls_ShowFullView");
                let $WaitAndSlideInMobile = setInterval(function () {
                    $("#ID_GetInTouchPanel").addClass("Cls_ShowFullView");
                    $("#ID_GetInTouchPanel").css("visibility", "initial");
                    clearInterval($WaitAndSlideInMobile)
                }, 500);
            }
        }
    }


/* ---------------------------------- 
NOTE ON SMOOTH TRANSITION FOR THE FOLLOWING
(1) HOVER IN : maintained by the the css .Cls_GetInTouchPanel_Hover:hover has importance > transition: transform .5s, right 1.5s !important;
(2) HOVER OUT : we remove the transition
(3) OPENING : we add smooth transition
(4) CLOSSING : uses smooth transition from (3) to close, then we remove after a delay to allow complete closing

REASON : THIS PREVENTS ERRATIC SHOWING OF .Cls_GetInTouchPanel ON WINDOW RESIZES COZ IT REPOSITIONS TO NEW SIZE BY ALSO USING THE SMOOTH TRANSITION   
------------------------- */




    /*--------------------------------------------- STANDBY HOVER ACTIONS ------------------------------- */

    //HOVER - hide cue telephone icon
    $("#ID_GetInTouchPanel").mouseover(function () {
        
        //ADD SMOOTH TRANSITION FOR HOVER EFFECT
        $("#ID_GetInTouchPanel").css("transition","right 1.5s");
        
        //Hide cure icon when hovered
        $("#ID_Standby .fa-phone-alt").addClass("CueIconHide");
        
    })


    //HOVER AWAY - display back cue icon, restore cue icon only if still in standby mode, and delay a bit to allow transition to finish
    $("#ID_GetInTouchPanel").mouseleave(function () {

        if (ViewMode == "STANDBY") {
            setTimeout(function () { 
                $("#ID_Standby .fa-phone-alt").removeClass("CueIconHide"); 
                //REMOVE THE SMOOTH TRANSITION
                $("#ID_GetInTouchPanel").css("transition","right 0s");
            }, 850);
        }

    })



    /*--------------------------------------------- OPENNIG THE GET-IN-TOUCH-PANEL---------------------------- */


    //CLICK TO OPEN PANEL
    $("#ID_Standby").click(function () {
        //ADD SMOOTH TRANSITION TO OPEN FULL VIEW
        $("#ID_GetInTouchPanel").css("transition", "right 1.5s");
        //Immediately hide the cue icon, coz on mobile in disappears slow


        //OPENING ON DESKTOP
        if (CurrentDisplayMode == "Desktop") {
            //INTERCEPT: if it's in full view already (a toggle click to open & close)
            if (ViewMode == "FULLVIEW") { $("#ID_GetInTouchCloseBtn").click(); return; } //manually click call the close button

            ViewMode = "FULLVIEW";
            $("#ID_GetInTouchPanel").addClass("Cls_ShowFullView"); //Show fullview
            $("#ID_Standby .fa-phone-alt").addClass("CueIconHide"); // Hide cue icon 
            $("#ID_GetInTouchPanel").removeClass("Cls_GetInTouchPanel_Hover Cls_GetInTouchPanel_Mob_Hover"); //remove the hover effect when panel is in full view
        }

        //OPENING ON MOBILE
        if (CurrentDisplayMode == "Mobile") {

            //INTERCEPT: if it's in full view already (a toggle click to open & close)
            if (ViewMode == "FULLVIEW") { $("#ID_GetInTouchCloseBtn").click(); return; } //manually click call the close button

            /*MOBILE: LIKE MEDIA QUERY, THIS INVOLVES ACTIVE ADDING/REMOVING (adjustment) CLASSES to ApplyDisplayMode, 
            So we need call and apply when in mobile, just as CSS @media would apply when in mobile, and not apply(remove) when not in mobile*/
            ViewMode = "FULLVIEW";
            ApplyDisplayMode(GetDisplayMode())
        }

        //IF Session storage already has any captured user details
        ("CapturedName" in sessionStorage) ? $("#GetInTouchName").val(sessionStorage.getItem("CapturedName")) : 0 + 0; //else do nothing
        ("CapturedPhone" in sessionStorage) ? $("#GetInTouchPhone").val(sessionStorage.getItem("CapturedPhone")) : 0 + 0; //else do nothing
        ("CapturedEmail" in sessionStorage) ? $("#GetInTouchEmail").val(sessionStorage.getItem("CapturedEmail")) : 0 + 0; //else do nothing

    })



    /*--------------------------------------------- CLOSING THE GET-IN-TOUCH-PANEL---------------------------- */

    //CLICK TO CLOSE PANEL, ENTER STANDBY 
    $("#ID_GetInTouchCloseBtn").click(function () {
        ViewMode = "STANDBY";

        //CLOSING ON DESKTOP
        if (CurrentDisplayMode == "Desktop") {
            $("#ID_GetInTouchPanel").removeClass("Cls_ShowFullView"); //Close fullview, back to standby

            //DELAYED: add the hover effect back for standby, but delay it to allow css transition to finish
            if (ViewMode = "STANDBY") {
                let PutHoverBack = setInterval(function () {
                    $("#ID_Standby .fa-phone-alt").removeClass("CueIconHide"); // show back the cue icon 
                    $("#ID_GetInTouchPanel").addClass("Cls_GetInTouchPanel_Hover Cls_GetInTouchPanel_Mob_Hover");
                    clearInterval(PutHoverBack)
                }, 2000);
            }
        }

        //CLOSING ON MOBILE
        if (CurrentDisplayMode == "Mobile") {
            /*MOBILE: LIKE MEDIA QUERY, THIS INVOLVES ACTIVE ADDING/REMOVING (adjustment) CLASSES to ApplyDisplayMode, 
            So we need call and apply when in mobile, just as CSS @media would apply when in mobile, and not apply(remove) when not in mobile*/
            ViewMode = "STANDBY";
            ApplyDisplayMode(GetDisplayMode());
            setTimeout(()=>{$("#ID_Standby .fa-phone-alt").removeClass("CueIconHide");},5000); //Show cue icon back on standby
        }

        //REMOVE SMOOTH TRANSITION WHEN NOW CLOSED AND  BACK TO STANDBY MODE
        setTimeout(() => { $("#ID_GetInTouchPanel").css("transition", "right 0s"); }, 100)
    })



    /*--------------------------------------------- FETCHING SUBMITTED USER DATA ------------------------------- */

    $("form#ID_YourContactDetails").submit(function (e) {
        e.preventDefault();

        //Keep in session storage for possible later usage
        sessionStorage.setItem("CapturedName", $("#GetInTouchName").val());
        sessionStorage.setItem("CapturedPhone", $("#GetInTouchPhone").val());
        sessionStorage.setItem("CapturedEmail", $("#GetInTouchEmail").val());


        //alert the use
        alert(`Hello ${sessionStorage.getItem("CapturedName")}

        Phone:   ${sessionStorage.getItem("CapturedPhone")}
        Email:     ${sessionStorage.getItem("CapturedEmail")}
        
        We will contact you on these provided details.

        Regards.
        The Merc-Shop Team.`);

        //Clear form and close the panel
        $("#GetInTouchName").val("");
        $("#GetInTouchPhone").val("");
        $("#GetInTouchEmail").val("");
        $("#ID_GetInTouchCloseBtn").click();


    })

// When all html and code is finished loading, then display on standby
$("#ID_GetInTouchPanel").attr("hidden", false);
})