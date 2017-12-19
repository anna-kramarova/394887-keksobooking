'use strict';

// ГЕНЕРАЦИЯ МАССИВА СЛУЧАЙНЫХ ПРЕДЛОЖЕНИЙ

(function () {

  // Константы предложений
  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  // var OFFER_TYPES = ['flat', 'house', 'bungalo']; // не убирать!
  var OFFER_CHECK = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFERS_COUNT = 8;

  var OFFER_PRICE_MIN = 1000;
  var OFFER_PRICE_MAX = 1000000;

  var OFFER_ROOMS_MIN = 1;
  var OFFER_ROOMS_MAX = 5;

  var OFFER_GUESTS_MIN = 1;
  var OFFER_GUESTS_MAX = 10;

  var PIN_LOCATION_X_MIN = 300;
  var PIN_LOCATION_X_MAX = 900;

  var PIN_LOCATION_Y_MIN = 100;
  var PIN_LOCATION_Y_MAX = 500;

  // Функция получения типа предложения
  var getOfferType = function (offerTitle) {
    var offerType;
    if (offerTitle === 'Большая уютная квартира' || offerTitle === 'Маленькая неуютная квартира') {
      offerType = 'flat';
    } else if (offerTitle === 'Уютное бунгало далеко от моря' || offerTitle === 'Неуютное бунгало по колено в воде') {
      offerType = 'bungalo';
    } else {
      offerType = 'house';
    }
    return offerType;
  };


  // Функция создания случайных предложений и их записи в массив
  var getAllOffers = function () {
    var allOffers = [];
    var randomTitles = window.util.getUnicElementsArray(OFFER_TITLES, false);

    for (var i = 0; i < OFFERS_COUNT; i++) {

      var arrayObject = {};
      var randomLocationX = window.util.getRandomInt(PIN_LOCATION_X_MIN, PIN_LOCATION_X_MAX);
      var randomLocationY = window.util.getRandomInt(PIN_LOCATION_Y_MIN, PIN_LOCATION_Y_MAX);
      var randomCheckInOut = window.util.getRandomArrayElement(OFFER_CHECK);

      // Случайный аватар автора предложения
      var randomAvatar = {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      };

      // Случайное предложение
      var randomOffer = {
        title: randomTitles[i],
        address: randomLocationX + ', ' + randomLocationY,
        price: window.util.getRandomInt(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
        type: getOfferType(randomTitles[i]), // window.util.getRandomArrayElement(OFFER_TYPES),
        rooms: window.util.getRandomInt(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        guests: window.util.getRandomInt(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
        checkin: randomCheckInOut,
        checkout: randomCheckInOut,
        features: window.util.getUnicElementsArray(OFFER_FEATURES, true),
        description: '',
        photos: []
      };

      // Случайные координаты предложения
      var randomLocation = {
        x: randomLocationX,
        y: randomLocationY
      };

      // Запись случайных свойств в свойства элемента массива
      arrayObject.author = randomAvatar;
      arrayObject.offer = randomOffer;
      arrayObject.location = randomLocation;

      allOffers[i] = arrayObject;
    }

    return allOffers;
  };


  // Запись в глобальную область видимости
  window.data = {

    // Функция получения массива случайных предложений для отрисовки меток и карточек (map.js)
    getAllOffers: getAllOffers

  };

})();
