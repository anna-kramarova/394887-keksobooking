'use strict';

// КАРТА - ОСНОВНОЙ МОДУЛЬ

(function () {

  // Массив случайных предложений
  var allOffers = window.data.getAllOffers();
  // Общий блок карты
  var mapElement = document.querySelector('.map');
  // Блок с метками
  var pinsMapElement = document.querySelector('.map__pins');


  // АКТИВАЦИЯ СТРАНИЦЫ

  // Элемент главной метки
  var mapMainPinElement = mapElement.querySelector('.map__pin--main');

  // Функция-обработчик активации главной страницы при перетаскивании главной метки
  var onMapMainPinElementMouseup = function () {
    mapElement.classList.remove('map--faded');
    window.pin.renderAll(allOffers, pinsMapElement);

    // Функция активации формы
    window.form.enable();

    mapMainPinElement.removeEventListener('click', onMapMainPinElementMouseup);
  };

  // Обработчик активации страницы при перетаскивании главной метки
  mapMainPinElement.addEventListener('click', onMapMainPinElementMouseup); // 'mouseup'


  // РАБОТА МЕТОК

  // Открытие карточки предложения при нажатии на метку
  pinsMapElement.addEventListener('click', function (evt) {
    var target = evt.target;

    while (target !== pinsMapElement) {
      if (target.className === 'map__pin' && target.className !== 'map__pin--main') {

        // Подсветка (новой) метки
        window.pin.addActiveClass(target);

        // Отрисовка (новой) карточки обьявления
        var pinOffer = allOffers[target.dataset.arrayIndex];
        window.card.renderOfferElement(pinOffer);

      }
      target = target.parentNode;
    }
  });

})();
