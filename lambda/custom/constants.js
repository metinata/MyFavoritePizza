const constants = {
    PATHS: {
        LOGIN: "https://token.yemeksepeti.com/OpenAuthentication/OAuthService.svc/Login",
        GET_USER_ADDRESS: "https://api.yemeksepeti.com/YS.Webservices/UserService.svc/GetUserAdresses",
        MIGRATE_BASKET: "https://api.yemeksepeti.com/YS.WebServices/OrderService.svc/MigrateBasket",
        RESTAURANT_SEARCH: "https://search.yemeksepeti.com/SearchService.svc/JSON/Search",
        GET_PRODUCT_DETAILS: "https://api.yemeksepeti.com/YS.WebServices/CatalogService.svc/GetProductDetails",
        ADD_PRODUCT_TO_BASKET: "https://api.yemeksepeti.com/YS.WebServices/OrderService.svc/AddProduct",
        GET_RESTAURANT_PAYMENT_METHODS: "https://api.yemeksepeti.com/YS.WebServices/CatalogService.svc/GetRestaurantPaymentMethods",
        GET_USER_ADDRESS_FOR_CHECKOUT: "https://api.yemeksepeti.com/YS.WebServices/OrderService.svc/GetUserAdressForCheckout",
        CHECKOUT: "https://api.yemeksepeti.com/YS.WebServices/OrderService.svc/Checkout"
    },
    CREDENTIALS: {
        USERNAME: "###YEMEKSEPETI_USERNAME###",
        PASSWORD: "###YEMEKSEPETI_PASSWORD###"
    },
    KEYS: {
        API_KEY: "###YEMEKSEPETI_MOBILE_API_KEY###",
        CULTURE: "tr-TR",
        LANGUAGE_ID: "tr-TR",
        CATALOG_NAME: "TR_ISTANBUL",
        CHANNEL_NAME: "IphoneS",
        SEARCH_TEXT: "pizza",
        RESTAURANT_NAME: "###RESTAURANT_NAME###",
        PRODUCT_NAME: "###PRODUCT_NAME###",
        PRODUCT_QUANTITY: 1,
        INGREDIENT: "malzeme",
        PINEAPPLE: "Ananas",
        ADDRESSES: {
            HOME: "Ev",
            WORK: "İş"
        },
        PAYMENT_METHODS: {
            ONLINE: "Online Kredi/Banka Kartı",
            CASH: "Nakit",
            CREDIT_CARD: "Kredi Kartı"
        }
    }
};

module.exports = constants;
