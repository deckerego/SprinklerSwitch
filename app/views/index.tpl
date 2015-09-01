<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="installed/bootstrap/dist/css/bootstrap.min.css">
		<link rel="stylesheet" href="installed/bootstrap/dist/css/bootstrap-theme.min.css">
		<style type="text/css">
			canvas { background-color: white; width: 100%; height: auto; }
		</style>
	</head>

	<body>
		<div class="container-fluid">
			<div class="row">
	      <div class="col-sm-4">Sprinker Enabled: <span id="enabled"></span></div>
	      <div class="col-sm-4">Temperature: <span id="temperature" /></span></div>
				<div class="col-sm-4">Humidity: <span id="humidity" /></span></div>
			</div>

			<div class="row">
	      <div class="col-lg-6">
					Temperature<br/>
					<canvas id="hourlyTemps"></canvas>
				</div>
	      <div class="col-lg-6">
					Precipitation<br/>
					<canvas id="precipitation"></canvas>
				</div>
			</div>

			<div class="row">
	      <div class="col-lg-6">
					Wind Speed<br/>
					<canvas id="wind"></canvas>
				</div>
			  <div class="col-lg-6">
					Cloud Cover<br/>
					<canvas id="cloudCover" width="720" height="360"></canvas>
				</div>
	    </div>

			<button type="button" id="sensor" class="btn btn-lg btn-default" onClick="toggleSensor('sensor');">Toggle Sprinker</button>
		</div>

		<script src="installed/jquery/dist/jquery.min.js"></script>
		<script type="text/javascript" src="installed/Chart.js/Chart.min.js"></script>
		<script src="installed/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/events.js?v=207"></script>
		<script type="text/javascript">
			loadTemperature("hourlyTemps");
			loadPrecipitation("precipitation");
			loadWind("wind");
			loadCloudCover("cloudCover");
			loadThermals("temperature", "humidity");
			sprinklerStatus("enabled", "sensor");
		</script>
	</body>
</html>
