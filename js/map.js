'use strict';

// Константы
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
// var OFFER_TYPES = ['flat', 'house', 'bungalo'];
var OFFER_CHECK = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFERS_COUNT = 8;
var RUBLES_SYMBOL = String.fromCharCode(8381);

var PIN_SHIFT_X = 20;
var PIN_SHIFT_Y = 40;

var PIN_LOCATION_X_MIN = 300;
var PIN_LOCATION_X_MAX = 900;

var PIN_LOCATION_Y_MIN = 100;
var PIN_LOCATION_Y_MAX = 500;

var OFFER_PRICE_MIN = 1000;
var OFFER_PRICE_MAX = 1000000;

var OFFER_ROOMS_MIN = 1;
var OFFER_ROOMS_MAX = 5;

var OFFER_GUESTS_MIN = 1;
var OFFER_GUESTS_MAX = 10;

var OFFER_TYPE_TRANSLATION = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом'
};

// Общий блок карты
var mapElement = document.querySelector('.map');
// Блок с метками
var pinsMapElement = document.querySelector('.map__pins');
// Шаблон метки
var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');
// Шаблон предложения
var offerTemplateElement = document.querySelector('template').content.querySelector('.map__card');
// Блок после блока с предложениями
var afterOffersElement = document.querySelector('.map__filters-container');


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

// Функция получения массива с уникальными элементами (случайная длина массива опционально)
var getUnicElementsArray = function (array, boolean) {
  var unicElementsArray = [];
  var unicElementsArrayLength = array.length;

  if (boolean) {
    unicElementsArrayLength = getRandomInt(1, array.length);
  }

  for (var i = 1; i <= unicElementsArrayLength; i++) {
    var lastElement = array.length - i;
    var randomIndex = getRandomInt(0, lastElement);

    unicElementsArray[i - 1] = array[randomIndex];
    var usedFeature = array[randomIndex];

    var swap = array[lastElement];
    array[lastElement] = usedFeature;
    array[randomIndex] = swap;
  }

  return unicElementsArray;
};

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

// Функция создания случайного предложения и его записи в массив
var getAllOffers = function () {
  var allOffers = [];
  var randomTitles = getUnicElementsArray(OFFER_TITLES, false);

  for (var i = 0; i < OFFERS_COUNT; i++) {

    var arrayObject = {};
    var randomLocationX = getRandomInt(PIN_LOCATION_X_MIN, PIN_LOCATION_X_MAX);
    var randomLocationY = getRandomInt(PIN_LOCATION_Y_MIN, PIN_LOCATION_Y_MAX);

    // Случайная картинка
    var randomAvatar = {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    };

    // Случайное предложение
    var randomOffer = {
      title: randomTitles[i],
      address: randomLocationX + ', ' + randomLocationY,
      price: getRandomInt(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
      type: getOfferType(randomTitles[i]), // getRandomFeature(OFFER_TYPES),
      rooms: getRandomInt(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
      guests: getRandomInt(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
      checkin: getRandomFeature(OFFER_CHECK),
      checkout: getRandomFeature(OFFER_CHECK),
      features: getUnicElementsArray(OFFER_FEATURES, true),
      description: '',
      photos: []
    };

    // Случайные координаты
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

// Массив случайных предложений
var allOffers = getAllOffers();


// Функция создания отдельного элемента метки
var renderPin = function (offer, i) {
  var pinElement = pinTemplateElement.cloneNode(true);

  pinElement.style = 'left: ' + (offer.location.x - PIN_SHIFT_X) + 'px; top: ' + (offer.location.y - PIN_SHIFT_Y) + 'px;';
  pinElement.querySelector('img').src = offer.author.avatar;
  pinElement.dataset.arrayIndex = i;

  return pinElement;
};

// Функция создания, записи элементов меток и вставки фрагмента
var renderPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < allOffers.length; i++) {
    fragment.appendChild(renderPin(allOffers[i], i));
  }
  pinsMapElement.appendChild(fragment);
};

// Функция создания списка удобств
var getFeaturesList = function (featuresArray) {
  var fragment = document.createDocumentFragment();
  var featuresListElement;
  var featuresListElementClass;

  for (var i = 0; i < featuresArray.length; i++) {
    featuresListElementClass = 'features features--' + featuresArray[i];

    featuresListElement = document.createElement('li');
    featuresListElement.className = featuresListElementClass;

    fragment.appendChild(featuresListElement);
  }
  return fragment;
};

// Функция создания отдельного элемента предложения
var renderOffer = function (arrayObject) {
  var offerElement = offerTemplateElement.cloneNode(true);

  offerElement.querySelector('h3').textContent = arrayObject.offer.title;
  offerElement.querySelector('small').textContent = arrayObject.offer.address;
  offerElement.querySelector('.popup__price').textContent = arrayObject.offer.price + RUBLES_SYMBOL + '/ночь';
  offerElement.querySelector('h4').textContent = OFFER_TYPE_TRANSLATION[arrayObject.offer.type];
  offerElement.querySelector('p:nth-child(7)').textContent = arrayObject.offer.rooms + ' комнаты для ' + arrayObject.offer.guests + ' гостей';
  offerElement.querySelector('p:nth-child(8)').textContent = 'Заезд после ' + arrayObject.offer.checkin + ', выезд до ' + arrayObject.offer.checkout;
  offerElement.querySelector('p:nth-child(10)').textContent = arrayObject.offer.description;
  offerElement.querySelector('.popup__avatar').src = arrayObject.author.avatar;
  offerElement.querySelector('.popup__features').innerHTML = '';
  offerElement.querySelector('.popup__features').appendChild(getFeaturesList(arrayObject.offer.features));

  return offerElement;
};

// Создание и отрисовка предложения
// var offerElement = renderOffer(allOffers[0]);
// mapElement.insertBefore(offerElement, afterOffersElement);





var formElement = document.querySelector('.notice__form');
var formFieldsetElements = formElement.querySelectorAll('fieldset');
var mapMainPin = mapElement.querySelector('.map__pin--main');

// Первоначальное отключение/Включение полей формы
var toggleFieldsetDisable = function () {
  for (var i = 0; i < formFieldsetElements.length; i++) {
    formFieldsetElements[i].disabled = !formFieldsetElements[i].disabled;
  };
};
toggleFieldsetDisable();

// Активация страницы при перетаскивании главной метки
mapMainPin.addEventListener('click', function () { //!!!!!!! mouseup
  mapElement.classList.remove('map--faded');
  formElement.classList.remove('notice__form--disabled');
  renderPins();
  toggleFieldsetDisable();
});

// Открытие карточки предложения при нажатии на метку
pinsMapElement.addEventListener('click', function (evt) {
  var target = evt.target;
  var activePinElement = pinsMapElement.querySelector('.map__pin--active');
  var renderedOfferElement = mapElement.querySelector('.popup');

  if (target.className === 'map__pin' && target.className !== 'map__pin--main') {

    // Подсветка (новой) метки
    if (activePinElement) {
      activePinElement.classList.remove('map__pin--active');
    };
    target.classList.add('map__pin--active');

    // Отрисовка (новой) карточки обьявления
    var offerElement = renderOffer(allOffers[target.dataset.arrayIndex]);
    if (renderedOfferElement) {
        mapElement.replaceChild(offerElement, renderedOfferElement);
    } else {
    mapElement.insertBefore(offerElement, afterOffersElement);
    };

  // Закрытие карточки обьявления по клику
    var offerCloseElement = offerElement.querySelector('.popup__close');
    offerCloseElement.addEventListener('click', function() {
      mapElement.removeChild(offerElement);
      activePinElement.classList.remove('map__pin--active');
    });

  };



})
