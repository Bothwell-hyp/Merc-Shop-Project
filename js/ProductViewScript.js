
/*NB: MercsMap is a map i created in the MainCartScript.js to act 
as the database accessible from all documents.*/



$(function () {

    //If someone opens this page directly without first being in Catalogue/Cart to select the car to view here
    if (!("SelectedCarID" in sessionStorage)) {
        alert("Appears you have opened this page without first selecting the car to view. You will now be redirected to the Catalogue page.\nSelect a vehicle to view by clicking More Details.");
        location.href = "Catalogue.html";
    }


    //DERTMINE WHICH PAGE CALLED, AND ASSIGN APPROPRIATE ACTIONS (to back button & nav)
    let SelectedCarID = sessionStorage.getItem("SelectedCarID"); //Get Vehicle ID and proceed
   
    //a) IF OPENING ()CALLING FROM CART PAGE
    if (sessionStorage.getItem("CallingPage") == "Cart.html") {

        $("nav ul li").removeClass("Cls_active"); //clear and remove all 
        $("nav #ID_CartMenu").addClass("Cls_active");
        $("#ReturnToPageBtn").html("<i class='fas fa-arrow-left'></i> Back to Cart");

        //Assign back button the appropriate calling page
        $("#ReturnToPageBtn").click(function () {
            location.href = sessionStorage.getItem("CallingPage");
            sessionStorage.setItem("CallingPage", "") //clear the calling page afterward
        })
    }
    //b) IF OPENING ()CALLING FROM CATALOGUE PAGE
    if (sessionStorage.getItem("CallingPage") == "Catalogue.html") { //default, Back to catalogue

        $("nav ul li").removeClass("Cls_active"); //clear and remove all
        $("nav #ID_CatalogueMenu").addClass("Cls_active");
        $("#ReturnToPageBtn").html("<i class='fas fa-arrow-left'></i> Back to Catalogue");

        //Assign back button the appropriate calling page
        $("#ReturnToPageBtn").click(function () {
            location.href = sessionStorage.getItem("CallingPage");
            sessionStorage.setItem("CallingPage", "") //clear the calling page afterward
        })
    }


    /*-----------------------GET CAR AND POPULATE IT's DETAILS AND INFO--------------------------------------- */

    $("title").html(MercsMap.get(SelectedCarID).name + " " + MercsMap.get(SelectedCarID).model) //re-titling of page to indicate product

    //ASSIGN CAR DETAILS
    $(".Cls_CarNameHeading").html(MercsMap.get(SelectedCarID).year + " | " + $("title").html());
    $(".Cls_Price").html(Fcn_FormartToCurrency(MercsMap.get(SelectedCarID).price));

    $("#ID_VehicleInfoContainer .Cls_CarInfo").prepend(`<p> <span>Engine:</span>${MercsMap.get(SelectedCarID).engine}</p>`);
    $("#ID_VehicleInfoContainer .Cls_CarInfo").prepend(`<p> <span>Year:</span>${MercsMap.get(SelectedCarID).year}</p>`);
    $("#ID_VehicleInfoContainer .Cls_CarInfo").prepend(`<p> <span>Model:</span>${MercsMap.get(SelectedCarID).model}</p>`);
    $("#ID_VehicleInfoContainer .Cls_CarInfo").prepend(`<p> <span>Name:</span>${MercsMap.get(SelectedCarID).name}</p>`);



    $("#ID_ColorOption").val((SelectedCarID in localStorage) ? JSON.parse(localStorage.getItem(SelectedCarID)).color : MercsMap.get(SelectedCarID).color); //If this car already exists in Cart, then get the color chosen
    $(".Cls_CarNameSmall").html($(".Cls_CarNameHeading").html());
    $(".Cls_DescriptionText").html(MercsMap.get(SelectedCarID).description);
    $("#ID_Quantity").val((SelectedCarID in localStorage) ? Number(JSON.parse(localStorage.getItem(SelectedCarID)).quantity) : 1); //if this car already exists in cart, then get the current quantity

    //VISUALLY INDICATE IF THAT CAR IS IN CART
    (SelectedCarID in localStorage) ? $(".Cls_IsVehicleInCart").removeClass("Cls_VehicleAddedToCart").addClass("Cls_VehicleAddedToCart") : $(".Cls_IsVehicleInCart").removeClass("Cls_VehicleAddedToCart");





    /* --------------------------------------------- THEME BUTTONS -------------------------------------------------------*/

    //LIGHT MODE
    $("#ID_ThemeButtons .Light").click(function () {
        $("#ID_WholeDetailsContainer").css("background-color", "white");

        //Apply suitable classes
        $("#AddingToCart, .Cls_CarInfo").removeClass("ColorForDarkMode ColorForDimMode").addClass("ColorForLighMode");
        $(".Cls_CarNameHeading, .Cls_Price").removeClass("ColorForDimMode");
    })


    //DIM MODE
    $("#ID_ThemeButtons .Dim").click(function () {
        $("#ID_WholeDetailsContainer").css("background-color", "grey");

        //Apply suitable classes
        $("#AddingToCart, .Cls_CarInfo").removeClass("ColorForLighMode ColorForDarkMode ").addClass("ColorForDimMode");
        $(".Cls_CarNameHeading, .Cls_Price").addClass("ColorForDimMode");
    })


    //DARK MODE
    $("#ID_ThemeButtons .Dark").click(function () {
        $("#ID_WholeDetailsContainer").css("background-color", "black");

        //Apply suitable classes
        $("#AddingToCart, .Cls_CarInfo").removeClass("ColorForLighMode ColorForDimMode").addClass("ColorForDarkMode ");
        $(".Cls_CarNameHeading, .Cls_Price").removeClass("ColorForDimMode");
    })






    /*-------------------------------------------- IMAGE SLIDER ----------------------------------------------*/

    //Use a common counter variable for sliding the images so that position is in sync whether clickin next/prev
    let SliderPosition = 0;

    //populate array with images from respective folder
    let ImagesArray = [];
    let SlideFolder = MercsMap.get(SelectedCarID).folder;
    for (let i = 1; i <= 5; i++) {
        ImagesArray.push(SlideFolder + i + ".jpg");
    }

    //initialise with first image
    $(".Cls_SlideImage.ActiveSlider").attr("src", ImagesArray[0]);
    $(".Cls_SlideImage.StaticBack").attr("src", ImagesArray[0]);


    //When user clicks next image
    $("#ID_NextImage").click(function () {
        /*I ONLY NEED TO ANIMATE ONE IMAGE FOR LEFT OR RIGHT, 
        KEEPING ONE STATIC AT THE BACK WITH THE SAME IMAGE
        TO CREATE AN ILLUSION OF LIKE ITS THE ANIMATED PICTURE*/

        let ContainerWidth = $("#ID_SlideContainer").outerWidth();
        if (SliderPosition >= ImagesArray.length - 1) { SliderPosition = -1; }

        $(".Cls_SlideImage.ActiveSlider").attr("src", ImagesArray[++SliderPosition]).offset({ left: ContainerWidth + 100 })
        $(".Cls_SlideImage.ActiveSlider").finish().animate({
            left: 0
        }, 1000, function () {
            $(".Cls_SlideImage.StaticBack").attr("src", ImagesArray[SliderPosition])
        })

        //Highlight current position
        Fcn_ActivePosition()
    })


    //When user click previous
    $("#ID_PrevImage").click(function () {
        /*I ONLY NEED TO ANIMATE ONE IMAGE FOR LEFT OR RIGHT, KEEPING ONE STATIC AT THE BACK WITH THE SAME IMAGE
        TO CREATE AN ILLUSION OF LIKE ITS THE ANIMATED PICTURE*/

        let ContainerWidth = $("#ID_SlideContainer").outerWidth();
        if (SliderPosition <= 0) { SliderPosition = ImagesArray.length; }

        $(".Cls_SlideImage.ActiveSlider").attr("src", ImagesArray[--SliderPosition]).offset({ left: -ContainerWidth - 100 })
        $(".Cls_SlideImage.ActiveSlider").finish().animate({
            left: 0
        }, 1000, function () {
            $(".Cls_SlideImage.StaticBack").attr("src", ImagesArray[SliderPosition])
        })

        //Highlight current position
        Fcn_ActivePosition()
    })

    //Highlight current position
    function Fcn_ActivePosition() {
        $(".SlidePosition" + SliderPosition).addClass("CurrentPosition").siblings().removeClass("CurrentPosition");
    }



    /*------------------------------------------------- SUBMIT/ADD TO CART ----------------------------------------------------- */



    //1) SUBMIT TO CART BUTTONS

    $("#ID_SubmitToCartForm").submit(function (e) {
        e.preventDefault();

        //Submit (update/Add new) to web storage, (Cart) 
        //CarID:quantity,coupon,delivery,delivery option, orderStatus, colour
        localStorage.setItem(SelectedCarID, JSON.stringify(new CartObjectConstructor(SelectedCarID, $("#ID_ColorOption").val(), $("#ID_Quantity").val()))); //ID, 

        //VISUALLY INDICATE THAT CAR IS (NOW) IN CART
        $(".Cls_IsVehicleInCart").removeClass("Cls_VehicleAddedToCart").addClass("Cls_VehicleAddedToCart");

        /*NOW SYNC ALL UPDATES:
         1) THE TOTAL & QUANTITY IN CART - into sessionStorage's "cartTotal" & cartQuantity
         2) CART NAV MENU's text, to reflect how many items now in cart 
         3) PROGRESS TICK - to reflect this Progress of adding an item to cart from catalogue has been completed
        */
        Fcn_SyncCart();

        // UPDATE THE "CART" MENU's text
        $("#ID_CartMenu span").html("CART " + sessionStorage.getItem("cartQuantity"));

       //NOTIFY THE USER OF THE TOTAL AND SUCCESSFUL ADDITION TO CART
        
        if ($(window).width() <= 800) { //Mobile display
alert(`Successfully submitted to your Cart:

Vehicle:      ${MercsMap.get(SelectedCarID).year} ${MercsMap.get(SelectedCarID).name} ${MercsMap.get(SelectedCarID).model}
Price:          ${Fcn_FormartToCurrency(MercsMap.get(SelectedCarID).price)}
color:          ${JSON.parse(localStorage.getItem(SelectedCarID)).color}
Quantity:    x${JSON.parse(localStorage.getItem(SelectedCarID)).quantity}
---------------------------------------------------
Cars in your Cart:   ${sessionStorage.getItem("cartQuantity")}
Your Cart's Total:    ${Fcn_FormartToCurrency(sessionStorage.getItem("cartTotal"))}  (incl vat: @15%)`)
        } 
        else { //desktop display
        alert(`Successfully submitted to your Cart:

    Vehicle:      ${MercsMap.get(SelectedCarID).year} ${MercsMap.get(SelectedCarID).name} ${MercsMap.get(SelectedCarID).model}
    Price:          ${Fcn_FormartToCurrency(MercsMap.get(SelectedCarID).price)}
    color:          ${JSON.parse(localStorage.getItem(SelectedCarID)).color}
    Quantity:    x${JSON.parse(localStorage.getItem(SelectedCarID)).quantity}
    ---------------------------------------------------
    Cars in your Cart:   ${sessionStorage.getItem("cartQuantity")}
    Your Cart's Total:    ${Fcn_FormartToCurrency(sessionStorage.getItem("cartTotal"))}  (incl vat: @15%)`)

        }
    })


    //3) Object constructor for Add-To-Cart
    function CartObjectConstructor(carid, color, quantity) {
        //No need to save all the car's details in local storage, the CarID is enough as ref and allows us to always read car details from MercsMap e.g. price  in case the local storage info is outdated
        this.carid = carid,
        this.color = color,
         this.quantity = quantity,

         // Since the following 4 are set the same for all cart items , check if delivery had already been set for this on any other previous cars in the cart, and use those delivery details    
        this.coupontype = (localStorage.length > 0) ? JSON.parse(localStorage.getItem(localStorage.key(0))).coupontype : "none"
        this.couponvalue = (localStorage.length > 0)? 0:0 //we just create and initialise with 0, even at future times, coz Sync will soon just give it (back) it's appropriate value from coupon type
        this.delivery = (localStorage.length > 0 && JSON.parse(localStorage.getItem(localStorage.key(0))).delivery != "Not selected") ? JSON.parse(localStorage.getItem(localStorage.key(0))).delivery : "Not selected"
        this.deliveryoption = (localStorage.length > 0 && JSON.parse(localStorage.getItem(localStorage.key(0))).deliveryoption != "Not selected") ? JSON.parse(localStorage.getItem(localStorage.key(0))).deliveryoption : "Not selected" // Delivery option details will be added later on shipping page
        this.purchaserdetails = (localStorage.length > 0 && JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails != "Not provided") ? JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails : "Not provided" // This will be a an object with fullname, phone, email, address, notes 
        this.orderrefnumber = "Pending"; //generated at the end, at confirmation of order. So no new car added will have a ref number at this point
        this.orderStatus = "Pending"; //Will be changed when order is completed and finalised. 

    }




})