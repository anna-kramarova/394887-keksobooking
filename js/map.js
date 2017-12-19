'use strict';

// РАБОТА МЕТОК

(function () {

  // Константы меток
  var PIN_SHIFT_X = 20;
  var PIN_SHIFT_Y = 40;

  // Массив случайных предложений
  var allOffers = window.data.getAllOffers();

  // Общий блок карты
  var mapElement = document.querySelector('.map');
  // Блок с метками
  var pinsMapElement = document.querySelector('.map__pins');


  // СОЗДАНИЕ МЕТОК

  // Шаблон метки
  var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');

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


  // АКТИВАЦИЯ СТРАНИЦЫ

  // Элемент главной метки
  var mapMainPinElement = mapElement.querySelector('.map__pin--main');

  // Функция-обработчик активации главной страницы при перетаскивании главной метки
  var onMapMainPinElementMouseup = function () {
    mapElement.classList.remove('map--faded');
    renderPins();

    window.form.noticeFormElement.classList.remove('notice__form--disabled');
    window.form.toggleFieldsetDisable();

    mapMainPinElement.removeEventListener('click', onMapMainPinElementMouseup);
  };

  // Обработчик активации страницы при перетаскивании главной метки
  mapMainPinElement.addEventListener('click', onMapMainPinElementMouseup);


  // РАБОТА МЕТОК

  var activePinElement;

  // Закрытие карточки предложения по Esc
  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, closeOfferElement);
  };

  // Закрытие карточки обьявления и снятие активной метки
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

    activePinElement = pinsMapElement.querySelector('.map__pin--active');

    while (target !== pinsMapElement) {
      if (target.className === 'map__pin' && target.className !== 'map__pin--main') {

        // Подсветка (новой) метки
        removeActivePin();
        activePinElement = target;
        activePinElement.classList.add('map__pin--active');

        // Отрисовка (новой) карточки обьявления
        var pinOffer = allOffers[target.dataset.arrayIndex];
        var renderedOfferElement = window.card.renderOfferElement(pinOffer, mapElement);

        // Закрытие карточки обьявления по клику на крестик
        var offerCloseElement = renderedOfferElement.querySelector('.popup__close');
        offerCloseElement.addEventListener('click', function () {
          closeOfferElement();
        });

        // Закрытие карточки обьявления по нажатию на ESC
        document.addEventListener('keydown', onEscPress);

      }
      target = target.parentNode;
    }
  });

})();
