/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const constants = require("./constants");
const YemekSepeti = require("./ys");

let orderMyFavoritePizza = async () => {

    try {

        const api = new YemekSepeti(constants.KEYS.API_KEY, constants.CREDENTIALS.USERNAME, constants.CREDENTIALS.PASSWORD);

        await api.login();
        await api.getUserAddress();
        await api.migrateBasket();
        await api.getRestaurant();
        await api.getProductDetails();
        await api.getRestaurantPaymentMethods();
        await api.addProductToBasket();
        await api.getUserAddressForCheckout();
        await api.checkout();

        return "On the way!";
    }
    catch (error) {

        return error.message;
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const speechText = await orderMyFavoritePizza();

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Order My Favorite Pizza', speechText)
            .getResponse();
    }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler
    )
    .lambda();