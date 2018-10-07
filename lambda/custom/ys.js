const axios = require("axios");
const uuidv4 = require('uuid/v4');
const constants = require("./constants");

class YemekSepeti {

    constructor(api_key, username, password) {
        this.api_key = api_key;
        this.username = username;
        this.password = password;
        this.token = null;
        this.token2 = null;
        this.userId = null;
        this.basketId = null;
        this.restaurant = null;
        this.categoryName = null;
        this.productId = null;
        this.selectedItems = [];
        this.paymentMethodId = null;
        this.areaId = null;
        this.addressId = null;
    }

    async login() {

        const requestData = {
            apiKey: this.api_key,
            userName: this.username,
            password: this.password,
            culture: constants.KEYS.CULTURE
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.LOGIN,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            const [token, token2] = response.data.d.Result.TokenList;
            const userId = response.data.d.Result.UserId;

            this.token = token.TokenId;
            this.token2 = token2.TokenId;
            this.userId = userId;
        }
        catch (error) {
            throw error;
        }
    }

    async getUserAddress() {

        const requestData = {
            ysRequest: {
                ApiKey: this.api_key,
                Token: this.token,
                CatalogName: constants.KEYS.CATALOG_NAME,
                Culture: constants.KEYS.CULTURE,
                PageRowCount: 0,
                LanguageId: constants.KEYS.CULTURE,
                PageNumber: 0
            }
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.GET_USER_ADDRESS,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            const { d: { ResultSet } } = response.data;

            if (!ResultSet) {
                throw new Error("An error occurred while gettings user address");
            }

            const address = ResultSet.find((address) => address.AddressName === constants.KEYS.ADDRESSES.HOME);

            if (!address) {
                throw new Error("Address for home couldn't be found");
            }

            this.areaId = address.RegionId;
        }
        catch (error) {
            throw error;
        }
    }

    async migrateBasket() {

        const requestData = {
            anonymousUserId: `{${uuidv4()}}`,
            ysRequest: {
                ApiKey: this.api_key,
                Token: this.token,
                CatalogName: constants.KEYS.CATALOG_NAME,
                Culture: constants.KEYS.CULTURE,
                PageRowCount: 0,
                LanguageId: constants.KEYS.LANGUAGE_ID,
                PageNumber: 0
            },
            anonymousbasketId: `${uuidv4()}`
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.MIGRATE_BASKET,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            this.basketId = response.data.d.ResultSet.BasketId;
        }
        catch (error) {
            throw error;
        }
    }

    async getRestaurant() {

        const requestData = {
            SearchText: constants.KEYS.SEARCH_TEXT,
            ysRequest: {
                ApiKey: this.api_key,
                Token: this.token,
                CatalogName: constants.KEYS.CATALOG_NAME,
                Culture: constants.KEYS.CULTURE,
            },
            AreaId: this.areaId,
            CatalogName: constants.KEYS.CATALOG_NAME,
            LanguageId: constants.KEYS.CULTURE,
            ChannelName: constants.KEYS.CHANNEL_NAME
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.RESTAURANT_SEARCH,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            const restaurant = response.data.RestaurantList.find((restaurant) => restaurant.RestaurantName === constants.KEYS.RESTAURANT_NAME);

            if (!restaurant || !restaurant.RestaurantIsOpen) {
                throw new Error("Restaurant is not available at the moment");
            }

            this.restaurant = restaurant;
            this.categoryName = restaurant.RestaurantCategoryName;

            const product = restaurant.ProductList.find((product) => product.ProductName === constants.KEYS.PRODUCT_NAME);

            if (!product) {
                throw new Error("Product was not found");
            }

            this.productId = product.ProductId;
        }
        catch (error) {
            throw error;
        }
    }

    async getProductDetails() {

        const requestData = {
            selectedItems: [],
            productId: this.productId,
            quantity: 1,
            ysRequest: {
                ApiKey: this.api_key,
                Token: this.token,
                CatalogName: constants.KEYS.CATALOG_NAME,
                Culture: constants.KEYS.CULTURE,
                PageRowCount: 0,
                LanguageId: constants.KEYS.CULTURE,
                PageNumber: 0
            },
            categoryName: this.categoryName
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.GET_PRODUCT_DETAILS,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            const { d: { ResultSet } } = response.data;

            const items = ResultSet.Options.find((item) => item.Id != constants.KEYS.INGREDIENT);

            if (!items) {
                throw new Error("Extra stuff items couldn't be found");
            }

            const extraStuff = items.Items.find((item) => item.Name === constants.KEYS.PINEAPPLE);

            if (!extraStuff) {
                throw new Error("Extra stuff couldn't be found");
            }

            const item = {
                key: items.Id,
                value: extraStuff.Id
            };

            this.selectedItems.push(item);
        }
        catch (error) {
            throw error;
        }
    }

    async getRestaurantPaymentMethods() {

        const requestData = {
            categoryName: this.categoryName,
            ysRequest: {
                ApiKey: this.api_key,
                Token: this.token,
                CatalogName: constants.KEYS.CATALOG_NAME,
                Culture: constants.KEYS.CULTURE,
                PageRowCount: 0,
                LanguageId: constants.KEYS.CULTURE,
                PageNumber: 0
            }
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.GET_RESTAURANT_PAYMENT_METHODS,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            const { d: { ResultSet } } = response.data;

            if (!ResultSet) {
                throw new Error("An error occurred while getting the restaurant payment methods");
            }

            const paymentMethod = ResultSet.find((paymentMethod) => paymentMethod.PaymentMethodText === constants.KEYS.PAYMENT_METHODS.CREDIT_CARD);

            if (!paymentMethod) {
                throw new Error("Payment method couldn't be found");
            }

            this.paymentMethodId = paymentMethod.PaymentMethodId;
        }
        catch (error) {
            throw error;
        }
    }

    async addProductToBasket() {

        const requestData = {
            productId: this.productId,
            catalogName: constants.KEYS.CATALOG_NAME,
            selectedItems: this.selectedItems,
            quantity: constants.KEYS.PRODUCT_QUANTITY,
            ysRequest: {
                ApiKey: this.api_key,
                Token: this.token,
                CatalogName: constants.KEYS.CATALOG_NAME,
                Culture: constants.KEYS.CULTURE,
                PageRowCount: 0,
                LanguageId: constants.KEYS.CULTURE,
                PageNumber: 0
            },
            basketId: this.basketId,
            categoryName: this.categoryName
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.ADD_PRODUCT_TO_BASKET,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            const { d: { Success } } = response.data;

            if (!Success) {
                throw new Error("An error occurred while adding the product to the basket");
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getUserAddressForCheckout() {

        const requestData = {
            categoryName: this.categoryName,
            ysRequest: {
                ApiKey: this.api_key,
                Token: this.token,
                CatalogName: constants.KEYS.CATALOG_NAME,
                Culture: constants.KEYS.CULTURE,
                PageRowCount: 0,
                LanguageId: constants.KEYS.CULTURE,
                PageNumber: 0
            },
            currentAreaId: this.areaId
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.GET_USER_ADDRESS_FOR_CHECKOUT,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            const { d: { ResultSet } } = response.data;

            if (!ResultSet) {
                throw new Error("An error occurred while gettings user address for checkout");
            }

            const address = ResultSet.find((address) => address.AddressName === constants.KEYS.ADDRESSES.HOME);

            if (!address) {
                throw new Error("Address for home couldn't be found");
            }

            this.addressId = address.AddressId;
        }
        catch (error) {
            throw error;
        }
    }

    async checkout() {

        const requestData = {
            ysRequest: {
                ApiKey: this.api_key,
                Token: this.token,
                CatalogName: constants.KEYS.CATALOG_NAME,
                Culture: constants.KEYS.CULTURE,
                PageRowCount: 0,
                LanguageId: constants.KEYS.CULTURE,
                PageNumber: 0
            },
            checkoutParameters: {
                IsFutureOrder: false,
                PaymentMethodId: this.paymentMethodId,
                GiftId: "",
                UsePoints: false,
                BasketId: this.basketId,
                IsCheckoutStep: true,
                DvdIds: [],
                Note: "",
                AddressId: this.addressId,
                SaveGreen: false,
                OrderDateTime: "",
                IsCampus: false,
                IsTakeAway: false
            }
        };

        try {
            const response = await axios({
                method: "post",
                url: constants.PATHS.CHECKOUT,
                data: requestData,
                headers: {
                    "User-Agent": ""
                }
            });

            const { d: { Success } } = response.data;

            if (!Success) {
                throw new Error("An error occurred during the checkout process");
            }
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = YemekSepeti;