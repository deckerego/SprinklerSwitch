function loadTemperature(canvas) {
  var apparentTemp, hourly = null;

  var tempReq = new XMLHttpRequest();
  tempReq.open("GET", "forecast/temperature", true);

  tempReq.onload = function(evt) {
    var response = JSON.parse(tempReq.responseText);
    hourly = response.hourly;
    if(apparentTemp != null)
      drawTemperature(canvas, response.times, apparentTemp, hourly);
  };

  tempReq.send();

  var appReq = new XMLHttpRequest();
  appReq.open("GET", "forecast/apparentTemp", true);

  appReq.onload = function(evt) {
    var response = JSON.parse(appReq.responseText);
    apparentTemp = response.apparentTemperature;

    if(hourly != null)
      drawTemperature(canvas, response.times, apparentTemp, hourly);
  };

  appReq.send();
}

function drawTemperature(canvas, times, apparentTemp, hourly) {
  hours = times.map(function(x) {
    var date = new Date(x);
    return ""+date.getMonth()+"/"+date.getDate()+" "+date.getHours();
  });

  var data = {
      labels: hours,
      datasets: [
          {
              label: "Apparent Temp",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: apparentTemp
          },
          {
              label: "Hourly Temp",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: hourly
          }
      ]
  };

  var ctx = document.getElementById(canvas).getContext("2d");
  var hourlyTemps = new Chart(ctx).Line(data, {
    animation: false,
    pointHitDetectionRadius : 1,
    responsive: true,
    multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
  });
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
  var dewpoints, relativeHumidity = null;

  var humidReq = new XMLHttpRequest();
  humidReq.open("GET", "forecast/humidity", true);

  humidReq.onload = function(evt) {
    var response = JSON.parse(humidReq.responseText);
    relativeHumidity = response.relativeHumidity;
    if(dewpoints != null)
      drawHumidity(canvas, response.times, apparentTemperature, relativeHumidity);
  }

  humidReq.send();

  var dewReq = new XMLHttpRequest();
  dewReq.open("GET", "forecast/dewpoint", true);

  dewReq.onload = function(evt) {
    var response = JSON.parse(dewReq.responseText);
    dewpoints = response.dewpoints;
    if(relativeHumidity != null)
      drawHumidity(canvas, response.times, dewpoints, relativeHumidity);
  }

  dewReq.send();
}

function drawHumidity(canvas, times, dewpoints, relativeHumidity) {
  hours = times.map(function(x) {
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
            data: dewpoints
        },
        {
            label: "Relative Humidity",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: relativeHumidity
        }
    ]
  };

  var ctx = document.getElementById(canvas).getContext("2d");
  var hourlyTemps = new Chart(ctx).Line(data, {
    animation: false,
    pointHitDetectionRadius : 1,
    responsive: true,
    multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
  });
}
