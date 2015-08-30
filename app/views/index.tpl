<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="css/styles.css?v=201" type="text/css" />
		<script type="text/javascript" src="js/events.js?v=206"></script>
		<script type="text/javascript" src="js/installed/Chart.js/Chart.min.js"></script>
	</head>

	<body>
		<table class="prop_overlay" id="therm_props">
			<tr><td>Temperature:</td> <td id="temperature" /></tr>
			<tr><td>Humidity:</td> <td id="humidity" /></tr>
			<tr><td>Sprinker Enabled:</td> <td id="enabled" /></tr>
		</table>

		<table>
			<tr>
				<td>
					<canvas id="hourlyTemps" width="800" height="400"></canvas>
				</td>
				<td>
					<canvas id="precipitation" width="800" height="400"></canvas>
				</td>
			</tr>
			<tr>
				<td>
					<canvas id="wind" width="800" height="400"></canvas>
				</td>
				<td>
					<canvas id="cloudCover" width="800" height="400"></canvas>
				</td>
			</tr>
		</table>

		<button id="sensor" onClick="toggleSensor('sensor');">Toggle Sprinker</button>
		<button id="system" onClick="window.location.assign('/monit/');">System Stats</button>
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
