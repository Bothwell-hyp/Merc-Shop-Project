
/*NB: MercsMap is a map i created in the MainCartScript.js to act 
as the database accessible from all documents.*/



$(function () {



    /*--------------------------------------DYNAMICALLY POPULATE DISPLAY--------------------------------------*/

    // 0) DYNAMICALY POPULATE THE PRODUCTS - (reason being during development, constant changes had to be made in the html, so changing all product's HTML one by one was strenuous

    // 0.1) FIRST HIDE ALL THE CONTAINERS WHILE WE POPULATE THEM
    $("section.Cls_ShowYear2021, section.Cls_ShowYear2020, section.Cls_ShowYear2019, section.Cls_ShowAllCarsList").hide();

    for (let key of MercsMap.keys()) {
        //ADD TO GRID COLUMN
        $("#" + key).append(
            "<img src='" + MercsMap.get(key).image + "' class='img-fluid img-thumbnail' alt='" + MercsMap.get(key).image + "'> " +
            ((key in localStorage) ? "<i class='fas fa-clipboard-check Cls_IsVehicleInCart Cls_VehicleAddedToCart' title='This vehicle is in Cart'></i>" : "<i class='fas fa-clipboard-check Cls_IsVehicleInCart' title='This vehicle is in Cart'></i>") + //the 2 clases, Cls_IsVehicleInCart and Cls_VehicleAddedToCart help to visually indicate if a vehicle is in the cart
            "<div class='DetailsPreview p-3'>" +
            "<p class='Cls_CarName'>" + MercsMap.get(key).year + " " + MercsMap.get(key).name + " " + MercsMap.get(key).model + "</p>" +
            "<hr>" +
            "<div class='Cls_MoreText'>" +
            "<span class='Cls_CarColor'>" + MercsMap.get(key).color + "</span>" +
            "<br>" +
            "<span class='Cls_CarPrice'>" + Fcn_FormartToCurrency(MercsMap.get(key).price) + "</span>" +
            "</div>" +
            "<br>" +
            "<button class='btn btn-outline-light Fcn_MoreDetails'>More Details</button> &nbsp; " +
            "<button title='Quick add to Cart' class='btn btn-outline-light Fcn_QuickAddToCart'><i class='fas fa-shopping-cart'></i>+</button>" +
            "</div>" +
            "</div>"
        );

        //ADD TO HOVER TABLE COLUMN
        $("#ID_AllCarsTable").append(
            "<tr title='Click to view vehicle.' class='Cls_TableListedCar_Row'>" +
            "<td>" + MercsMap.get(key).year + "</td>" +
            "<td>" + MercsMap.get(key).name + " " + MercsMap.get(key).model + "</td>" +
            "<td>" + MercsMap.get(key).color + "</td>" +
            "<td>" + Fcn_FormartToCurrency(MercsMap.get(key).price) + "</td>" +
            "<td hidden class='Cls_CarID'>" + key + "</td>" +
            "</tr>"
        );

    }




    /*------------------------------- ON LOAD, DERTEMINE THE DISPLAY CATEGORY TO SHOW AFTER POPULATING---------------------------------*/



    //0.2) Now, if returning from More Details - Display the previous display the user had, else go on to display the normal screen, but let's only show the first/one category (year) at first, the other 2 categories/choices will display when user selects and chooses them from dropdown menu
    if ("ReturnToCatalogueDisplay" in sessionStorage) {

        let ReturnToCatalogueDisplay = sessionStorage.getItem("ReturnToCatalogueDisplay");
        sessionStorage.removeItem("ReturnToCatalogueDisplay"); //Delete it soon afterwards.
        let VehicleClass = ""

        switch (ReturnToCatalogueDisplay) {
            case "Category: Year 2021": VehicleClass = "Cls_ShowYear2021"; break;
            case "Category: Year 2020": VehicleClass = "Cls_ShowYear2020"; break;
            case "Category: Year 2019": VehicleClass = "Cls_ShowYear2019"; break;
            case "Category: All Mercs": VehicleClass = "Cls_ShowAllMercs"; break;
            case "Category: List all cars": VehicleClass = "Cls_ShowAllCarsList"; break;
        }

        //Reflect on the header label
        $("#ID_DropDownLabel span").html(ReturnToCatalogueDisplay);
        //visibility starts hidden while the contents get loaded, then show becomes smooth when
        $("section." + VehicleClass).css("visibility", "initial").show("slow");

        Fcn_ScrollAndResize();

    } else {
        //Else display normal first display
        $("section.Cls_ShowYear2021").css("visibility", "initial").show();
    }






    /*-------------------------------------------------------DROP DOWN MENU---------------------------------------------------------------*/


    //HOVER AND STAY A LITTLE BIT TO DISPLAY DROPDOWN MENU
    let HoveringCounter = 0;
    $("#ID_DropDownLabel")
        .mousemove(() => {
            if ($(window).width() <= 800) { return; } //if mobile ignore

            //Counter to determine if user still hovering on the dropdown menu
            HoveringCounter++;
            setTimeout(() => {
                if (HoveringCounter > 0) { //means user still intending to dropdown menu
                    $("#ID_DropDownLabel").next("ul").stop().show("slow"); //stop cancels any ongoing hide, and ensures we just proceed to show
                }
            }, 200) //delay to come back check if still hovering
        })
        .mouseleave(() => {
            HoveringCounter = 00
        }); //reset clear the counter indicating user didnt intend to display dropdown menu, just passing through





    //hide menu
    $("#ID_DropDownMenu_Container").mouseleave(function () {
        if ($(window).width() <= 800) { return; } //if mobile ignore
        $(this).children("ul").hide("slow");
    })

    //For mobile, because hover isnt there, it's replaced by clicks/taps
    $("#ID_DropDownLabel").click(function () {
        if ($(window).width() <= 800) {
            $("#ID_DropDownLabel").next("ul").toggle("slow");
        }
    })

    //selection
    $("#ID_DropDownMenu_Container ul li").click(function () {
        //Reflect on the header label
        $("#ID_DropDownLabel span").html("Category: " + $(this).text());

        //Hide all first
        $("section.Cls_ShowAllMercs, section.Cls_ShowAllCarsList").hide();
        //Show only the required
        $("section." + $(this).attr("class")).css("visibility", "initial").show("slow");

        //hide the drop down menu
        $("#ID_DropDownMenu_Container").children("ul").hide("slow");
    })


    /*---------------------------------------------------HOVER EFFECT ON CARS------------------------------------------*/



    /*SHOW INFORMATION ON HOVER EFFECT WHEN BROWSING CARS*/

    $(".Cls_Vehicles").mouseenter(function () {

        let $Hovered = $(this);

        //First hide all possibly open more texts and remove shadow class
        $(".Cls_MoreText, section.Cls_ShowAllCarsList").hide();
        $(".Cls_Vehicles").removeClass("shadow");

        //Then just open the hovered one, and add shadow
        $Hovered.addClass("shadow");
        $Hovered.children("div").children(".Cls_MoreText").stop().finish().show("slow"); //Stop & finish prevents bouncing off the mouse 

    })





    /*-----------------------CONVENIENCE PREV & NEXT NAVIGATION BUTTONS AT PAGE BOTTOM------------------------------*/





    //CONVENIENCE PREV & NEXT NAVIGATION BUTTONS AT THE BOTTOM
    //NEXT HOVER
    $("#ID_NextCategory").hover(function () {

        //Dertemine the next caption
        switch ($("#ID_DropDownLabel span").html()) {
            case "Category: All Mercs": $("#ID_NextCategory").children("span").html("Year 2021"); break; //just go to 2021
            case "Category: Year 2021": $("#ID_NextCategory").children("span").html("Year 2020"); break;
            case "Category: Year 2020": $("#ID_NextCategory").children("span").html("Year 2019"); break;
            case "Category: Year 2019": $("#ID_NextCategory").children("span").html("List all cars"); break;
            case "Category: List all cars": $("#ID_NextCategory").children("span").html("Catalogue end"); break;
        }

        //Caption animation classes on hover and out of hover
        $("#ID_NextCategory").children("span").addClass("Cls_ShowNext"); //on hover
    }, function () {
        $("#ID_NextCategory").children("span").removeClass("Cls_ShowNext"); //out of hover
    });



    //CLICK On NEXT
    $("#ID_NextCategory").click(function () {

        let VehicleClass = "";

        switch ($("#ID_DropDownLabel span").html()) {
            case "Category: All Mercs": VehicleClass = "Cls_ShowYear2021"; break; //just go to 2021
            case "Category: Year 2021": VehicleClass = "Cls_ShowYear2020"; break;
            case "Category: Year 2020": VehicleClass = "Cls_ShowYear2019"; break;
            case "Category: Year 2019": VehicleClass = "Cls_ShowAllCarsList"; break;
            case "Category: List all cars": 0 + 0; return; break; //my sort of do nothing, nowhere to navigate to
            default: return; break; //Do nothing unwanted, just leave
        };

        //Reflect on the header label
        $("#ID_DropDownLabel span").html("Category: " + $("#ID_NextCategory").children("span").html());

        //a) Before changing displayed elements, set the screem min height so that it's smooth and less up and down of display
        $("#ID_CatalogueContainer").css("min-height", ($("#ID_CatalogueContainer").outerHeight())); //take height of current display and set it as min-height

        //Hide all first
        $("section.Cls_ShowAllMercs, section.Cls_ShowAllCarsList").hide();
        //Show only the required
        $("section." + VehicleClass).css("visibility", "initial").show("slow");

        //b) Resize container and scroll to top
        Fcn_ScrollAndResize();
    })




    //HOVER ON PREVIOUS
    $("#ID_PrevCategory").hover(function () {

        //Dertemine the next caption
        // alert($("#ID_DropDownLabel span").html());

        switch ($("#ID_DropDownLabel span").html()) {
            case "Category: Year 2021": $("#ID_PrevCategory").children("span").html("Catalogue end"); break;
            case "Category: Year 2020": $("#ID_PrevCategory").children("span").html("Year 2021"); break;
            case "Category: Year 2019": $("#ID_PrevCategory").children("span").html("Year 2020"); break;
            case "Category: List all cars": $("#ID_PrevCategory").children("span").html("Year 2019"); break;
            case "Category: All Mercs": $("#ID_PrevCategory").children("span").html("Year 2021"); break; //just go to 2021
        }

        //Caption animation classes on hover and out of hover
        $("#ID_PrevCategory").children("span").addClass("Cls_ShowPrev"); //on hover
    }, function () {
        $("#ID_PrevCategory").children("span").removeClass("Cls_ShowPrev"); //out of hover
    })




    //CLICK On PREVIOUS
    $("#ID_PrevCategory").click(function () {

        let VehicleClass = "";

        switch ($("#ID_DropDownLabel span").html()) {
            case "Category: Year 2021": 0 + 0; return; break; //my sort of do nothing, nowhere to navigate to
            case "Category: Year 2020": VehicleClass = "Cls_ShowYear2021"; break;
            case "Category: Year 2019": VehicleClass = "Cls_ShowYear2020"; break;
            case "Category: List all cars": VehicleClass = "Cls_ShowYear2019"; break;
            case "Category: All Mercs": VehicleClass = "Cls_ShowYear2021"; break; //just go to 2021
            default: return; break; //Do nothing unwanted, just leave
        }

        //Reflect on the header label
        $("#ID_DropDownLabel span").html("Category: " + $("#ID_PrevCategory").children("span").html());

        //a) Before changing displayed elements, set the screem min height so that it's smooth and less up and down of display
        $("#ID_CatalogueContainer").css("min-height", ($("#ID_CatalogueContainer").outerHeight())); //take height of current display and set it as min-height


        //Hide all first
        $("section.Cls_ShowAllMercs, section.Cls_ShowAllCarsList").hide();
        //Show only the required
        $("section." + VehicleClass).css("visibility", "initial").show("slow");

        //b) Resize container and scroll to top
        Fcn_ScrollAndResize();
    })


    //b) Scroll Up into view and Resize container afterwards
    function Fcn_ScrollAndResize() {
        //Animate window scrol to top, delay with an interval to allow contents to load, then scroll up
        let ScrollPageToHeading = setInterval(function () {
            clearInterval(ScrollPageToHeading); //clear the interval itself same moment it triggers, no waiting for after animation ends
            $("html, body").animate({
                scrollTop: $("#ID_DropDownMenu_Container").offset().top - 100 //to cater for 80px of nav bar height
            }, 800, function () {
                $("#ID_CatalogueContainer").css("min-height", "150vh");//Resize catalogue container back to standard to to fit filtered contents 
            });
        }, 300)
    }






    /*--------------------------------------QUICK ADD TO CART BUTTONS--------------------------------------*/


    //1) QUICK ADD TO CART BUTTONS
    $("button.Fcn_QuickAddToCart").click(function () {
        Fcn_QuickAddToCart(this);
    })


    //2) FUNCTION: QUICK ADD TO CART
    function Fcn_QuickAddToCart($Button_Of_Clicked_Car) {



        let SelectedCarID = $($Button_Of_Clicked_Car).parents(".Cls_Vehicles").attr("id"); //Get matching ID of Selected Clicked Car

        //Add to local storage, (Cart) 
        //CarID:quantity,coupon,delivery,Delivery option, orderStatus
        localStorage.setItem(SelectedCarID, JSON.stringify(new CartObjectConstructor(SelectedCarID, MercsMap.get(SelectedCarID).color)));

        //VISUALLY INDICATE IF THAT CAR IS (NOW) IN CART
        $($Button_Of_Clicked_Car).parents(".Cls_Vehicles").find(".Cls_IsVehicleInCart").removeClass("Cls_VehicleAddedToCart").addClass("Cls_VehicleAddedToCart");

        /*NOW SYNC ALL UPDATES:
         1) THE TOTAL & QUANTITY IN CART - into sessionStorage's "cartTotal" & cartQuantity
         2) CART NAV MENU's text, to reflect how many items now in cart 
         3) PROGRESS TICK - to reflect this Progress of adding an item to cart from catalogue has been completed
        */
        Fcn_SyncCart();

        //NOTIFY THE USER OF THE TOTAL AND SUCCESSFUL ADDITION TO CART
        if ($(window).width() <= 800) { //Mobile display
            alert(`Vehicle successfully added to your Cart:

Vehicle:    ${MercsMap.get(SelectedCarID).year} ${MercsMap.get(SelectedCarID).name} ${MercsMap.get(SelectedCarID).model}
Price:        ${Fcn_FormartToCurrency(MercsMap.get(SelectedCarID).price)}
Quantity:  x${JSON.parse(localStorage.getItem(SelectedCarID)).quantity}
color:        ${JSON.parse(localStorage.getItem(SelectedCarID)).color} (Change under More Details.)
---------------------------------------------------
Cars in your Cart:   ${sessionStorage.getItem("cartQuantity")}
Your Cart's Total:    ${Fcn_FormartToCurrency(sessionStorage.getItem("cartTotal"))}  (incl vat: @15%)`)
        } else { //Desktop display

            alert(`Vehicle successfully added to your Cart:

    Vehicle:    ${MercsMap.get(SelectedCarID).year} ${MercsMap.get(SelectedCarID).name} ${MercsMap.get(SelectedCarID).model}
    Price:        ${Fcn_FormartToCurrency(MercsMap.get(SelectedCarID).price)}
    Quantity:  x${JSON.parse(localStorage.getItem(SelectedCarID)).quantity}
    color:        ${JSON.parse(localStorage.getItem(SelectedCarID)).color} (you can change under More Details.)
    ---------------------------------------------------
    Cars in your Cart:   ${sessionStorage.getItem("cartQuantity")}
    Your Cart's Total:    ${Fcn_FormartToCurrency(sessionStorage.getItem("cartTotal"))}  (incl vat: @15%)`)
        }


    }


    //3) Object constructor for Quick-Add-To-Cart
    function CartObjectConstructor(carid, color) {
        //No need to save all the car's details in local storage, the CarID is enough as ref and allows us to always read car details from MercsMap e.g. price  in case the local storage info is outdated
        this.carid = carid,
            this.color = (carid in localStorage) ? JSON.parse(localStorage.getItem(carid)).color : color // check if already chosen from details page.
        this.quantity = (carid in localStorage) ? Number(JSON.parse(localStorage.getItem(carid)).quantity) + 1 : 1 // check if already in cart, coz if user clicks quick-add-to-cart more than once, we add onto existing quantity

        // Since the following 4 are set the same for all cart items , check if previous cart items (if any) have anything set and use that, otherwise assign default values    
        this.coupontype = (localStorage.length > 0) ? JSON.parse(localStorage.getItem(localStorage.key(0))).coupontype : "none"
        this.couponvalue = (localStorage.length > 0) ? 0 : 0 //we just create and initialise with 0, even at future times, coz Sync will soon just give it (back) it's appropriate value from coupon type
        this.delivery = (localStorage.length > 0 && JSON.parse(localStorage.getItem(localStorage.key(0))).delivery != "Not selected") ? JSON.parse(localStorage.getItem(localStorage.key(0))).delivery : "Not selected"
        this.deliveryoption = (localStorage.length > 0 && JSON.parse(localStorage.getItem(localStorage.key(0))).deliveryoption != "Not selected") ? JSON.parse(localStorage.getItem(localStorage.key(0))).deliveryoption : "Not selected" // Delivery option details will be added later on shipping page
        this.purchaserdetails = (localStorage.length > 0 && JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails != "Not provided") ? JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails : "Not provided" // This will be a an object with fullname, phone, email, address, notes 
        this.orderrefnumber = "Pending"; //generated at the end, at confirmation of order
        this.orderStatus = "Pending"; //Will be changed when order is completed and finalised. 
    }


    /*--------------------------------------MORE DETAILS BUTTON & HOVER TABLE CLICK--------------------------------------------*/

    //MORE DETAILS BUTTON
    $("button.Fcn_MoreDetails").click(function () {
        //indicate which car to view in product details page
        Fcn_OpenMoreDetails($(this).parents(".Cls_Vehicles").attr("id")); //Get matching ID of Selected Clicked Car
    })

    //HOVER TABLE CLICK
    $(".Cls_TableListedCar_Row").click(function () {
        //indicate which car to view in product details page
        Fcn_OpenMoreDetails($(this).children(".Cls_CarID").text()); //Get matching ID of Selected Clicked Car
    })


    //Function to open product details page
    function Fcn_OpenMoreDetails(SelectedCarID) {
        //Send ID to session storage so that product page knows which car to display about
        sessionStorage.setItem("SelectedCarID", SelectedCarID);
        sessionStorage.setItem("CallingPage", "Catalogue.html"); //tell the productview page who called, and return back to who called
        sessionStorage.setItem("ReturnToCatalogueDisplay", $("#ID_DropDownLabel span").html());  //When user returns from the called product view, this tells "here is where we were"

        //Open product's page
        location.href = 'ProductView.html';
    }


})