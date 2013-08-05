(function() {
  var app, bmr,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app = angular.module('bmrapp', []);

  app['controller']('bmr', bmr = (function() {
    var cm_to_feet, feet_to_cm, feet_to_inches, inches_to_feet, kg_to_pounds, pounds_to_kg;

    bmr.$inject = ['$scope', '$http'];

    function bmr(scope, http) {
      this.scope = scope;
      this.http = http;
      this.imperial_to_metric = __bind(this.imperial_to_metric, this);
      this.metric_to_imperial = __bind(this.metric_to_imperial, this);
      this.calc = __bind(this.calc, this);
      this.save = __bind(this.save, this);
      this["delete"] = __bind(this["delete"], this);
      this.show = __bind(this.show, this);
      this.change = __bind(this.change, this);
      this.scope.formuls = [
        {
          value: 'original',
          label: 'Original'
        }, {
          value: 'revised',
          label: 'Revised'
        }
      ];
      this.scope.systems = [
        {
          value: 'metric',
          label: 'Metric(cm/kg)'
        }, {
          value: 'imperial',
          label: 'Imperial(Feet/inches/pounds)'
        }
      ];
      this.scope.genders = [
        {
          value: 'male',
          label: 'Male'
        }, {
          value: 'female',
          label: 'Female'
        }
      ];
      this.scope.exercises = [
        {
          value: '0',
          multiply: 1.2,
          label: 'little or no exercise'
        }, {
          value: '1',
          multiply: 1.375,
          label: 'light exercise/sports 1-3 days/week'
        }, {
          value: '2',
          multiply: 1.55,
          label: 'moderate exercise/sports 3-5 days/week'
        }, {
          value: '3',
          multiply: 1.725,
          label: 'hard exercise/sports 6-7 days a week'
        }, {
          value: '4',
          multiply: 1.9,
          label: 'very hard exercise/sports & physical job or 2x training'
        }
      ];
      this.scope.form = {};
      this.scope.form.system = this.scope.systems[0];
      this.scope.form.formula = this.scope.formuls[0];
      this.scope.form.exercise = this.scope.exercises[0];
      this.scope.results = [];
      scope = this.scope;
      this.http.get('data.json').success(function(data, status, headers, config) {
        return scope.results = data;
      });
      angular.extend(this.scope, this.http, {
        calc: this.calc,
        save: this.save,
        change: this.change,
        show: this.show,
        "delete": this["delete"],
        metric_to_imperial: this.metric_to_imperial,
        imperial_to_metric: this.imperial_to_metric
      });
    }

    bmr.prototype.change = function() {
      return this.scope.form.result = null;
    };

    bmr.prototype.show = function(data) {
      var exercise, formula, gender, i, system, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _results;
      data = angular.copy(data);
      this.scope.form = data;
      _ref = this.scope.formuls;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        formula = _ref[i];
        if (data.formula.value === formula.value) {
          this.scope.form.formula = this.scope.formuls[i];
        }
      }
      _ref1 = this.scope.genders;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        gender = _ref1[i];
        if (data.gender.value === gender.value) {
          this.scope.form.gender = this.scope.genders[i];
        }
      }
      _ref2 = this.scope.systems;
      for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
        system = _ref2[i];
        if (data.system.value === system.value) {
          this.scope.form.system = this.scope.systems[i];
        }
      }
      _ref3 = this.scope.exercises;
      _results = [];
      for (i = _l = 0, _len3 = _ref3.length; _l < _len3; i = ++_l) {
        exercise = _ref3[i];
        if (data.exercise.value === exercise.value) {
          _results.push(this.scope.form.exercise = this.scope.exercises[i]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    bmr.prototype["delete"] = function(id) {
      console.log(id);
      return this.scope.results.splice(id, 1);
    };

    bmr.prototype.save = function() {
      return this.scope.results.push(angular.copy(this.scope.form));
    };

    bmr.prototype.calc = function() {
      var a, age, h, height, result, w, weight;
      switch (this.scope.form.formula.value) {
        case this.scope.formuls[0].value:
          switch (this.scope.form.gender.value) {
            case this.scope.genders[0].value:
              result = 66.4730;
              w = 13.7516;
              h = 5.0033;
              a = 6.7550;
              break;
            case this.scope.genders[1].value:
              result = 655.0955;
              w = 9.5634;
              h = 1.8496;
              a = 4.6756;
          }
          break;
        case this.scope.formuls[1].value:
          switch (this.scope.form.gender.value) {
            case this.scope.genders[0].value:
              result = 88.362;
              w = 13.397;
              h = 4.799;
              a = 5.677;
              break;
            case this.scope.genders[1].value:
              result = 447.593;
              w = 9.247;
              h = 3.098;
              a = 4.330;
          }
      }
      switch (this.scope.form.system.value) {
        case this.scope.systems[0].value:
          height = this.scope.form.height_cm;
          weight = this.scope.form.weight_kg;
          break;
        case this.scope.systems[1].value:
          height = feet_to_cm(inches_to_feet(this.scope.form.height_inches) + this.scope.form.height_feet);
          weight = pounds_to_kg(this.scope.form.weight_pounds);
      }
      age = this.scope.form.age;
      this.scope.form.result = (result + w * weight + h * height - a * age) * this.scope.form.exercise.multiply;
      return this.scope.form.loss = this.scope.form.result - 500;
    };

    cm_to_feet = function(cm) {
      if (cm == null) {
        cm = 0;
      }
      return cm / 30.48;
    };

    feet_to_cm = function(feet) {
      if (feet == null) {
        feet = 0;
      }
      return feet * 30.48;
    };

    feet_to_inches = function(feet) {
      if (feet == null) {
        feet = 0;
      }
      return feet * 12;
    };

    inches_to_feet = function(inches) {
      if (inches == null) {
        inches = 0;
      }
      return inches / 12;
    };

    kg_to_pounds = function(kg) {
      if (kg == null) {
        kg = 0;
      }
      return kg * 2.20462;
    };

    pounds_to_kg = function(pounds) {
      if (pounds == null) {
        pounds = 0;
      }
      return pounds / 2.20462;
    };

    bmr.prototype.metric_to_imperial = function() {
      var height_feet;
      height_feet = cm_to_feet(this.scope.form.height_cm);
      this.scope.form.height_feet = parseInt(height_feet, 10);
      this.scope.form.height_inches = parseInt(feet_to_inches(height_feet - this.scope.form.height_feet), 10);
      return this.scope.form.weight_pounds = parseInt(kg_to_pounds(this.scope.form.weight_kg), 10) || 0;
    };

    bmr.prototype.imperial_to_metric = function() {
      var height_feet, height_inches;
      height_feet = this.scope.form.height_feet || 0;
      height_inches = this.scope.form.height_inches || 0;
      this.scope.form.height_cm = parseInt((height_feet + height_inches / 12) * 30.48, 10) || 0;
      return this.scope.form.weight_kg = parseInt(pounds_to_kg(this.scope.form.weight_pounds), 10) || 0;
    };

    return bmr;

  })());

}).call(this);
