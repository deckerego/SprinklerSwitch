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
