$(function () {


    //KICK START THE "Get-Started" button animation, run it here once on document load, then leave the interval to execute further
    $("#ID_HeroBanner button").children("img:not(#ID_Devider)").slideUp("slow").slideDown("slow").slideUp("slow").slideDown("slow");


    //Add Link to Navigation Logo
    $("#ID_Logo").click(function () {
        location.href = "index.html";
    })


    /*----------------------------------------- NAV: MOBILE MENU CODE FOR ALL PAGES---------------------------------*/


    //Toggle mobile menu show
    $("#ID_MobileMenu").click(function (){ 
        $("nav ul").toggleClass("Cls_show")

        //Control transition and prevent menu panel being erratic shown when resizing window
        setTimeout(()=>{
            //When Shown
            if (($("nav ul").hasClass("Cls_show"))){
                $("nav ul").removeClass("Cls_SmoothSlideBack").addClass("Cls_SmoothSlideBack")
            }
            //When Back
            if (!($("nav ul").hasClass("Cls_show"))){
                $("nav ul").removeClass("Cls_SmoothSlideBack")
            }
        },100)
    })


    /*---------------------------------------HERO: BANNER CODE FOR ALL PAGES-----------------------------------*/


    //Animation for Background image slide show
    let ImagesArray = ["images/banner1.jpg", "images/banner2.jpg", "images/banner3.jpg", "images/banner4.jpg",
        "images/banner5.jpg", "images/banner6.jpg", "images/banner7.jpg"];
    let i = 0;
    $(".BackgroundDIsplay.Active").css("background-image", `url(${ImagesArray[0]})`); //initialise with first image

    setInterval(function () {
        (i >= ImagesArray.length - 1) ? i = 0 : i++ //counter to cycle through the images

        //Prepare the next image for crossfade
        let $NextImage = $(".BackgroundDIsplay.InActive");
        $NextImage.css("background-image", `url(${ImagesArray[i]})`); //give it the next image
        $NextImage.css("display", "block");

        //Now lets crossfade out the active image
        let $ActiveImage = $(".BackgroundDIsplay.Active");
        $ActiveImage.fadeOut(2000, function () {
            $ActiveImage.removeClass("Active");
            $ActiveImage.addClass("InActive");
            $NextImage.removeClass("InActive");
            $NextImage.addClass("Active");
        })

        //ANIMATE "Get Started" BUTTON: to bring user attention  by animating the image inside the Hero banner's Get-Started button using chained effets
        $("#ID_HeroBanner button").children("img:not(#ID_Devider)").stop().slideUp("slow").slideDown("slow").slideUp("slow").slideDown("slow");
    }, 5000);


    /*-------------------------------------- FOOTER: BACK TO TOP CODE FOR ALL PAGES --------------------------------*/

    //FOOTER BACK TO TOP
    $("#ID_BackToTop").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
    });



    /*------------------------------- CART RELATED CODE TO LOAD FOR ALL PAGES' NAVIGATION---------------------------*/


    //When document loads, show cart quantity on NAV "CART" MENU text
    (localStorage.length > 0) ? $("#ID_CartMenu span").html("CART " + sessionStorage.getItem("cartQuantity")) : $("#ID_CartMenu span").html("CART " + 0)


    //ON HOVER, SHOW THE CURRENT TOTAL COST OF CART (total is kept in sessionStorage whenever updated)
    $("#ID_CartMenu").mouseover(function () {
           
        if ($(".Cls_OrderConfirmProgressIcon").hasClass("ProgressDone")) { 
            //if temporarily after successful order
            $("#ID_CartMenu").attr("title", "Your Recent Order Was Successful");
        } else {
            //Normal
            $(this).attr("title", "Current Total (vat incl): " + ((sessionStorage.getItem("cartTotal") == null) ? "R0.00" : new Intl.NumberFormat('za-ZA', { style: 'currency', currency: 'ZAR' }).format(sessionStorage.getItem("cartTotal"))));
        }

    })





})



