import Ember from 'ember';

export default Ember.Mixin.create({
  value: null,

  setupBootstrapDatepicker: function() {
    var self = this,
        element = this.$();

    element.
      datepicker({
        autoclose: this.get('autoclose'),
        calendarWeeks: this.get('calendarWeeks'),
        clearBtn: this.get('clearBtn'),
        daysOfWeekDisabled: this.get('daysOfWeekDisabled'),
        endDate: this.get('endDate'),
        forceParse: this.get('forceParse'),
        format: this.get('format'),
        keyboardNavigation: this.get('keyboardNavigation'),
        language: this.get('language'),
        minViewMode: this.get('minViewMode'),
        orientation: this.get('orientation'),
        startDate: this.get('startDate'),
        startView: this.get('startView'),
        todayBtn: this.get('todayBtn'),
        todayHighlight: this.get('todayHighlight'),
        weekStart: this.get('weekStart')
      }).
      on('changeDate', function(event) {
        Ember.run(function() {
          self.didChangeDate(event);
        });
      });

    this.didChangeValue();
  }.on('didInsertElement'),

  teardownBootstrapDatepicker: function() {
    this.$().datepicker('remove');
  }.on('willDestroyElement'),

  didChangeDate: function(event) {
    var isoDate = null;

    if (event.date) {
      var value = this.get('value');
      if (Ember.isArray(value)) {
         // set value to array if multidate
         isoDate = this.$().datepicker('getUTCDates').map(function(date) {
           return date.toISOString();
         });
      } else if (Ember.isPresent(value)) {
         isoDate = this.$().datepicker('getUTCDate').toISOString();
      }
    }

    this.set('value', isoDate);
  },

  didChangeValue: function() {
    var self = this,
        element = this.$(),
        value = this.get('value'),
        dates = [];

    if (Ember.isArray(value)) {
      dates = value.map(function(date) {
        return self._resetTime(new Date(date));
      });
    } else if (Ember.isPresent(value)) {
      //var date = new Date(value);
      //if (date.toString() === 'Invalid Date') ...
      dates = [self._resetTime(new Date(value))];
    }

    element.datepicker.
            apply(element, Array.prototype.concat.call(['update'], dates));
  }.observes('value'),

  // HACK: Have to reset time to 00:00:00 because of the bug in
  //       bootstrap-datepicker
  //       Issue: http://git.io/qH7Hlg
  _resetTime: function(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    return date;
  }
});
