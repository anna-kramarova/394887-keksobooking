'use strict';

// СОЗДАНИЕ МЕТОК, РАБОТА АКТИВНОЙ МЕТКИ

(function () {

  // Константы меток
  var PIN_SHIFT_X = 20;
  var PIN_SHIFT_Y = 40;

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
  var renderAll = function (allOffers, pinsMapElement) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < allOffers.length; i++) {
      fragment.appendChild(renderPin(allOffers[i], i));
    }
    pinsMapElement.appendChild(fragment);
  };

  var activePinElement = document.querySelector('.map__pin--active');

  // Функция добавления класса активной метки
  var addActiveClass = function (target) {
    removeActiveClass();
    activePinElement = target;
    activePinElement.classList.add('map__pin--active');
  };

  // Функция удаления класса активной метки
  var removeActiveClass = function () {
    if (activePinElement) {
      activePinElement.classList.remove('map__pin--active');
    }
  };

  // Запись в глобальную область видимости
  window.pin = {

    // Функция записи во фрагмент элементов меток и вставки фрагмента при активации страницы (map.js)
    renderAll: renderAll,

    // Функция добавления класса активной метки для обработчика нажатия на другую метку (map.js)
    addActiveClass: addActiveClass,

    // Функция удаления класса активной метки при закрытии карточки (card.js)
    removeActiveClass: removeActiveClass

  };


})();
