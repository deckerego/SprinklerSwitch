function sprinklerStatus(enabledTag, buttonTag) {
  var request = new XMLHttpRequest();
  request.open("GET", "switch/0", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);

    document.getElementById(enabledTag).innerHTML = response.enabled == null ? "NA" : response.enabled;
    document.getElementById(buttonTag).innerHTML = response.enabled ? "Disable Sprinkler" : "Enable Sprinkler";
    window.setTimeout(function() { sprinklerStatus(enabledTag, buttonTag); }, 1 * 1000);
  };

  request.send();
}

function loadThermals(tempTag, humidTag) {
  var request = new XMLHttpRequest();
  request.open("GET", "environment", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var temperature = response.fahrenheit == null ? "NA" : response.fahrenheit.toFixed(2) + " &deg;F";
    var humidity = response.relative_humidity == null ? "NA" : response.relative_humidity.toFixed(2) + "%";

    document.getElementById(tempTag).innerHTML = temperature;
    document.getElementById(humidTag).innerHTML = humidity;
  };

  request.send();
}

function toggleSensor(buttonTag) {
  var request = new XMLHttpRequest();
  request.open("GET", "switch/0", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);

    var put = new XMLHttpRequest();
    put.open("PUT", "switch/0", false);
    put.setRequestHeader('Content-Type', 'application/json');
    put.send(JSON.stringify({ enabled: ! response.enabled }));

    document.getElementById(buttonTag).innerHTML = response.enabled ? "Enable Sprinkler" : "Disable Sprinkler";
  };

  request.send();
}

function loadTemperature(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/temperature", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) { return new Date(x).toLocaleTimeString(); });

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
    var hourlyTemps = new Chart(ctx).Line(data);
  };

  request.send();
}

function loadWind(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/wind", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) { return new Date(x).toLocaleTimeString(); });

    var data = {
        labels: hours,
        datasets: [
            {
                label: "Speed",
                fillColor: "rgba(220,220,220,0.2)",
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
    var windSpeeds = new Chart(ctx).Line(data);
  };

  request.send();
}

function loadPrecipitation(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/precipitation", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) { return new Date(x).toLocaleTimeString(); });

    var data = {
        labels: hours,
        datasets: [
            {
                label: "Inches",
                fillColor: "rgba(220,220,220,0.2)",
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
    var precip = new Chart(ctx).Bar(data);
  };

  request.send();
}

function loadCloudCover(canvas) {
  var request = new XMLHttpRequest();
  request.open("GET", "forecast/cloudcover", true);

  request.onload = function(evt) {
    var response = JSON.parse(request.responseText);
    var hours = response.times.map(function(x) { return new Date(x).toLocaleTimeString(); });

    var data = {
        labels: hours,
        datasets: [
            {
                label: "Percent Coverage",
                fillColor: "rgba(220,220,220,0.2)",
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
    var cloudCoverage = new Chart(ctx).Line(data);
  };

  request.send();
}