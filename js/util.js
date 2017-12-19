'use strict';

// ВПОМОГАТЕЛЬНЫЕ ОБЩИЕ ФУНКЦИИ

(function () {

  // Константы-коды нажатых клавиш
  var KEYCODE_ESC = 27;


  // Запись в глобальную область видимости
  window.util = {

    // Функция поиска случайного числа
    getRandomInt: function (min, max) {
      max = max + 1;
      return Math.floor(Math.random() * (max - min)) + min;
    },

    // Функция получения случайного значения массива
    getRandomArrayElement: function (array) {
      var randomElementArray = array[window.util.getRandomInt(0, array.length - 1)];
      return randomElementArray;
    },

    // Функция получения массива с уникальными элементами (случайная длина массива опционально)
    getUnicElementsArray: function (array, boolean) {
      var unicElementsArray = [];
      var unicElementsArrayLength = array.length;

      if (boolean) {
        unicElementsArrayLength = window.util.getRandomInt(1, array.length);
      }

      for (var i = 1; i <= unicElementsArrayLength; i++) {
        var lastArrayElement = array.length - i;
        var randomIndex = window.util.getRandomInt(0, lastArrayElement);

        unicElementsArray[i - 1] = array[randomIndex];
        var usedArrayElement = array[randomIndex];

        var swap = array[lastArrayElement];
        array[lastArrayElement] = usedArrayElement;
        array[randomIndex] = swap;
      }

      return unicElementsArray;
    },

    isEscEvent: function (evt, action) {
      if (evt.keyCode === KEYCODE_ESC) {
        action();
      }
    }

  };

})();
