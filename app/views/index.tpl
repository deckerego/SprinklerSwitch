<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="installed/bootstrap/dist/css/bootstrap.min.css">
		<link rel="stylesheet" href="installed/bootstrap/dist/css/bootstrap-theme.min.css">
	</head>

	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<ul class="nav navbar-nav">
					<li class="active"><a href="/">Home</a></li>
					<li style="padding-left: 10px;"><button type="button" id="sensor" class="btn btn-default navbar-btn" onClick="toggleSensor('sensor');">Toggle Sprinker</button></li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li><p class="navbar-text">Sprinker Enabled: <span id="enabled"></span></p></li>
					<li><p class="navbar-text">Temperature: <span id="temperature" /></span></p></li>
					<li><p class="navbar-text">Humidity: <span id="humidity" /></span></p></li>
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
					<canvas id="cloudCover"></canvas>
				</div>
	    </div>
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
