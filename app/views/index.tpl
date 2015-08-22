<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="css/styles.css?v=201" type="text/css" />
		<script type="text/javascript" src="js/events.js?v=202"></script>
	</head>

	<body>
		<table class="prop_overlay" id="therm_props">
			<tr><td>Temperature:</td> <td id="temperature" /></tr>
			<tr><td>Humidity:</td> <td id="humidity" /></tr>
			<tr><td>Sprinker Enabled:</td> <td id="enabled" /></tr>
		</table>

		<button id="sensor" onClick="toggleSensor('sensor');">Toggle Sprinker</button>
		<button id="system" onClick="window.location.assign('/monit/');">System Stats</button>
	</body>

	<script type="text/javascript">
		loadThermals("temperature", "humidity");
		sprinklerStatus("enabled", "sensor");
	</script>
</html>
