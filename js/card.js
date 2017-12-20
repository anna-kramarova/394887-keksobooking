'use strict';

// ОТРИСОВКА КАРТОЧКИ ОБЬЯВЛЕНИЯ

(function () {

  var RUBLES_SYMBOL = String.fromCharCode(8381);

  var OFFER_TYPES_TRANSLATION = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };

  // Шаблон предложения
  var offerTemplateElement = document.querySelector('template').content.querySelector('.map__card');

  // Функция создания списка удобств элемента предложения
  var getOfferFeaturesList = function (offerFeaturesArray) {
    var fragment = document.createDocumentFragment();
    var featuresListElement;
    var featuresListElementClass;

    for (var i = 0; i < offerFeaturesArray.length; i++) {
      featuresListElementClass = 'feature feature--' + offerFeaturesArray[i];

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
    offerElement.querySelector('h4').textContent = OFFER_TYPES_TRANSLATION[arrayObject.offer.type];
    offerElement.querySelector('p:nth-child(7)').textContent = arrayObject.offer.rooms + ' комнаты для ' + arrayObject.offer.guests + ' гостей';
    offerElement.querySelector('p:nth-child(8)').textContent = 'Заезд после ' + arrayObject.offer.checkin + ', выезд до ' + arrayObject.offer.checkout;
    offerElement.querySelector('p:nth-child(10)').textContent = arrayObject.offer.description;
    offerElement.querySelector('.popup__avatar').src = arrayObject.author.avatar;
    offerElement.querySelector('.popup__features').innerHTML = '';
    offerElement.querySelector('.popup__features').appendChild(getOfferFeaturesList(arrayObject.offer.features));

    return offerElement;
  };


  // Функция отрисовки (новой) карточки обьявления
  var renderOfferElement = function (pinOffer, mapElement) { // Тут приходится передавать mapElement

    // Существующий элемент карточки обьявления
    var renderedOfferElement = mapElement.querySelector('.popup');
    // Блок после блока с предложениями
    var afterOffersElement = document.querySelector('.map__filters-container');
    // Создание предложения для карточки обьявления
    var offerElement = renderOffer(pinOffer);

    // Вставка (или замена существующего на новый) элемента карточки обьявления
    if (renderedOfferElement) {
      mapElement.replaceChild(offerElement, renderedOfferElement);
    } else {
      mapElement.insertBefore(offerElement, afterOffersElement);
    }


    // Обработчик закрытия карточки обьявления по клику на крестик
    var offerClosingElement = offerElement.querySelector('.popup__close');

    offerClosingElement.addEventListener('click', function () {
      closeOfferElement();
    });

    // Обработчик закрытия карточки обьявления по нажатию на ESC
    document.addEventListener('keydown', onEscPress);

  };


  // Закрытие карточки обьявления и снятие активной метки
  var closeOfferElement = function () {

    var offerElement = document.querySelector('.map').querySelector('.popup'); // mapElement.querySelector('.popup'); Здесь пришлось заменить mapElement

    document.querySelector('.map').removeChild(offerElement); // mapElement.removeChild(offerElement);

    window.pin.removeActivePin();

    document.removeEventListener('keydown', onEscPress);
  };

  // Закрытие карточки предложения по Esc
  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, closeOfferElement);
  };


  // Запись в глобальную область видимости
  window.card = {

    // Функция отрисовки (новой) карточки обьявления для использования в обработчике (map.js)
    renderOfferElement: renderOfferElement

  };

})();
