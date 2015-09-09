function loadTemperature(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/temperature", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) {
      var date = new Date(x);
      return ""+date.getMonth()+"/"+date.getDate()+" "+date.getHours();
    });

    var data = {
        labels: hours,
        datasets: [
            {
                label: "Dewpoint",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: response.dewpoints
            },
            {
                label: "Hourly Temp",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: response.hourly
            }
        ]
    };

    var ctx = document.getElementById(canvas).getContext("2d");
    var hourlyTemps = new Chart(ctx).Line(data, {
      animation: false,
      pointHitDetectionRadius : 1,
      responsive: true,
    });
  };

  request.send();
}

function loadWind(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/wind", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) {
      var date = new Date(x);
      return ""+date.getMonth()+"/"+date.getDate()+" "+date.getHours();
    });

    var data = {
        labels: hours,
        datasets: [
            {
                label: "Speed",
                fillColor: "rgba(110,220,110,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: response.speed
            },
        ]
    };

    var ctx = document.getElementById(canvas).getContext("2d");
    var windSpeeds = new Chart(ctx).Line(data, {
      animation: false,
      pointHitDetectionRadius : 1,
      responsive: true,
    });
  };

  request.send();
}

function loadPrecipitation(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/precipitation", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) {
      var date = new Date(x);
      return ""+date.getMonth()+"/"+date.getDate()+" "+date.getHours();
    });

    var data = {
        labels: hours,
        datasets: [
            {
                animation: true,
                label: "Inches",
                fillColor: "rgba(220,110,100,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: response.inches
            },
        ]
    };

    var ctx = document.getElementById(canvas).getContext("2d");
    var precip = new Chart(ctx).Bar(data, {
      animation: false,
      scaleOverride: true,
      scaleSteps: 10,
      scaleStepWidth: 0.1,
      scaleStartValue: 0,
      responsive: true,
    });
  };

  request.send();
}

function loadCloudCover(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/cloudcover", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) {
      var date = new Date(x);
      return ""+date.getMonth()+"/"+date.getDate()+" "+date.getHours();
    });

    var data = {
        labels: hours,
        datasets: [
            {
                label: "Percent Coverage",
                fillColor: "rgba(220,110,100,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: response.percentage
            },
        ]
    };

    var ctx = document.getElementById(canvas).getContext("2d");
    var cloudCoverage = new Chart(ctx).Line(data, {
      animation: false,
      pointHitDetectionRadius : 1,
      scaleOverride: true,
      scaleSteps: 10,
      scaleStepWidth: 10,
      scaleStartValue: 0,
      responsive: true,
      bezierCurve : false,
    });
  };

  request.send();
}

function loadHumidity(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/humidity", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) {
      var date = new Date(x);
      return ""+date.getMonth()+"/"+date.getDate()+" "+date.getHours();
    });

    var data = {
        labels: hours,
        datasets: [
            {
                label: "Apparent Temperature",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: response.apparentTemperature
            },
            {
                label: "Relative Humidity",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: response.relativeHumidity
            }
        ]
    };

    var ctx = document.getElementById(canvas).getContext("2d");
    var hourlyTemps = new Chart(ctx).Line(data, {
      animation: false,
      pointHitDetectionRadius : 1,
      responsive: true,
    });
  };

  request.send();
}
