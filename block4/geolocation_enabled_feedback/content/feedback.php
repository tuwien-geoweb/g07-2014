<!DOCTYPE html>
<html>
<head>
<title>Geoweb Gruppe 7</title>
	<link rel="stylesheet" type="text/css" href="/geoweb/2014/g07/homepage/styles/styles.css">
	<link rel="stylesheet" type="text/css" href="/geoweb/2014/g07/homepage/styles/navigation.css">
	<link href="/geoweb/2014/g07/homepage/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<script src="/geoweb/2014/g07/homepage/bootstrap/js/ie-emulation-modes-warning.js"></script>
	<script type="text/javascript" src="http://openlayers.org/en/v3.0.0/build/ol.js"></script>
	<style>
		.map {
		height: 560px;
		width: 540px;
	}
	</style>
</head>


<body>
    <div class="container" id="shadow">

		<?php include("header.htm");?>
		<?php include("navigation.htm");?>
		<div class="content"><h1>Feedback</h1>
		<div class="row">
			<div class="col-md-6">
<form action="javascript:submitForm();">
  <input type="radio" name="geschlecht" value="Frau"/> Frau
  <input type="radio" name="geschlecht" value="Herr"/> Herr
  <input type="radio" name="geschlecht" value="anderes"/> anderes</br></br>
  <table>
    <tr><td>Name:</td>
       <td><input type="text" name="name" size="50" /></td>
    </tr>
    <tr><td>E-Mail: </td>
       <td><input type="text" name="email" size="50" /></td>
    </tr>
  </table>
  </br>
  Feedback: </br>
  <textarea name="message" rows="10" cols="50"></textarea>
  </br></br>
  <input type="checkbox" name="team" checked="checked" value="ON" />
         Ich bin Mitglied des geoweb-Teams </br></br>
  <input type="submit" value="Abschicken">
  <input type="reset" value="Zur&uuml;cksetzen"> </br></br>
  Danke f&uuml;r Ihr Feedback!<br>Ihr Feedback wird per E-Mail an die Autoren bzw. Autorinnen </br>
  zugestellt und in der Projekt-Datenbank gespeichert.</br></br>
  </br>
</form>

<p>geoweb.m10 (JB), Beispiel ausgehend von</br>
<a href="http://www.thesitewizard.com/archive/feedbackphp.shtml" 
target="_blank"> PHP Tutorial: Feedback Form Script</a> </p>
	</div>
	<div class="col-md-6">
	  <h4>Feedback-Karte</h4>
	  <div id="map" class="map"></div>
		<script>
		  var map = new ol.Map({
			target: 'map',
			layers: [
			  new ol.layer.Tile({
				source: new ol.source.MapQuest({layer: 'osm'})
			  }),
			  new ol.layer.Vector({
			  source: new ol.source.GeoJSON({
				projection: 'EPSG:3857',
				url: 'http://student.ifip.tuwien.ac.at/geoserver/g07_2014/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=g07_2014:feedback&maxFeatures=50&outputFormat=json'
				})
			  }) 
			],
			view: new ol.View({
			  center: ol.proj.transform([16.36, 48.20], 'EPSG:4326', 'EPSG:3857'),
			  <!-- Zoom bei Stufe 11, Karte bietet keine weiteren Zoomstufen -->
			  zoom: 11
			})
		  });
		</script>
	</div>
</div>
<script src="../js/feedback.js"></script>
<script>
  featureType = "feedback";
  featureNS = "http://geoweb/2014/g07";
</script>

		<?php include("footer.htm");?>
	</div>
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="/geoweb/2014/g07/homepage/bootstrap/js/bootstrap.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="/geoweb/2014/g07/homepage/bootstrap/js/ie10-viewport-bug-workaround.js"></script>
</body>

</html> 