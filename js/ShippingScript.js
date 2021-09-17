
/*NB: MercsMap is a map i created in the MainCartScript.js to act 
as the database accessible from all documents.*/
//NB: SHIPPING IS BASICALLY REFERS TO DELIVERY OPTIONS


$(function () {




    /*------------------------------------------ DISPLAY OPTIONS-------------------------------------------------*/

    /* placed here on top above other code bacause i will call some on("change") events, and they can only work if  
    the even it above the call. https://stackoverflow.com/a/24656959/16333159 */

    // HIDE OR SHOW DELIVERY OPTIONS based on selected Collection or Delivery
    $("#ID_DeliveryOrCollection").change(function () {
        if ($(this).val() == "Delivery") { $(".Cls_DeliveryOptions").slideDown("slow"); }
        if ($(this).val() == "Collection") {
            $("div.DeliveryDescription").slideUp("slow");
            $(".Cls_DeliveryOptions").slideUp("slow");
        }

    })


    //SLIDE UP OR DOWN THE SELECTED DELIVERY OPTION
    $("input[type=radio][name=DeliveryOptionCheck]").click(function () {
        //alert(this.value + "Yep I'm checkd");
        $("div.DeliveryDescription").slideUp("slow");
        $("label[for=" + $(this).attr("id") + "]").find("div.DeliveryDescription").slideDown("slow");

    })

    //DERTMINE IF ITS A CALL FROM CART PAGE, AND ASSIGN APPROPRIATE ACTIONS (to back button & nav)
    if (sessionStorage.getItem("CallingPage") == "Cart.html") {

        //Add a go back button
        $("#ID_Header").prepend("<button style=('margin-right:10px') class='btn btn-info Cls_SiteButtonTheme' id='ReturnToPageBtn'>" +
            "<i class='fas fa-arrow-left'></i>" + "Back to Cart" + "</button> | ");

        //Assign event to the back button
        $("#ReturnToPageBtn").click(function () {
            location.href = "Cart.html";
        })
        sessionStorage.setItem("CallingPage", ""); //clear the calling page

        //maybe just Show fade on Cart, to signify it as the active/ caller page
        $("#ID_CartMenu").css("background-color", "rgba(2, 95, 95, 0.308)");
    }
    /*------------------------------------------ ALERT USER ON PRICING -------------------------------------------------*/
    
    $(".Cls_AlertInfo .fa-exclamation-circle").click(function(){
        alert("Delivery cost is per each vehicle in cart. \nDelivery method selected will apply to all cars in cart.");
    })



    /*------------------------------------------ FETCH AND FILL ANY SET DELIVERY OPTIONS-------------------------------------------------*/


    // 1) FIRST GET IF DELIVERING OR COLLECTION HAD BEEN SET - from any entry e.g. key(0), coz their shipping details will all be the same
    if (localStorage.length > 0) {
        let deliveryORcollection = JSON.parse(localStorage.getItem(localStorage.key(0))).delivery;
        $("#ID_DeliveryOrCollection").removeAttr('selected').find("[value='" + deliveryORcollection + "']").attr('selected', 'selected');
    }


    // 2) FETCH DELIVERY OPTIONS IF SELECTED ALREADY
    if (localStorage.length > 0) {

        //If delivery option has been selected already
        let deliveryORcollection = JSON.parse(localStorage.getItem(localStorage.key(0))).delivery;
        if (deliveryORcollection == "Delivery") {
            $("#ID_DeliveryOrCollection").change();
            let deliveryoption = JSON.parse(localStorage.getItem(localStorage.key(0))).deliveryoption;
            deliveryoption = deliveryoption.replace(" ", "");
            $("#ID_" + deliveryoption).attr("checked", "checked"); //setting the radio button will automatically trigger the event associated
            $("label[for='" + ($("#ID_" + deliveryoption).attr("id")) + "']").find("div.DeliveryDescription").slideDown("slow");
        } //else leave the HTML's default 

    }



    // 3) FETCH PURCHASER's DETAILS IF SET ALREADY
    if (localStorage.length > 0) {

        //If delivery options has been selected already
        if (JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails != "Not provided") {
            let PurchaserDetails = JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails;
            $("#ID_PurchaserName").val(PurchaserDetails.fullname);
            $("#ID_PurchaserPhone").val(PurchaserDetails.phone);
            $("#ID_PurchaserEmail").val(PurchaserDetails.email);
            $("#ID_PurchaserAddress").val(PurchaserDetails.address);
            $("#ID_PurchaserNotes").val(PurchaserDetails.notes);
        } //else leave the HTML's default
    }

    //If delivery options not yet set, but user recently gave details in subscribe form from home page.
    if ((localStorage.length > 0 && JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails == "Not provided") || (localStorage.length == 0)) {
        //ASSIGN GIVEN DETAILS, user can delete/change them on screen
        ("CapturedName" in sessionStorage) ? $("#ID_PurchaserName").val(sessionStorage.getItem("CapturedName")) : 0 + 0; //sort of else do thing
        ("CapturedPhone" in sessionStorage) ? $("#ID_PurchaserPhone").val(sessionStorage.getItem("CapturedPhone")) : 0 + 0; //sort of else do thing
        ("CapturedEmail" in sessionStorage) ? $("#ID_PurchaserEmail").val(sessionStorage.getItem("CapturedEmail")) : 0 + 0; //sort of else do thing
    }






    /*------------------------------------------ SAVE ANY SELECTED DELIVERY OPTIONS-------------------------------------------------*/


    //SAVE CHANGES
    $("#ID_PurchaserDetailsForm").submit(function (e) {
        e.preventDefault();
        let ToDeliverOrCollect = "";
        let deliveryOption = "";

        // C) UPDATE EACH ITEM IN CART
        if (localStorage.length == 0) {
            alert("Your Cart is currently empty! \r\n Go to CATALOGUE page and make a pick before proceeding here.")
            return false;
        }

        // A) CHECK IF DELIEVERY OPTION HAS BEEN SELECTED before saving
        if ($("#ID_DeliveryOrCollection").val() == "Not selected") {
            //Highligh area
            $("#ID_DeliveryOrCollection").css("background-color", "rgb(236, 148, 148)");
            //bring user's attention to the area in question
            $("html, body").animate({
                scrollTop: $("#ID_DeliveryOrCollection").offset().top - 200
            }, 1000).promise().done(() => {
                alert("Please select DELIVERY or COLLECTION before proceeding.");
            })
            return false;
        } else {
            //Get delivery or colection choice
            ToDeliverOrCollect = $("#ID_DeliveryOrCollection").val();
        }

        // B) IF DELIVERY IS SELECTED, SEE IF A DELIVERY OPTION HAS BEEN MADE
        if ($("#ID_DeliveryOrCollection").val() == "Delivery") {
            if ($("input[type='radio']:checked").val() == undefined) {
               //highlight areas
                $(".Cls_DeliveryOptions form input").css("border-color", "rgb(235, 89, 89)");
                $("html, body").animate({
                    scrollTop: $("#ID_DeliveryOrCollection").offset().top-150
                }, 1000).promise().done(() => {
                    alert("Please select any of the 3 Delivery options before proceeding.")
                })
                return false;
            } else {
                //Get the selected option
                deliveryOption = $("input[type='radio']:checked").val();
            }
        } else { //purchaser collecting on his/her own
            deliveryOption = "Individual arrangement";
        }

        // C) UPDATE EACH ITEM IN CART
        if (localStorage.length > 0) {
            for (let i = 0; i < localStorage.length; i++) {
                //TO UPDATE ANY CHANGE, WE HAVE TO RE ADD THE WHOLE CART ITEM AS A WHOLE
                let key = localStorage.key(i);
                let CartItem = JSON.parse(localStorage.getItem(key)); //Get current cart entry as it is
                CartItem.delivery = ToDeliverOrCollect;
                CartItem.deliveryoption = deliveryOption;
                CartItem.purchaserdetails = new PurchaserObjectConstructor($("#ID_PurchaserName").val(), $("#ID_PurchaserPhone").val(), $("#ID_PurchaserEmail").val(), $("#ID_PurchaserAddress").val(), $("#ID_PurchaserNotes").val()) // Create purchaser object inside this cart object

                //UPDATE RESPECTIVE LOCAL STORAGE
                localStorage.setItem(CartItem.carid, JSON.stringify(CartItem));
            }
        }

        /* D) NOW SYNC ALL UPDATES:
         1) THE TOTAL & QUANTITY IN CART, INCLUDING SHIPPING DELIVERY OPTIONS - into sessionStorage's "cartTotal" & cartQuantity
         2) CART NAV MENU's text, to reflect how many items now in cart 
         3) PROGRESS TICK - to reflect this Progress of providing shipping details
        */
        Fcn_SyncCart();

        // E) NOTIFY THE USER OF THE TOTAL AND SUCCESSFUL UPDATE TO SHIPPING DETAILS
        CartItem = JSON.parse(localStorage.getItem(localStorage.key(0))); //Get any (even first) entry
        //Used Unicode bold text below from: https://yaytext.com/bold-italic/
        if ($(window).width() <= 800) { //Mobile display
            alert(`Your ${(CartItem.delivery == "Delivery") ? "𝗗𝗲𝗹𝗶𝘃𝗲𝗿𝘆" : "𝗖𝗼𝗹𝗹𝗲𝗰𝘁𝗶𝗼𝗻"} details have been saved:

Shipping:      ${(((CartItem.delivery + ' : ' + CartItem.deliveryoption).length>30)? (CartItem.delivery + ' : ' + CartItem.deliveryoption).substring(0, 30)+"...":(CartItem.delivery + ' : ' + CartItem.deliveryoption))}
Name:           ${(CartItem.purchaserdetails.fullname.length > 20) ? CartItem.purchaserdetails.fullname.substring(0, 20) + '...' : CartItem.purchaserdetails.fullname}
Address:        ${(CartItem.purchaserdetails.address.length > 20) ? CartItem.purchaserdetails.address.substring(0, 20) + '...' : CartItem.purchaserdetails.address}
Contacts:       ${((CartItem.purchaserdetails.phone + ', ' + CartItem.purchaserdetails.email).length > 20) ? (CartItem.purchaserdetails.phone + ', ' + CartItem.purchaserdetails.email).substring(0, 20) + '...' : (CartItem.purchaserdetails.phone + ', ' + CartItem.purchaserdetails.email)}
Notes:            ${CartItem.purchaserdetails.notes.substring(0, 20)} ...
---------------------------------------------------
Cars in your Cart:   ${sessionStorage.getItem("cartQuantity")}
Your Cart's Total:    ${Fcn_FormartToCurrency(sessionStorage.getItem("cartTotal"))}  (incl vat: @15%)`)


        }
        else { //Desktop display
        alert(`Your ${(CartItem.delivery == "Delivery") ? "𝗗𝗲𝗹𝗶𝘃𝗲𝗿𝘆" : "𝗖𝗼𝗹𝗹𝗲𝗰𝘁𝗶𝗼𝗻"} details have been saved:

    Shipping:      ${(CartItem.delivery + ' : ' + CartItem.deliveryoption).substring(0, 40)}
    Name:           ${(CartItem.purchaserdetails.fullname.length > 30) ? CartItem.purchaserdetails.fullname.substring(0, 30) + '...' : CartItem.purchaserdetails.fullname}
    Address:        ${(CartItem.purchaserdetails.address.length > 30) ? CartItem.purchaserdetails.address.substring(0, 30) + '...' : CartItem.purchaserdetails.address}
    Contacts:       ${((CartItem.purchaserdetails.phone + ', ' + CartItem.purchaserdetails.email).length > 30) ? (CartItem.purchaserdetails.phone + ', ' + CartItem.purchaserdetails.email).substring(0, 30) + '...' : (CartItem.purchaserdetails.phone + ', ' + CartItem.purchaserdetails.email)}
    Notes:            ${CartItem.purchaserdetails.notes.substring(0, 30)} ...
    ---------------------------------------------------
    Cars in your Cart:   ${sessionStorage.getItem("cartQuantity")}
    Your Cart's Total:    ${Fcn_FormartToCurrency(sessionStorage.getItem("cartTotal"))}  (incl vat: @15%)`)


        }


        //STORE USER IN SESSION STORAGE - Keep in session storage for possible later usage/user convenience during the session e.g. requesting get in touch
        sessionStorage.setItem("CapturedName", $("#ID_PurchaserName").val());
        sessionStorage.setItem("CapturedPhone", $("#ID_PurchaserPhone").val());
        sessionStorage.setItem("CapturedEmail", $("#ID_PurchaserEmail").val());

    })


    //Object constructor for purchaser object
    function PurchaserObjectConstructor(fullname, phone, email, address, notes) {
        this.fullname = fullname,
            this.phone = phone,
            this.email = email,
            this.address = address,
            this.notes = (notes == "") ? "None" : notes
    }

    
    
    /*----------------------RESTORE APPEARANCE AFTER USER MAKES CORRECTION OF SKIPPED STEP--------------------------*/


    /* When user comes to make a Shipping option after being alerted*/
    $("#ID_DeliveryOrCollection").change(function () {
        //bring back the normal background colour
        $("#ID_DeliveryOrCollection").css("background-color", "rgb(235, 230, 230)");
    })

    /* When user comes to make a delivery option after being alerted*/
    $(".Cls_DeliveryOptions form input").click(function(){
        //bring back the normal background colour
        $(".Cls_DeliveryOptions form input").css("border-color", "teal");
        
    })

})