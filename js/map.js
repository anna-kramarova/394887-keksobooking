'use strict';


// Массивы-константы
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_TYPES = ['flat', 'house', 'bungalo'];
var OFFER_CHECK = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFERS_COUNT = 8;

// Функция поиска случайного числа
var getRandomInt = function (min, max) {
  max = max + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

// Функция получения случайного значения массива
var getRandomFeature = function (array) {
  var randomFeature = array[getRandomInt(0, array.length - 1)];
  return randomFeature;
};

// Функция получения массива случайной длины
var getFeaturesArray = function (array) {
  var featuresArray = [];
  var featuresArrayLength = getRandomInt(1, array.length);

  for (i = 0; i <= featuresArrayLength; i++) {
    var randomFeature = getRandomFeature(array);
    featuresArray[i] = randomFeature;
  }
  return featuresArray;
}

// Функция неповторения
var getUnicObject = function(array) {

  var unicObject = {};

  for (i = 1; i <= array.length; i++) {

    var lastElement = array.length - i;
    var randomIndex = getRandomInt(0, lastElement);

    unicObject['el' + (i - 1)] = array[randomIndex];

    var usedFeature = array[randomIndex];

    swap = array[lastElement];
    array[lastElement] = usedFeature;
    array[randomIndex] = swap;
  };
  console.log(unicObject);
  return unicObject;
};


// Функция создания случайного предложения и его записи в массив
var getAllOffers = function () {
  var allOffers = [];
  var arrayObject = {};
  var unicObject = getUnicObject(OFFER_TITLES);

  for (var i = 0; i <= OFFERS_COUNT; i++) {
    // Случайная картинка
    var randomAvatar = {
      avatar: 'img/avatars/user{{0' + (i + 1) + '}}.png'
    };
    // Случайное предложение
    var randomOffer = {
      title: unicObject['el' + i], //??????
      price: getRandomInt(1000, 1000000),
      type: getRandomFeature(OFFER_TYPES),
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(1, 10),
      checkin: getRandomFeature(OFFER_CHECK),
      checkout: getRandomFeature(OFFER_CHECK),
      features: getFeaturesArray(OFFER_FEATURES),
      description: '',
      photos: []
    };
    // Случайные координаты
    var randomLocation = {
      x: getRandomInt(300, 900),
      y: getRandomInt(100, 500)
    }
    // Запись случайных свойств в свойства элемента массива

      arrayObject.author = randomAvatar;
      arrayObject.offer = randomOffer;
      arrayObject.location = randomLocation;

      allOffers[i] = arrayObject;
  }

  return allOffers;
};


/*
// Функция создания случайного предложения и его записи в массив
var getAllOffers = function () {
  var allOffers = [];

  for (var i = 0; i <= OFFERS_COUNT; i++) {
    // Случайная картинка
    var randomAvatar = {
      avatar: 'img/avatars/user{{0' + (i + 1) + '}}.png'
    };
    // Случайное предложение
    var randomOffer = {
      title: getRandomFeature(OFFER_TITLES),
      price: getRandomInt(1000, 1000000),
      type: getRandomFeature(OFFER_TYPES),
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(1, 10),
      checkin: getRandomFeature(OFFER_CHECK),
      checkout: getRandomFeature(OFFER_CHECK),
      features: getFeaturesArray(OFFER_FEATURES),
      description: '',
      photos: []
    };
    // Случайные координаты
    var randomLocation = {
      x: getRandomInt(300, 900),
      y: getRandomInt(100, 500)
    }
    // Запись случайных свойств в свойства элемента массива
    allOffers[i].author = randomAvatar;
    allOffers[i].offer = randomOffer;
    allOffers[i].location = randomLocation;
  }

  return allOffers;
};
*/
// Отображение блока
document.querySelector('.map').classList.remove('map--faded');
