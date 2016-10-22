define(function (require) {
  var bdd = require('intern!bdd');
  var assert = require('intern/chai!assert');
  var DateTimePicker = require('tests/date-time-picker');
  var dsl = require('website-spec').frameworks.intern

  // Load it as a file
  var specAdminEventCheck = require('intern/dojo/text!tests/admin_event_check.spec')
  var specAdminCreate = require('intern/dojo/text!tests/admin_create.spec')

  bdd.describe('Event creation', function () {
    // A simple test
    bdd.it('Test for event', function() {
      return dsl.compile(specAdminCreate, this);
    })

    // A test that uses some passed variables and custom test instructions
    bdd.it('Should create an event', function() {
      var self = this;

      // A set of variables that we'll pass into DSL
      var testVariables = {
        url: 'http://localhost:8000/admin/all/events/upcoming/',
        Faker: {
          name: 'Random name',
          description: 'Random description',
          imagePath: '/root/user/images/placeholder-1300.png', // Should be an absolute path
        }
      }

      var customInstructions = {
        'Class should not contain "disabled"': function(promise, variables) {
          promise = promise
            .getProperty('classList')
            .then(function(classList) {
              assert(classList.indexOf('disabled') == -1, 'Shouldn\'t be disabled');2
            })

          return promise
        },

        // Here we call a different DSL
        'Select morning time': function(promise) {
          return promise.then(function() {
            return DateTimePicker.selectTime(self, 9, 45)
          })
        },
      }

      return dsl.compile(specAdminCreate, this, testVariables, customInstructions);
    })

  });
});
