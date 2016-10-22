define(function (require) {
  return {
    selectTime: function selectTime(self, hour, minutes) {
      if (hour < 0 || hour > 23) {
        throw new Error(`Time picker only supports hours 0 through 23 inclusive`)
      }

      if (minutes < 0 || minutes > 55 || minutes % 5 !== 0) {
        throw new Error(`Time picker only supports minutes 0 through 55 inclusive with a 5 minute interval`)
      }

      return self.remote
        .findByCssSelector('.picker.picker--opened')
          .findByCssSelector(`.clockpicker-dial.clockpicker-hours > div:nth-child(${hour + 1})`) // Add 1 as hour 0 is at index 1
            .click()
            .end()
          .findByCssSelector(`.clockpicker-dial.clockpicker-minutes > div:nth-child(${minutes / 5 + 1})`) // Add 1 as minute 0 is at index 1
            .click()
            .end()
          .end()

        .sleep(1*1000) // wait a bit for calendar to close
    },

    selectDateNextMonth: function selectDateNextMonth(self) {
      return self.remote
        .findByCssSelector('.picker.picker--opened.picker--focused')
          // Go to next month
          .findDisplayedByCssSelector('.picker__nav--next')
            .click()
            .end()
          // Select first day
          .findDisplayedByCssSelector('.picker__day.picker__day--infocus')
            .click()
            .end()
          // Select OK
          .findByCssSelector('[data-element="ok-button"]')
            .click()
            .end()
          .end()

        .sleep(1*1000) // wait a bit for calendar to close
    }
  }

});
