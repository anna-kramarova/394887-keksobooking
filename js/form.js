'use strict';

// РАБОТА ПОЛЕЙ ФОРМЫ

(function () {

  // Константы формы
  var OFFER_TYPES_MIN_PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var noticeFormElement = document.querySelector('.notice__form');


  // Первоначальное отключение/включение полей формы
  var formFieldsetElements = noticeFormElement.querySelectorAll('fieldset');

  // Функция первоначального отключения/включения полей формы
  var toggleFieldsetDisable = function () {
    for (var i = 0; i < formFieldsetElements.length; i++) {
      formFieldsetElements[i].disabled = !formFieldsetElements[i].disabled;
    }
  };
  toggleFieldsetDisable();


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


  // Синхронизация полей типа жилья и минимальной цены
  var inputOfferTypeElement = noticeFormElement.querySelector('[name="type"]');
  var inputOfferPriceElement = noticeFormElement.querySelector('[name="price"]');

  // Функция синхронизации полей типа жилья и минимальной цены
  var syncInputsTypeAndPrice = function () {
    inputOfferPriceElement.min = OFFER_TYPES_MIN_PRICES[inputOfferTypeElement.value];
  };


  // Синхронизация полей количества комнат и количества гостей
  var inputOfferRoomsElement = noticeFormElement.querySelector('[name="rooms"]');
  var inputOfferGuestsElement = noticeFormElement.querySelector('[name="capacity"]');

  var guestsOptions = inputOfferGuestsElement.options;
  var roomsOptions = inputOfferRoomsElement.options;

  var notForGuestOption = guestsOptions[3];
  var tooManyRoomsOption = roomsOptions[3];

  // Функция подбора количества гостей под количество комнат
  var disableUnsuitedGuestsOptions = function () {

    for (var i = 0; i < guestsOptions.length; i++) {

      // Если введено не "100 комнат", опция "не для гостей" отключается, остальные значения подбираются
      if (inputOfferRoomsElement.value !== tooManyRoomsOption.value) {
        notForGuestOption.disabled = true;

        if (+guestsOptions[i].value > +inputOfferRoomsElement.value) {
          guestsOptions[i].disabled = true;
        }

      // Если введено "100 комнат", отключает все опции, кроме "не для гостей"
      } else {
        if (guestsOptions[i] !== notForGuestOption) {
          guestsOptions[i].disabled = true;
        }
      }
    }
  };

  // Функция синхронизации количества комнат и максимального количества гостей
  var syncInputsGuestsAndRooms = function () {

    // Если выбрано "100 комнат", ставит в поле гостей "не для гостей"
    if (inputOfferRoomsElement.value === tooManyRoomsOption.value) {
      inputOfferGuestsElement.value = notForGuestOption.value;

    // Если выбрана другая опция комнат, ставит в поле гостей оптимальное (равное) значение
    } else {
      inputOfferGuestsElement.value = inputOfferRoomsElement.value;
    }

  };


  // Функция активации формы при активации страницы
  var enable = function () {
    noticeFormElement.classList.remove('notice__form--disabled');
    toggleFieldsetDisable();
  };


  // Функция изначальной синхронизации полей формы
  var syncNoticeFormInputs = function () {

    // Синхронизация полей типа жилья и минимальной цены
    syncInputsTypeAndPrice();

    // Синхронизация полей комнат и гостей
    syncInputsGuestsAndRooms();
    disableUnsuitedGuestsOptions();

  };
  syncNoticeFormInputs();


  // Обработчик при изменении поля времени въезда
  inputOfferTimeinElement.addEventListener('change', function (evt) {
    syncInputsTimeinOut(evt);
  });

  // Обработчик при изменении поля времени выезда
  inputOfferTimeoutElement.addEventListener('change', function (evt) {
    syncInputsTimeinOut(evt);
  });

  // Обработчик при изменении поля типа жилья
  inputOfferTypeElement.addEventListener('change', function () {
    syncInputsTypeAndPrice();
  });

  // Обработчик при изменении поля количества комнат
  inputOfferRoomsElement.addEventListener('change', function () {
    var disabledGuestsOptions = inputOfferGuestsElement.querySelectorAll('[disabled]');

    // Сброс заблокированных значений гостей
    for (var i = 0; i < disabledGuestsOptions.length; i++) {
      disabledGuestsOptions[i].disabled = false;
    }

    syncInputsGuestsAndRooms();
    disableUnsuitedGuestsOptions();
  });

  // Валидация при отправке формы
  var noticeFormSubmitButtonElement = noticeFormElement.querySelector('.form__submit');
  var noticeFormInputElements = noticeFormElement.querySelectorAll('input');

  noticeFormSubmitButtonElement.addEventListener('click', function (evt) {

    for (var i = 0; i < noticeFormInputElements.length; i++) {
      var noticeFormInput = noticeFormInputElements[i];
      noticeFormInput.style.border = '';

      if (noticeFormInput.checkValidity() === false) {
        noticeFormInput.style.border = '1px solid red';
        evt.preventDefault();
      }
    }

  });


  // Запись в глобальную область видимости
  window.form = {

    // Функция активации формы при активации страницы (map.js)
    enable: enable

  };

})();
