<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="installed/bootstrap/dist/css/bootstrap.min.css">
		<link rel="stylesheet" href="installed/bootstrap/dist/css/bootstrap-theme.min.css">
		<script src="installed/jquery/dist/jquery.min.js"></script>
		<script type="text/javascript" src="installed/Chart.js/Chart.min.js"></script>
		<script src="installed/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/events.js?v=207"></script>
	</head>

	<body>
		<div class="row">
      <div class="col-md-4">
				Sprinker Enabled: <span id="enabled"></span>
			</div>
      <div class="col-md-4">
				Temperature: <span id="temperature" /></span>
			</div>
			<div class="col-md-4">
				Humidity: <span id="humidity" /></span>
			</div>
		</div>

		<div class="row">
      <div class="col-md-6">
				Temperature
				<br/>
				<canvas id="hourlyTemps" width="720" height="360"></canvas>
			</div>
      <div class="col-md-6">
				Precipitation
				<br/>
				<canvas id="precipitation" width="720" height="360"></canvas>
			</div>
		</div>

		<div class="row">
      <div class="col-md-6">
				Wind Speed
				<br/>
				<canvas id="wind" width="720" height="360"></canvas>
			</div>
		  <div class="col-md-6">
				Cloud Cover
				<br/>
				<canvas id="cloudCover" width="720" height="360"></canvas>
			</div>
    </div>

		<button type="button" id="sensor" class="btn btn-lg btn-default" onClick="toggleSensor('sensor');">Toggle Sprinker</button>
	</body>

	<script type="text/javascript">
		loadTemperature("hourlyTemps");
		loadPrecipitation("precipitation");
		loadWind("wind");
		loadCloudCover("cloudCover");
		loadThermals("temperature", "humidity");
		sprinklerStatus("enabled", "sensor");
	</script>
</html>
