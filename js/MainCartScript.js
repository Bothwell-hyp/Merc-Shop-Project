
window.name = "Merc-Shop";

/*-------------------- GLOBAL DECLARATIONS: MAPS SERVING AS DATABASE OF CARS & FEES ---------------------------------*/
//Declared these here outside of $(function(){} so that they can be globally accessible in other pages


let MercsMap = new Map();   //ACTS AS DATABASE OF CARS:
let OrderProgressCompleted = false;   // only set true when order is submitted
let ShippingRatesMap = new Map();    //Map with delievery fees and coupon(s) amounts
let CouponsMap = new Map();    //Map with delievery fees and coupon(s) amounts




/*-------------------------------------- GLOBAL: FORMAT CURRENCY FOR CODE READABILITY--------------------------------------*/
//a) the line of code to formart currency is too long for redability, so this function is to shorten

function Fcn_FormartToCurrency(ThePrice) {
    return new Intl.NumberFormat('za-ZA', { style: 'currency', currency: 'ZAR' }).format(ThePrice);
}





/*-------------------------------------- GLOBAL: SYNC THE CART TOTALS AND CART PROGRESS--------------------------------------*/
//Total quantity in cart
//Total cost in cart vat incl/excl

//b)  SYNC THE COST & QUANTITY IN CART, NAV MENU TEXT, AND PROGRESS TICK ICONS
function Fcn_SyncCart() {


    //Welcome users once per session
    if (!("NB" in sessionStorage)) {
        setTimeout(() => {
            alert("Hello, I'm Bothwell, Derrick." +
                "\nThis website is a college project I did recently in my Web Development studies, so it's not actually selling you any cheap cars on Catalogue page, nor will any interactions or text you enter go anywhere." +
                "\nIt's all demo functionaliies that I made. \n \nThanks for stopping by! \nYou can say hi @ bothwell.hyp@gmail.com")
        }, 1000);
        sessionStorage.setItem("NB", "Displayed");
    }



    if (localStorage.length > 0) {

        //1. SYNC TOTAL CART - price of car(s)
        let cartTotal = 0;
        let cartQuantity = 0;

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            cartTotal = cartTotal + (Number(JSON.parse(localStorage.getItem(key)).quantity) * Number(MercsMap.get(key).price)); // Quantity * current database price, in case we adjust price for something in cart
            cartQuantity = cartQuantity + Number(JSON.parse(localStorage.getItem(key)).quantity);
        }

        //2. Add delivery if already set
        let ToDeliverOrCollect = JSON.parse(localStorage.getItem(localStorage.key(0))).delivery;
        if (ToDeliverOrCollect == "Delivery") {
            let deliveryOption = JSON.parse(localStorage.getItem(localStorage.key(0))).deliveryoption;
            cartTotal = cartTotal + (Number(ShippingRatesMap.get(deliveryOption)) * cartQuantity); //shipping cost is per each vehicle in cart
        }

        //3. Once we have Total of Price and Shipping, deduct coupon of each vehicle+shipping if given, from the total
        if (JSON.parse(localStorage.getItem(localStorage.key(0))).coupontype != "none") {
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                let CartItem = JSON.parse(localStorage.getItem(key)); //Get current cart entry as it is
                CartItem.couponvalue = ((Number(MercsMap.get(key).price) * Number(CartItem.quantity)) + (Number(ShippingRatesMap.get(CartItem.deliveryoption)) * Number(CartItem.quantity))) * Number(CouponsMap.get(CartItem.coupontype));
                cartTotal = Number(cartTotal) - Number(CartItem.couponvalue);

                localStorage.setItem(CartItem.carid, JSON.stringify(CartItem)); //update the respective values in cart/local storage
                sessionStorage.setItem("CouponApplied", `${Number(CouponsMap.get(CartItem.coupontype)) * 100}% ${CartItem.coupontype}`)
            }
        }


        //3.1 Update session storage 
        sessionStorage.setItem("cartTotalBeforeVAT", cartTotal); //total costs before vat
        sessionStorage.setItem("cartQuantity", cartQuantity); //total quantity in cart


        //4. Add VAT after coupon discount - according to: https://www.zoho.com/ae/books/vat/faq/supply-vat/vat-with-discounts.html
        cartTotal += (cartTotal *= 0.15);

        //4.1 Update session storage
        sessionStorage.setItem("cartTotal", cartTotal); //Main total, inclusive of Vat


        //4.2 UPDATE THE "CART" NAV MENU's text upon syncing here, of any cart additions or removals
        $("#ID_CartMenu span").html("CART " + sessionStorage.getItem("cartQuantity"));

    }
    else { //nothing in Cart yet
        sessionStorage.setItem("cartTotal", 0);
        sessionStorage.setItem("cartQuantity", 0);
        $("#ID_CartMenu span").html("CART " + 0);
    }


    // CALL TO SYNC CART PROGRESS THIS AFTER
    Fcn_SyncProgress()
}





/*-------------------------------------- GLOBAL: SYNC THE CART PROGRESS---------------------------------------------*/
//Progress of making one's order, from (a) adding to cart (b) shipping details (c) placing order - all reflected on nav ticks

//SYNC PROGRESS
function Fcn_SyncProgress() {

    if (localStorage.length > 0) {

        //CATALOGUE PAGE: Adding items to the cart 
        $(".Cls_CatalogueProgressIcon").addClass("ProgressDone");

        //2. SHIPPING PAGE: providing shipping options and details
        let deliveryORcollection = JSON.parse(localStorage.getItem(localStorage.key(0))).delivery;
        let deliveryOption = JSON.parse(localStorage.getItem(localStorage.key(0))).deliveryoption;
        let purchaserDetails = JSON.parse(localStorage.getItem(localStorage.key(0))).purchaserdetails;

        if ((deliveryORcollection != "Not selected") && (deliveryOption != "Not selected") && (purchaserDetails != "Not provided")) {
            $(".Cls_ShippingProgressIcon").addClass("ProgressDone");
        } else {
            $(".Cls_ShippingProgressIcon").removeClass("ProgressDone"); //in case previously set but then were changed/deleted
        }

        //3. CART PAGE: order confirmed and submitted
        //happens via OrderProgressCompleted here below

    } else if (OrderProgressCompleted == true) {
        /*NB: The moment after an order has just been submitted, 
        even though cart and shipping have been cleared, at that 
        temporary moment, soon after submitting, indicates/is a 
        progress successful moment. This will soon be reset by 
        page refresh/change page*/
        $(".Cls_CatalogueProgressIcon").addClass("ProgressDone");
        $(".Cls_ShippingProgressIcon").addClass("ProgressDone");
        $(".Cls_OrderConfirmProgressIcon").addClass("ProgressDone");
        OrderProgressCompleted = false;
    } else {
        $(".Cls_CatalogueProgressIcon").removeClass("ProgressDone"); //nothing in Cart
        $(".Cls_ShippingProgressIcon").removeClass("ProgressDone"); //nothing with shipping details
        $(".Cls_OrderConfirmProgressIcon").removeClass("ProgressDone"); //no order in progress/made
    }
}


/*----------------------------------- END OF GLOBAL DECLARATIONS + FUNCTIONS------------------------------------*/










$(function () {

    /*--------------------------------------INITIALISE: CREATE CAR OBJECTS INTO MAP (As database) --------------------------------------*/

    //1). INITIALISE: CREATE CAR OBJECTS, this will act as my database to make it better and easy to reference/read chosen car objects across pages
    let description = "";

    //2021 Cars
    //Car1
    description = "The iconic DNA of the G-Class was established 40 years ago, with unique design features that still define its appearance today. With an angular and robust front-end design, clear lines, round headlamps and flat surfaces that characterise the side view, the new G 400 d is robust, yet refined. The radiator trim with centrally-positioned star, exposed spare wheel on the tailgate and striking wheel arch liners are some of the striking key design features of the new model.";
    MercsMap.set("Car1", new CarObject("2021", "Mercedes-benz", "G400 D", "Black", "140000", description, "images/car1-G400-D.png", "images/car1-G400-D/", "Petrol"));
    //Ca2
    description = "The new GLC exudes even more hallmark SUV presence without being overly imposing. A symbol of modern luxury. New highlights include the front end with standard-fit LED High Performance headlamps and new-look tailpipe trims at the rear.";
    MercsMap.set("Car2", new CarObject("2021", "Mercedes-benz", "GLC63S", "Yellow", "160000", description, "images/car2-AMG-GLC63S.png", "images/car2-AMG-GLC63S/", "Diesel"));
    //Car3
    description = "The new Mercedes-AMG GLS 63 4MATIC+ is distinguishable by its hallmark design features: the signature AMG radiator grille with vertical bars, the bonnet with powerdomes, the diverse range of wheels with optionally available forged wheels up to 23 inches in size and angular twin tailpipe trim elements with characteristic ribbing emphasise the sheer strength of the new Mercedes-AMG GLS 63 4MATIC+.";
    MercsMap.set("Car3", new CarObject("2021", "Mercedes-benz", "GLS 63", "Red", "200000", description, "images/car3-AMG-GLS-63.png", "images/car3-AMG-GLS-63/", "Diesel"));

    //Car4
    description = "The C-class provides the premium feel, technology features, and classy design that you’d expect in a small Benz. The C-Class stands as one of the most affordable luxury options in the segment. While the C300 Coupe and Sedan are among the cheapest of all Mercedes-Benz models, going for the Cabriolet or any AMG trim level can potentially more than double the cost of its cheaper siblings.";
    MercsMap.set("Car4", new CarObject("2021", "Mercedes-benz", "C300", "White", "150000", description, "images/car4-C300.png", "images/car4-C300/", "Petrol"));

    //2020 Cars
    //Car5
    description = "The Mercedes-AMG GT Coupé is a breathtaking Gran Turismo with AMG 4.0-litre V8 biturbo engine that only its GT sibling can surpass: the AMG GT R take AMG Driving Performance to a new level. dynamically distinctive in appearance, extremely sporty and sophisticated in the cockpit.";
    MercsMap.set("Car5", new CarObject("2020", "Mercedes-benz", "GT", "Yellow", "250000", description, "images/car5-GT.png", "images/car5-GT/", "Petrol"));
    //Car6
    description = "The shape of success. In a whole new dimension. More intelligent and attentive than ever - the new GLE casts the SUV in a whole new light. The GLE can provide you with tangible support and protection, thanks to the available driving assistance and safety systems.";
    MercsMap.set("Car6", new CarObject("2020", "Mercedes-benz", "GLE 63", "White", "190000", description, "images/car6-GLE-63.png", "images/car6-GLE-63/", "Diesel"));
    //Car7
    description = "Year after year, the E-Class Sedan advances countless standards for all cars to follow, from safety to luxury to driver assists. Advanced in style and user-friendly innovations, it previews a future you can enjoy today. The E-Class is available with four Powertrain options and a 4MATIC all-wheel drive.";
    MercsMap.set("Car7", new CarObject("2020", "Mercedes-benz", "E 350", "Black", "200000", description, "images/car7-E-350.png", "images/car7-E-350/", "Petrol"));
    //Car8
    description = "Extremely capable and well-built, making it one of the highest-ranked work vans in its class. It has a high roof option that expands the interior height to 6 feet 6 inches, which means most people can stand upright inside. It also offers more interior options and standard features than most other vans, including optional heated front seats, front and rear parking sensors.";
    MercsMap.set("Car8", new CarObject("2020", "Mercedes-benz", "Sprinter", "Black", "300000", description, "images/car8-Sprinter.png", "images/car8-Sprinter/", "Diesel"));

    //2019 Cars
    //Car9
    description = "An upmarket diesel Benz ML, generation three of the big US-built SUV. It's new from the wheels up with more kit, more room, better drive feel, luxury - everything. Similar luxury feel as big S-Class and E-Class Benz sedans. Minimal noise, vibration, harshness. Plenty of luxury kit, killer audio, leather, electric assistance left, right and centre, clever lighting package, rake adjust rear seats, big multi-media screen";
    MercsMap.set("Car9", new CarObject("2019", "Mercedes-benz", "ML 350", "Blue", "185000", description, "images/car9-ML-350.png", "images/car9-ML-350/", "Diesel"));
    //Car10
    description = "One of the most elegant cabins in the luxury small car class, marked by premium materials and nearly all of the infotainment and safety features you could think of. The C-Class also delivers a soft and pampering ride quality. ";
    MercsMap.set("Car10", new CarObject("2019", "Mercedes-benz", "C300 coupe", "Blue", "165000", description, "images/car10-C300-coupe.png", "images/car10-C300-coupe/", "Petrol"));
    //Car11
    description = "With Intelligent Driving Assistance Systems, The New Gls Is The Perfect Fit For You. A Full-Blown Suv Down To The Finest Details. Climb Aboard And Revel In Modern Luxury. The Best Or Nothing. Genuine Parts. Explore The Best. Genuine Accessories.";
    MercsMap.set("Car11", new CarObject("2019", "Mercedes-benz", "GL 350", "White", "265000", description, "images/car11-GL-350.png", "images/car11-GL-350/", "Diesel"));
    //Car12
    description = "The Mercedes-Benz Maybech ranks at the top of the super luxury car class, thanks to its spacious interior, exceptional materials, wealth of tech and safety features, refined powertrain, and relaxing ride quality.";
    MercsMap.set("Car12", new CarObject("2019", "Mercedes-benz", "Maybech S650", "Black", "440000", description, "images/car12-Maybech-S650.png", "images/car12-Maybech-S650/", "Diesel"));





    //CAR OBJECT's CONSTRUCTOR
    function CarObject(year, name, model, color, price, description, image, folder, engine) {
        this.year = year,
            this.name = name,
            this.model = model,
            this.color = color,
            this.price = price,
            this.description = description,
            this.image = image,
            this.folder = folder,
            this.engine = engine;
    }




    /*-----------------------------------INITIALISE: CREATE SHIPPING FEES MAP------------------------------------*/

    ShippingRatesMap.set("Premium Delivery", 12500);
    ShippingRatesMap.set("Express Delivery", 8500);
    ShippingRatesMap.set("Standard Delivery", 5500);
    ShippingRatesMap.set("Individual arrangement", 0);



    /*-------------------------------------INITIALISE: CREATE COUPONS MAP------------------------------------*/

    CouponsMap.set("none", 0);
    CouponsMap.set("checkout-promo", 0.03); //3%
    CouponsMap.set("loyalty-promo", 0.05) //5%
    CouponsMap.set("available-coupon", "checkout-promo"); //this is were we specify if there is any coupon made available to award a user or not




    /*--------------------------------------INITIALISE: CALL TO SYNCRONISE CART TOTALS & CART PROGRESS--------------------------------------*/

    Fcn_SyncCart()



})

