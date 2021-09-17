
/*NB: MercsMap is a map i created in the MainCartScript.js to act 
as the database accessible from all documents.*/



$(function () {




    /*--------------------------------------DYNAMICALLY POPULATE CART TABLE--------------------------------------*/


    // 0) POPULATE THE PAGE WITH WHAT'S IN CART (while hidden from user view)
    if (localStorage.length > 0) {


        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i); //Key for referrencing Local Storage and MercsMap;
            CartItem = JSON.parse(localStorage.getItem(key));

            let DownCaret = "<i class='fas fa-caret-down'></i>"; //just to reduce lines of code getting too long

            $("#ID_CartContainer").append(
                "<div class='row border Cls_CarRow_Customized " + CartItem.carid + "'>" +

                "<div class='col-md-3 Cls_CustomizeCol'>" +
                "<div class='Cls_ColumnHeaders'>" + "<b>" + MercsMap.get(key).year + " " + MercsMap.get(key).name + " " + MercsMap.get(key).model + "</b>" + "</div>" +
                "<div class='Cls_Imagecontainer'>" +
                "<img src='" + MercsMap.get(key).image + "' class='img-thumbnail' alt='" + MercsMap.get(key).image + "'> " +
                "</div>" +
                "</div>" +

                "<div class='col-md'>" +
                "<div class='row DetailsRow'>" +


                "<div class='Cls_CustomizeCol Cls_3DetailColumnContainers'>" +
                "<div class='Cls_ColumnHeaders'>" + DownCaret + " Details" + "</div>" +
                "<div class='Cls_Detail'>" +
                "<b>" + MercsMap.get(key).year + " " + MercsMap.get(key).name + " " + MercsMap.get(key).model + "</b>" + "<br>" +
                "<span>Name: </span>" + "<span class='Cls_infoSpan'>" + MercsMap.get(key).name + "</span>" + "<br>" +
                "<span>Model: </span>" + "<span class='Cls_infoSpan'>" + MercsMap.get(key).model + "</span>" + "<br>" +
                "<span>Year: </span>" + "<span class='Cls_infoSpan'>" + MercsMap.get(key).year + "</span>" + "<br>" +
                "<span>Colour: </span>" + "<span class='Cls_infoSpan'>" + CartItem.color + "</span>" + "<br>" +
                "<span>Engine: </span>" + "<span class='Cls_infoSpan'>" + MercsMap.get(key).engine + "</span>" + "<br>" +
                "<button class='btn btn-dark  Fcn_ChangeCarDetails'name='" + CartItem.carid + "' > " + "Change</button>" +
                "</div>" + "<div class='Cls_VisualAid'></div>" +
                "</div>" +

                "<div class='Cls_CustomizeCol Cls_3DetailColumnContainers'>" +
                "<div class='Cls_ColumnHeaders'>" + DownCaret + " Shipping" + "</div>" +
                "<div class='Cls_Detail'>" +

                "<span>Purchaser: </span>" + "<span class='Cls_infoSpan'>" + ((CartItem.purchaserdetails == "Not provided") ? "Not Provided" : ((CartItem.purchaserdetails.fullname.length < 22) ? CartItem.purchaserdetails.fullname : CartItem.purchaserdetails.fullname.substring(0, 22) + "...")) + "</span>" + "<br>" +
                "<span>Shipping: </span>" + "<span class='Cls_infoSpan'>" + ((CartItem.delivery == "Not selected") ? "Not Selected" : (((CartItem.delivery + ": " + CartItem.deliveryoption)).length<28)? CartItem.delivery + ": " + CartItem.deliveryoption : (CartItem.delivery + ": " + CartItem.deliveryoption).substring(0, 28) + "...") + "</span>" + "<br>" +
                "<span>Address: </span>" + "<span class='Cls_infoSpan'>" + ((CartItem.purchaserdetails == "Not provided") ? "-" : ((CartItem.purchaserdetails.address.length < 22) ? CartItem.purchaserdetails.address : CartItem.purchaserdetails.address.substring(0, 22) + "...")) + "</span>" + "<br>" +
                "<span>Phone: </span>" + "<span class='Cls_infoSpan'>" + ((CartItem.purchaserdetails == "Not provided") ? "-" : ((CartItem.purchaserdetails.phone.length < 22) ? CartItem.purchaserdetails.phone : CartItem.purchaserdetails.phone.substring(0, 22) + "...")) + "</span>" + "<br>" +
                "<span>Email: </span>" + "<span class='Cls_infoSpan'>" + ((CartItem.purchaserdetails == "Not provided") ? "-" : ((CartItem.purchaserdetails.email.length < 22) ? CartItem.purchaserdetails.email : CartItem.purchaserdetails.email.substring(0, 22) + "...")) + "</span>" + "<br>" +
                "<span>Notes: </span>" + "<span class='Cls_infoSpan'>" + ((CartItem.purchaserdetails == "Not provided") ? "-" : ((CartItem.purchaserdetails.notes.length < 22) ? CartItem.purchaserdetails.notes : CartItem.purchaserdetails.notes.substring(0, 22) + "...")) + "</span>" + "<br>" +
                "<button class='btn btn-dark  Fcn_ChangeShippingDetails' name='" + CartItem.carid + "' > " + "Change</button>" +
                "</div>" + "<div class='Cls_VisualAid'></div>" +
                "</div>" +

                "<div class='Cls_CustomizeCol Cls_3DetailColumnContainers'>" +
                "<div class='Cls_ColumnHeaders'>" + DownCaret + " Cost" + " <small>(vat excl)</small>" + "</div>" +
                "<div class='Cls_Detail Cls_DefaultOpenForMobile'>" +
                "<span>Price: </span>" + Fcn_FormartToCurrency(MercsMap.get(key).price) + "<br>" +
                "<span>Quantity: </span>" + CartItem.quantity + "<br>" +
                "<span>Delivery: </span>" + "<span class='Cls_TotalSumBorder Cls_infoSpan'>" + ((CartItem.delivery == "Not selected") ? "Not selected" : Fcn_FormartToCurrency(ShippingRatesMap.get(CartItem.deliveryoption)) + " (ea.)") + "</span>" + "<br>" +
                "<span>Coupon: </span>" + "<span class='Cls_TotalSumBorder Cls_infoSpan Cls_CouponField'>" + ((CartItem.delivery == "Not selected") ? "-" : Fcn_FormartToCurrency(CartItem.couponvalue) + "</span>" + " <span><i class='fas fa-tag Cls_CouponTag'></i>") + "</span><br>" +
                "<span>Subtotal: </span>" + "<span class='Cls_infoSpan Cls_SubtotalField'>" + ((CartItem.delivery == "Not selected") ? "Waiting for shipping details" : Fcn_FormartToCurrency(((Number(ShippingRatesMap.get(CartItem.deliveryoption)) + Number(MercsMap.get(key).price)) - Number(CartItem.couponvalue)) * Number(CartItem.quantity))) + "</span>" + "<br>" +
                "<br>" +
                "</div>" + "<div class='Cls_VisualAid'></div>" +
                "</div>" +
                "</div>" +
                "</div>" +




                "<div class='Cls_DeleteItemContainer'>" +
                "<span class='Cls_CartItemSuccessful'><i class='far fa-check-circle'></i></span>" +
                "<button class='btn btn-dark  Fcn_DeleteItemBtn' name='" + CartItem.carid + "' > " + "<i class='fas fa-trash alt'></i> " + " Remove from Cart </button>" +
                "</div>" +

                "</div>"

            );
        }
        //after populating cart items from above, put Grand total and confirm button at the bottom
        $("#ID_CartContainer").append(
            "<div class='Cls_GrandTotalRow'>" +
            "<div class='Cls_BottomContainer'>" +

            "<div class='Cls_GrandTotalContainer'>" +
            "<span>Grandtotal: <b> <label id='ID_GrandTotalAmount'>" + ((CartItem.delivery == "Not selected") ? "0.00" : Fcn_FormartToCurrency(sessionStorage.getItem("cartTotal"))) + "</label></b><br>" +
            "<small>" + ((CartItem.delivery == "Not selected") ? "(Waiting for shipping details)" : "(vat incl @15%)") + "</small></span>" +
            "</div>" +

            "<div class='Cls_ConfirmOrderContainer'>" +
            "<button id='ID_ConfirmOrderBtn' class='btn btn-warning Cls_SiteThemeBtn'" + ((CartItem.delivery == "Not selected") ? "disabled title='Provide shipping details first'" : " title='Click to confirm and place this order.'") + ">Confirm This Order.</button>" +
            "</div>" +

            "<div class='Cls_OrderConfirmed'>" +
            "<span>Your Order Has Been Received. <i style='color:orangered' class='fas fa-award'></i> <br> Ref: <b> <label id='ID_RefNumber'>" + "MERC-22461" + "</label></b>" + "</span>" +
            "</div>" +

            "</div>" +
            "</div>"
        );

        //Display the populated cart page now
        $("#ID_CartContainer").css("visibility", "initial").show();



        /*----------------------------------------RETURN TO SCROLL POSITION---------------------------------------*/

        //If user had gone to change details about a car or shipping, display must return to scroll position he/she was
        if ("ReturnToCartItem" in sessionStorage) {

            let ReturnToCartItem = sessionStorage.getItem("ReturnToCartItem");
            sessionStorage.removeItem("ReturnToCartItem")

            let ScrollPageToItem = setInterval(function () {
                clearInterval(ScrollPageToItem); //clear the interval itself same moment it triggers, no waiting for after animation ends
                $("html, body").animate({
                    scrollTop: $("div.row." + ReturnToCartItem).offset().top - 150
                }, 1500);
            }, 300)
        }
    } else {
        CartIsEmpty();
        return; //proceed no further.
    }




    /*------------------------------------------------------------COLUMNS-------------------------------------------------------*/


    /*OPENNING AND CLOSSING ANIMATIONS FOR INFO COLUMNS */
    $("div.Cls_CustomizeCol div.Cls_ColumnHeaders").click(function () {
        let ColumnContent = $(this).siblings("div.Cls_Detail");
        ColumnContent.slideToggle("slow");
    })



    /*------------------------------------------------------------COUPONS-------------------------------------------------------*/


    /*NOTE ABOUT COUPON
    Coupon discount is awarded on subtotal of both (shipping + price) * quantity i.e
    per vehicle plus it's shipping cost, and before vat.
    So before proceeding to award a coupon, first check the (a) localStorage cart 
    and (b) shipping options made, and (c) if there is a coupon made available from 
    MainCartScript.js (acting as database), and (d) if any coupon hasnt been applied
    already. Ticking all those qualifies being awarded a coupon, the function below
    does that check.
    */

    //Function to check if the order currently qualifies or we have an applicable coupon that has been issued in MainCartScript.js (acting as database)
    function Fcn_QualifyForCoupon() {
        //a,b) Verify cart is not empty and shipping has been set
        if (localStorage.length > 0 && JSON.parse(localStorage.getItem(localStorage.key(0))).delivery != "Not selected") {

            //c,d) If there's available coupon: Check if one hasn't been applied already
            if (CouponsMap.get("available-coupon") != "none" && JSON.parse(localStorage.getItem(localStorage.key(0))).coupontype == "none") {
                $(".Cls_CouponTag").css("color", "orange");
                $(".Cls_CouponTag").attr("title", "Click to apply! There is a discount coupon available for your order.");
                return true
            }
            // If no available/issued coupons in MainCartScript.js (acting as database)
            else if (JSON.parse(localStorage.getItem(localStorage.key(0))).coupontype == "none" && CouponsMap.get("available-coupon") == "none") {

                $(".Cls_CouponTag").css("color", "rgb(184, 182, 182)");
                $(".Cls_CouponTag").attr("title", "There is currently no available coupons.");
            }
            // if coupon already applied: even if MainCartScript.js (acting as database) may not have one available on offer at a later time
            else if (JSON.parse(localStorage.getItem(localStorage.key(0))).coupontype != "none") {
                $(".Cls_CouponTag").css("color", "rgb(184, 182, 182)");
                $(".Cls_CouponTag").attr("title", sessionStorage.getItem("CouponApplied") + " : Coupon already applied to your order.");
            }

            return false; //no coupon can be applied

        }
        else { return false; } //no coupon can be applied
    }




    /* ------------------------------ CALL COUPON-MODAL ON PAGE SCROLL----------------------------------------*/
    //Studied and followed code on https://www.sitepoint.com/scroll-based-animations-jquery-css3/ */




    // assign event listener only if qualifying/theres a coupon to award, 
    //(NB: The puporse of this function is 2 fold: (a) checks if qualify and coupon to award is there, (b) initialises and applies respective display indications/classes.
    if (Fcn_QualifyForCoupon()) {

        //if coupon modal has been shown already in this session then don't repeat it over and over for each Cart page visit
        if (!("CouponModalShown" in sessionStorage) && (sessionStorage.getItem("CouponModalShown") != "Shown")) {


            // a) Selector Caching for faster response and processing
            let $TargetElement = $(".Cls_SubtotalField"); // Accessible anywhere within this doc
            let $ThisWindow = $(window);

            //Event listener
            $ThisWindow.on('scroll resize load', Fcn_CheckScrollPosition)

            //Function to check position on load, scroll, resize
            function Fcn_CheckScrollPosition() {
                //GET THE WINDOW
                let ThisWindow_Height = $ThisWindow.height();
                let ThisWindow_Top = $ThisWindow.scrollTop(); //page scroll bars position (0 is the top most)
                let ThisWindow_Bottom = ThisWindow_Height + ThisWindow_Top; //current top position +height gives how deep(bottom) it goes

                //GET THE ELEMENT TO TARGET
                let TargetElement_Height = $TargetElement.outerHeight();
                let TargetElement_Top = $TargetElement.offset().top; //scrolled to position
                let TargetElement_Bottom = TargetElement_Height + TargetElement_Top;

                //CALCULATE IF CART (subtotal field) IS IN VIEW and DISPLAY COUPON MODAL
                if ((ThisWindow_Bottom >= TargetElement_Top) && ((ThisWindow_Top + 155) <= TargetElement_Bottom)) { //155 to accommodate for the nav menu and sticky hearder heights

                    //Event should fire only once and not annoy user. User can always access coupon modal via tags in coupon fields
                    $ThisWindow.off('scroll resize load');
                    sessionStorage.setItem("CouponModalShown", "Shown");
                    Fcn_OpenCouponModal();
                }

            }
        }
    }


    /*-------------------------------------- CALL COUPON-MODAL ON CLICK OF COUPON TAG ----------------------------------------*/


    //DISPLAY COUPON MODAL - should open only if all conditions are met - detemined in called function
    $(".Cls_CouponTag").click(() => {
        Fcn_OpenCouponModal();
    })



    
    /*-------------------------------------- OPENING COUPON-MODAL ----------------------------------------*/

    //This function may be called by scroll or coupon tag click, so it should have a check of its own
    function Fcn_OpenCouponModal() {

        //re-check if coupon available/qualified
        if (Fcn_QualifyForCoupon() == false) { 
            return;
        }

        let TotalDiscount = 0;
        //Notify user of the available/awarded coupon
        TotalDiscount = Number(sessionStorage.getItem("cartTotalBeforeVAT")) * Number(CouponsMap.get(CouponsMap.get("available-coupon")));

        $(".Cls_CouponType").text(CouponsMap.get("available-coupon"));
        $("#ID_CouponsModal #ID_Purchaser").text(JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails.fullname);
        $("#ID_CouponsModal .Cls_TotalCouponValue").text(Fcn_FormartToCurrency(TotalDiscount));
        $("#ID_CouponsModal .Cls_CouponPercentage").text(`${(CouponsMap.get(CouponsMap.get("available-coupon")) * 100)}%`);
        $("#ID_CouponsModal").modal('show');

        //Manually recreate and add the fade effect (+ css also), since the original bootstrap one causes conflicts and modal wouldnt close
        $("#ID_CouponsModal").animate({
            opacity: 1
        }, 500)

    }






    /*----------------------------------------- APPLYING The COUPON-------------------------------------------------*/
    $("#ID_ApplyCouponForm").submit((e) => {
        e.preventDefault();

        // UPDATE EACH ITEM IN CART WITH THE COUPON TYPE - actual value is all done by the reusable SyncCart function inMainCartScrypt
        if (localStorage.length > 0) { //just checking but no need, previous checks are done to prevent getting here if cart is empty
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                let CartItem = JSON.parse(localStorage.getItem(key)); //Get current cart entry as it is
                CartItem.coupontype = $("#ID_CouponType").text(); //MAke the change
                localStorage.setItem(CartItem.carid, JSON.stringify(CartItem)); //update back all the items in cart/local storage
            }


            /*NOW SYNC ALL UPDATES:
            1) THE TOTAL & QUANTITY IN CART - into sessionStorage's "cartTotal" & cartQuantity
            2) CART NAV MENU's text, to reflect how many items now in cart 
            3) PROGRESS TICK - to reflect this Progress of adding an item to cart from catalogue has been completed
            */
            Fcn_SyncCart();

            //directly update the respective elements in cart, without refreshing the page
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                let CartItem = JSON.parse(localStorage.getItem(key)); //Get current cart entry as it is
                $("div." + key).find(".Cls_CouponField").text(Fcn_FormartToCurrency(CartItem.couponvalue));
                $("div." + key).find(".Cls_SubtotalField").text(Fcn_FormartToCurrency(((Number(ShippingRatesMap.get(CartItem.deliveryoption)) + Number(MercsMap.get(key).price)) - Number(CartItem.couponvalue)) * Number(CartItem.quantity)))
            }


        }

        //Indicate on display
        $(".Cls_CouponTag").css("color", "rgb(184, 182, 182)");
        $(".Cls_CouponTag").attr("title", sessionStorage.getItem("CouponApplied") + " : Coupon already applied to your order.");

        //Close the modal
        Fcn_CloseModal()

    })




    //IF USER CHOOSES TO CANCEL/CLOSE modal window without applying coupon
    $("#ID_ModalCancelClose").click(() => {
        Fcn_CloseModal()
    })


    //Reusable function to animate and close coupon modal
    function Fcn_CloseModal() {
        setTimeout(() => {
            $("#ID_CouponsModal").animate({
                opacity: 0
            }, 500).promise().done(() => {
                $("#ID_CouponsModal").modal("hide")
            })
        }, 100)

    }

    //Re-apply my manual fade effect using the enabling css on modal's close
    //learnt on https://www.w3schools.com/bootstrap4/bootstrap_ref_js_modal.asp
    $("#ID_CouponsModal").on('hidden.bs.modal', function () {
        $(".modal").css({ "background-color": "none !important;", "opacity": 0 })
    });


    /*--------------------------------------CHANGE CAR DETAILS BUTTON--------------------------------------*/

    //CHANGE CAR OPTIONS BUTTON
    $("button.Fcn_ChangeCarDetails").click(function () {

        //Send ID to session storage so that product page knows which car to display about
        let SelectedCarID = $(this).attr("name"); //Get matching ID of Selected Clicked Car
        sessionStorage.setItem("SelectedCarID", SelectedCarID); //Car ID to view
        sessionStorage.setItem("CallingPage", "Cart.html"); //tell the productview page who called, and return back to who called
        sessionStorage.setItem("ReturnToCartItem", SelectedCarID); //When user returns from the called product view, this tells "here is where we were"

        //Open product's page
        location.href = 'ProductView.html';
    })





    /*--------------------------------------CHANGE SHIPPING DETAILS BUTTON--------------------------------------*/

    //CHANGE SHIPPING OPTIONS BUTTON
    $("button.Fcn_ChangeShippingDetails").click(function () {

        //Send ID to session storage so that product page knows which car to display about
        let SelectedCarID = $(this).attr("name"); //Get matching ID of Selected Clicked Car
        sessionStorage.setItem("CallingPage", "Cart.html"); //tell the productview page who called, and return back to who called
        sessionStorage.setItem("ReturnToCartItem", SelectedCarID); //When user returns from the called product view, this tells "here is where we were"

        //Open product's page
        location.href = 'Shipping.html';
    })






    /*---------------------------------------------------DELETE FROM CART---------------------------------------------------*/




    // 1) OPTION TO DELETE FROM CART 
    $("button.Fcn_DeleteItemBtn").click(function () {

        //Get key(cair id) of respecive cart item - I stored them in the matching button's name attr during dynamic populating
        let key = $(this).attr("name");

        //scroll cart item into comfortable/visible view first so that user knows what he/she is deleting. Use a promise to wait until animation to position is complete
        //Used a promise, coz animation here fires twice for html and body, if there was third one it would fire thrice. So the promice came to the rescue, running only once, when all calls about the animation are done
        $("html, body").animate({
            scrollTop: $("div.row." + key).offset().top - 150
        }, 300).promise().done(function () { //after animation is fully complete
            if ((confirm("Remove " + MercsMap.get(key).year + " " + MercsMap.get(key).name + " " + MercsMap.get(key).model + " from Cart?"))) {
                Fcn_RemoveItem(key);
            } else {
                return; //if user clicks cancel 
            }
        })

    })




    // 2) REMOVE ITEM FROM CART
    function Fcn_RemoveItem(key) {

        //Animate and slide out from the displayed cart list - setTimeout helps the animation to show.
        setTimeout(function () {
            $("div." + key).slideUp(1000, () => { //slide out of view cart item..
                if (localStorage.length == 0) { //if now empty..
                    $(".Cls_GrandTotalRow").fadeOut(() => { //remove the grand total row..
                        $("html, body").animate({ //and scroll up the window to show cart empty remark
                            scrollTop: $("#ID_PageHeading").offset().top - 400
                        }, 500)
                    });


                }
            });
        }, 100)

        //Delete from cart local storage
        localStorage.removeItem(key);

        /*NOW SYNC ALL UPDATES:
         1) THE TOTAL & QUANTITY IN CART - into sessionStorage's "cartTotal" & cartQuantity
         2) CART NAV MENU's text, to reflect how many items now in cart 
         3) PROGRESS TICK - to reflect this step of removing an item from cart 
        */
        Fcn_SyncCart();

        //Update grandtotal box
        if (localStorage.length > 0) {
            if (JSON.parse(localStorage.getItem(localStorage.key(0))).delivery == "Not selected") {
                //If not shipping information
                $("#ID_GrandTotalAmount").text("0.00");
            } else {
                //get the new updated total
                $("#ID_GrandTotalAmount").text(Fcn_FormartToCurrency(sessionStorage.getItem("cartTotal")))
            }
        } else { CartIsEmpty() } //if cart is now empty

    }




    // 3) IF CART IS (NOW) EMPTY
    function CartIsEmpty() {
        //Hero Get started button shouldnt say "Almost Ddone" in this case.
        $("#ID_GetStartedBtn span").text("Get started");

        //Re-assign event listener
        $("#ID_GetStartedBtn").click(function () { location.href = "Catalogue.html"; })
        $("#ID_GetStartedBtn").attr("title", "Come See Our Deluxe Catalogue");

        //Heading
        $("#ID_PageHeading").html("Your Cart Is Empty.");
        //$("#ID_MainContainer").css("min-height", "40vh");

        //Display a notifying remark
        $("#ID_MainContainer").prepend("<p class='Cls_EmptyCartRemark'>Go to Catalogue, explore our deluxe categories and make a pick.</p>");
        $("#ID_MainContainer .Cls_EmptyCartRemark").fadeIn(2000);


    }




    /*-------------------------------------------- CONFIRM ORDER ----------------------------------------------------- */


    //Finacl stage in the progress of making an order
    $("#ID_ConfirmOrderBtn").click(function() {


        if (localStorage.length > 0) { //just checking but no need, previous checks are done to prevent getting here if cart is empty
            //Confirm to preceed with placing order
            if (confirm("Proceed and place this order?")) {

                //re-check if there is a coupon not applied already
                if (JSON.parse(localStorage.getItem(localStorage.key(0))).coupontype == "none" && Fcn_QualifyForCoupon()) {
                    if (confirm("Do you want to proceed without applying your " + CouponsMap.get("available-coupon") + " coupon?") == false) {
                        return;
                    }
                }

                // Get A REF NUMBER 
                let RefNumber = Fcn_Generate();

                // UPDATE EACH ITEM IN CART WITH THE RefNumber 
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    let CartItem = JSON.parse(localStorage.getItem(key)); //Get current cart entry as it is
                    CartItem.orderrefnumber = RefNumber;
                    CartItem.orderStatus = "Confirmed";
                    localStorage.setItem(CartItem.carid, JSON.stringify(CartItem)); //update all the items in cart/local storage
                }

                //Disable/remove buttons, because no more changing, order has already been confirmed
                $("#ID_CartContainer button").css("visibility", "hidden").attr("disabled", "disabled");

                //reflect on Hero Banner
                //Hero Get started button shouldnt say "Almost Ddone" in this case.
                $("#ID_GetStartedBtn span").text("Get started");
                $("#ID_GetStartedBtn span").text("Order again?");
                //Re-assign event listener
                $("#ID_GetStartedBtn").click(function () { location.href = "Catalogue.html"; })
                $("#ID_GetStartedBtn").attr("title", "Your Merc keys are waiting... Recent order was successful.");

                //ALERT THE USER ON DISPLAY AND POPUP
                $("#ID_RefNumber").text(RefNumber);
                $(".Cls_ConfirmOrderContainer, .Cls_GrandTotalContainer").fadeOut().promise().done(() => {
                    $(".Cls_OrderConfirmed").fadeIn("slow").promise().done(() => {
                       
                        if ($(window).width() <= 800) { //Mobile display
alert(`Thank you ${(CartItem.purchaserdetails.fullname.length > 30) ? CartItem.purchaserdetails.fullname.substring(0, 30) + '...' : CartItem.purchaserdetails.fullname}:

Your order, Ref: ${RefNumber}, has been successful.
Please keep the referrence number, you will need it for:
> Making payments.
> Tracking your order.
> And any other enquiries with our team.

Regards.
The Merc-Shop Team.`)                      
                       
                        }
                        else {
                            alert(`Thank you ${(CartItem.purchaserdetails.fullname.length > 30) ? CartItem.purchaserdetails.fullname.substring(0, 30) + '...' : CartItem.purchaserdetails.fullname}:
    
    Your order, Ref: ${RefNumber}, has been successful.
    Please keep the referrence number, you will need it for:
    > Making payments.
    > Tracking your order.
    > And any other enquiries with our team.

Regards.
The Merc-Shop Team.`)
                        }
                    });
                });


                // CLEAR THE CART, READY TO START TAKING NEW ORDER - but allowing user to keep view of recent finished order.
                localStorage.clear();

                //SET ORDER PROGRESS IS COMPLETE
                OrderProgressCompleted = true;

                /*NOW SYNC ALL UPDATES:
                 1) THE TOTAL & QUANTITY IN CART - into sessionStorage's "cartTotal" & cartQuantity
                 2) CART NAV MENU's text, to reflect how many items now in cart 
                 3) PROGRESS TICK - to reflect this step of removing an item from cart 
                */
                Fcn_SyncCart();

                //Display on header too
                $("#ID_PageHeading").css({ "font-family": "Arial", "text-transform": "uppercase" }).text("ORDER COMPLETED - REF: " + RefNumber);

                //display visual indication of success, where there was red button, with green tick 
                $(".Cls_CartItemSuccessful").fadeIn("slow");

                //Scroll to first matched car into view
                setTimeout(() => {
                    $("html, body").animate({
                        scrollTop: $("div.Cls_CarRow_Customized").offset().top - 150
                    }, 900)
                }, 100)

            }
        }

    })

    //Function to generate reference number
    function Fcn_Generate() {
        let MyDate = new Date();
        return ("MERC" + MyDate.getFullYear() + "/" + MyDate.getMonth() + "-" + sessionStorage.getItem("cartQuantity") + "-" + Math.floor(Math.random() * 1000))
    }

})