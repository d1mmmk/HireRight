app = angular.module 'bmrapp', []
    
app['controller'] 'bmr', 
  class bmr
    @$inject: ['$scope','$http'] 
    constructor: (@scope, @http) ->
      @scope.formuls = [
          value: 'original'
          label: 'Original'
        ,
          value: 'revised'
          label: 'Revised'
      ]
      @scope.systems = [
          value: 'metric'
          label: 'Metric(cm/kg)'
        ,
          value: 'imperial'
          label: 'Imperial(Feet/inches/pounds)'
      ]
      @scope.genders = [
          value: 'male'
          label: 'Male'
        ,
          value: 'female'
          label: 'Female'
      ]
      @scope.exercises = [
          value: '0'
          multiply: 1.2
          label: 'little or no exercise'
        ,
          value: '1'
          multiply: 1.375
          label: 'light exercise/sports 1-3 days/week'
        ,
          value: '2'
          multiply: 1.55
          label: 'moderate exercise/sports 3-5 days/week'
        ,
          value: '3'
          multiply: 1.725
          label: 'hard exercise/sports 6-7 days a week'
        ,
          value: '4'
          multiply: 1.9
          label: 'very hard exercise/sports & physical job or 2x training'
      ]
      @scope.form = {}
      @scope.form.system = @scope.systems[0]
      @scope.form.formula = @scope.formuls[0]
      @scope.form.exercise = @scope.exercises[0]
      @scope.results = []
      scope = @scope
      @http.get('data.json')
            .success( (data, status, headers, config) ->
                  scope.results = data
                  )
      # @scope.gender = @scope.genders[0]

      angular.extend  @scope, @http,
        calc: @calc
        save: @save
        change: @change
        show: @show
        delete: @delete
        metric_to_imperial: @metric_to_imperial
        imperial_to_metric: @imperial_to_metric

    change: =>
      @scope.form.result = null
    show: (data) =>
      data = angular.copy data
      @scope.form = data
      for formula,i in @scope.formuls
        if data.formula.value == formula.value
          @scope.form.formula = @scope.formuls[i]
      for gender,i in @scope.genders
        if data.gender.value == gender.value
          @scope.form.gender = @scope.genders[i]
      for system,i in @scope.systems
        if data.system.value == system.value
          @scope.form.system = @scope.systems[i]
      for exercise,i in @scope.exercises
        if data.exercise.value == exercise.value
          @scope.form.exercise = @scope.exercises[i]
    delete: (id) =>
      console.log id
      @scope.results.splice(id,1)
      # @http.delete('data.json',{id:id})
      #       .success( (data, status, headers, config) ->
      #         @scope.results.slice(id,1)
      #       )
    save: =>
      @scope.results.push angular.copy @scope.form
    calc: =>
      switch @scope.form.formula.value
        when @scope.formuls[0].value
          switch @scope.form.gender.value
            when @scope.genders[0].value
              result = 66.4730
              w = 13.7516
              h = 5.0033
              a = 6.7550
            when @scope.genders[1].value
              result = 655.0955
              w = 9.5634
              h = 1.8496
              a = 4.6756
        when @scope.formuls[1].value
          switch @scope.form.gender.value
            when @scope.genders[0].value
              result = 88.362
              w = 13.397
              h = 4.799
              a = 5.677
            when @scope.genders[1].value
              result = 447.593
              w = 9.247
              h = 3.098
              a = 4.330

      switch @scope.form.system.value
        when @scope.systems[0].value
          height = @scope.form.height_cm
          weight = @scope.form.weight_kg
        when @scope.systems[1].value
          height = feet_to_cm(inches_to_feet(@scope.form.height_inches) + @scope.form.height_feet)
          weight = pounds_to_kg(@scope.form.weight_pounds)

      age = @scope.form.age

      @scope.form.result = (result + w * weight + h * height - a * age) * @scope.form.exercise.multiply
      @scope.form.loss = @scope.form.result - 500

    cm_to_feet = (cm = 0) ->
      cm / 30.48
    feet_to_cm = (feet = 0) ->
      feet * 30.48
    feet_to_inches = (feet = 0) ->
      feet * 12
    inches_to_feet = (inches = 0) ->
      inches / 12
    kg_to_pounds = (kg = 0) ->
      kg * 2.20462
    pounds_to_kg = (pounds = 0) ->
      pounds / 2.20462

    metric_to_imperial: =>
      # height
      height_feet = cm_to_feet @scope.form.height_cm
      @scope.form.height_feet = parseInt height_feet, 10
      @scope.form.height_inches =  parseInt feet_to_inches(height_feet - @scope.form.height_feet), 10

      # weight
      @scope.form.weight_pounds = parseInt( kg_to_pounds(@scope.form.weight_kg), 10) || 0
      
    imperial_to_metric: =>
      # height
      height_feet = @scope.form.height_feet || 0;
      height_inches = @scope.form.height_inches || 0;
      @scope.form.height_cm = parseInt((height_feet + height_inches / 12) * 30.48, 10) || 0

      # weight
      @scope.form.weight_kg = parseInt( pounds_to_kg(@scope.form.weight_pounds), 10) || 0