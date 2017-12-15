'use strict';

// Константы
var KEYCODE_ESC = 27;
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


// СОЗДАНИЕ МЕТОК И МАССИВА ПРЕДЛОЖЕНИЙ

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

// Функция создания случайных предложений и их записи в массив
var getAllOffers = function () {
  var allOffers = [];
  var randomTitles = getUnicElementsArray(OFFER_TITLES, false);

  for (var i = 0; i < OFFERS_COUNT; i++) {

    var arrayObject = {};
    var randomLocationX = getRandomInt(PIN_LOCATION_X_MIN, PIN_LOCATION_X_MAX);
    var randomLocationY = getRandomInt(PIN_LOCATION_Y_MIN, PIN_LOCATION_Y_MAX);
    var randomCheckInOut = getRandomFeature(OFFER_CHECK);
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
      checkin: randomCheckInOut,
      checkout: randomCheckInOut,
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

// АКТИВАЦИЯ СТРАНИЦЫ

var noticeFormElement = document.querySelector('.notice__form');
var formFieldsetElements = noticeFormElement.querySelectorAll('fieldset');
var mapMainPin = mapElement.querySelector('.map__pin--main');

// Первоначальное отключение/Включение полей формы
var toggleFieldsetDisable = function () {
  for (var i = 0; i < formFieldsetElements.length; i++) {
    formFieldsetElements[i].disabled = !formFieldsetElements[i].disabled;
  }
};
toggleFieldsetDisable();

// Активация страницы при перетаскивании главной метки
mapMainPin.addEventListener('click', function () { // !!! 'mouseup'
  mapElement.classList.remove('map--faded');
  noticeFormElement.classList.remove('notice__form--disabled');
  renderPins();
  toggleFieldsetDisable();
});

// РАБОТА МЕТОК

var activePinElement;

// Закрытие карточки предложения по Esc
var onEscPress = function (evt) {
  if (evt.keyCode === KEYCODE_ESC) {
    closeOfferElement();
  }
};

// Закрытие карточки предложения
var closeOfferElement = function () {
  var offerElement = mapElement.querySelector('.popup');
  mapElement.removeChild(offerElement);
  removeActivePin();
  document.removeEventListener('keydown', onEscPress);
};

// Удаление класса активной метки
var removeActivePin = function () {
  if (activePinElement) {
    activePinElement.classList.remove('map__pin--active');
  }
};

// Открытие карточки предложения при нажатии на метку
pinsMapElement.addEventListener('click', function (evt) {
  var target = evt.target;
  var renderedOfferElement = mapElement.querySelector('.popup');
  activePinElement = pinsMapElement.querySelector('.map__pin--active');

  while (target !== pinsMapElement) {
    if (target.className === 'map__pin' && target.className !== 'map__pin--main') {

      // Подсветка (новой) метки
      removeActivePin();
      activePinElement = target;
      activePinElement.classList.add('map__pin--active');

      // Отрисовка (новой) карточки обьявления
      var offerElement = renderOffer(allOffers[target.dataset.arrayIndex]);
      if (renderedOfferElement) {
        mapElement.replaceChild(offerElement, renderedOfferElement);
      } else {
        mapElement.insertBefore(offerElement, afterOffersElement);
      }

      // Закрытие карточки обьявления по клику на крестик
      var offerCloseElement = offerElement.querySelector('.popup__close');
      offerCloseElement.addEventListener('click', function () {
        closeOfferElement();
      });

      // Закрытие карточки обьявления по нажатию на ESC
      document.addEventListener('keydown', onEscPress);
    }
    target = target.parentNode;
  }
});

// РАБОТА ПОЛЕЙ ФОРМЫ

// Синхронизация полей времени въезда и выезда
var inputOfferTimeinElement = noticeFormElement.querySelector('[name="timein"]');
var inputOfferTimeoutElement = noticeFormElement.querySelector('[name="timeout"]');

// Функция синхронизации времени въезда и выезда
var syncInputsTimeinOut = function (evt) {
  var targetInput = evt.target;
  if (targetInput === inputOfferTimeinElement) {
    inputOfferTimeoutElement.value = inputOfferTimeinElement.value;
  } else {
    inputOfferTimeinElement.value = inputOfferTimeoutElement.value;
  }
};

// При нажатии на время въезда
inputOfferTimeinElement.addEventListener('change', function (evt) {
  syncInputsTimeinOut(evt);
});

// При нажатии на время выезда
inputOfferTimeoutElement.addEventListener('change', function (evt) {
  syncInputsTimeinOut(evt);
});

// Синхронизация полей типа жилья и минимальной цены
var inputOfferTypeElement = noticeFormElement.querySelector('[name="type"]');
var inputOfferPriceElement = noticeFormElement.querySelector('[name="price"]');

inputOfferTypeElement.addEventListener('change', function () {
  if (inputOfferTypeElement.value === 'bungalo') {
    inputOfferPriceElement.min = '0';
  } else if (inputOfferTypeElement.value === 'flat') {
    inputOfferPriceElement.min = '1000';
  } else if (inputOfferTypeElement.value === 'house') {
    inputOfferPriceElement.min = '5000';
  } else {
    inputOfferPriceElement.min = '10000';
  }
});

// Синхронизация полей количества комнат и количества гостей
var inputOfferRoomsElement = noticeFormElement.querySelector('[name="rooms"]');
var inputOfferGuestsElement = noticeFormElement.querySelector('[name="capacity"]');

var guestsOptions = inputOfferGuestsElement.options;
var disabledInputsGuest;
guestsOptions[3].value = '100';

// Функция подбора количества гостей под количество комнат
var disableUnsuitedGuestsOptions = function () {

  for (var i = 0; i < guestsOptions.length; i++) {

    // Если введено не "100 комнат", опция "не для гостей" отключается, остальные значения подбираются
    if (inputOfferRoomsElement.value !== '100') {
      guestsOptions[3].disabled = true;

      if (+guestsOptions[i].value > +inputOfferRoomsElement.value) {
        guestsOptions[i].disabled = true;
      }

    // Если введено "100 комнат", отключает все опции, кроме "не для гостей"
    } else {
      if (guestsOptions[i].value !== '100') {
        guestsOptions[i].disabled = true;
      }
    }
  }
};

// Функция синхронизации количества полей и максимального количества гостей
var syncInputsGuestsAndRooms = function () {
  inputOfferGuestsElement.value = inputOfferRoomsElement.value;
};

// Изначальная синхронизация полей комнат и гостей
syncInputsGuestsAndRooms();
disableUnsuitedGuestsOptions();

// Обработчик при изменении поля количества комнат
inputOfferRoomsElement.addEventListener('change', function () {
  disabledInputsGuest = inputOfferGuestsElement.querySelectorAll('[disabled]');

  // Сброс заблокированных значений гостей
  for (var i = 0; i < disabledInputsGuest.length; i++) {
    disabledInputsGuest[i].disabled = false;
  }

  disableUnsuitedGuestsOptions();
  syncInputsGuestsAndRooms();
});
