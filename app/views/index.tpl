<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="installed/bootstrap/dist/css/bootstrap.min.css">
		<link rel="stylesheet" href="installed/bootstrap/dist/css/bootstrap-theme.min.css">
		<link rel="stylesheet" href="css/styles.css" type="text/css">
	</head>

	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<ul class="nav navbar-nav">
					<li><a class="navbar-brand" href="/">Home</a></li>
					<li><button type="button" id="sensor" class="btn btn-default navbar-btn" onClick="toggleSensor('sensor');">Toggle Sprinker</button></li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li><p class="navbar-text">Sprinker Enabled: <span id="enabled"></span></p></li>
					<li><p class="navbar-text">Temperature: <span id="sensorTemperature" /></span></p></li>
					<li><p class="navbar-text">Humidity: <span id="sensorHumidity" /></span></p></li>
				</ul>
			</div>
		</nav>

		<div class="container-fluid">
			<div class="row">
	      <div class="col-lg-6">
					Temperature<br/>
					<canvas id="hourlyTemps"></canvas>
				</div>
				<div class="col-lg-6">
					Humidity<br/>
					<canvas id="humidity"></canvas>
				</div>
			</div>

			<div class="row">
				<div class="col-lg-6">
					Precipitation<br/>
					<canvas id="precipitation"></canvas>
				</div>
			  <div class="col-lg-6">
					Cloud Cover<br/>
					<canvas id="cloudCover"></canvas>
				</div>
	    </div>

			<div class="row">
				<div class="col-lg-6">
					Wind Speed<br/>
					<canvas id="wind"></canvas>
				</div>
			  <div class="col-lg-6">

				</div>
	    </div>
		</div>

		<script src="installed/jquery/dist/jquery.min.js"></script>
		<script type="text/javascript" src="installed/Chart.js/dist/Chart.min.js"></script>
		<script src="installed/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/events.js"></script>
		<script type="text/javascript" src="js/graphs.js"></script>
		<script type="text/javascript">
			loadTemperature("hourlyTemps");
			loadPrecipitation("precipitation");
			loadWind("wind");
			loadCloudCover("cloudCover");
			loadHumidity("humidity");
			loadThermals("sensorTemperature", "sensorHumidity");
			sprinklerStatus("enabled", "sensor");
		</script>
	</body>
</html>
