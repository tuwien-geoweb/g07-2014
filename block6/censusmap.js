// Base map
var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});

// Census map layer
var wmsLayer = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
    params: {'LAYERS': 'g07_2014:normalized'}
  }),
  opacity: 0.6
});

// Map object
olMap = new ol.Map({
  target: 'map',
  renderer: 'canvas',
  layers: [osmLayer, wmsLayer],
  view: new ol.View({
    center: [-10764594.0, 4523072.0],
    zoom: 5
  })
});

// Load variables into dropdown
$.get("data/datadict.txt", function(response) {
  // We start at line 3 - line 1 is column names, line 2 is not a variable
  $(response.split('\n').splice(2)).each(function(index, line) {
    $('#topics').append($('<option>')
      .val(line.substr(0, 10).trim())
      .html(line.substr(10, 105).trim()));
  });
});

// Add behaviour to dropdown
// Changes the WMS parameters in Link
$('#topics').change(function() {
  wmsLayer.getSource().updateParams({
    'viewparams': 'column:' + $('#topics>option:selected').val()
  });
});
