var featureType, featureNS;
var form = document.forms[0];
var geolocation = new ol.Geolocation({
  projection: 'EPSG:4326'
});
geolocation.setTracking(true);
// Stop tracking once we have a position
geolocation.on('change', function(evt) {
  geolocation.setTracking(false);
});
function submitForm() {
  var feature = new ol.Feature();
  var position = geolocation.getPosition();
  if (position) {
    feature.setGeometryName('geom');
    feature.setGeometry(new ol.geom.Point(position));
  }
  feature.set('f_name', form.name.value);
  feature.set('f_mail', form.email.value);
  for (var i = form.geschlecht.length - 1; i >= 0; --i) {
    if (form.geschlecht[i].checked) {
      feature.set('f_anrede', form.geschlecht[i].value);
      break;
    }
  }
  feature.set('f_msg', form.message.value);
  feature.set('f_geoweb', form.team.checked ? 1 : 0);
  var date = new Date();
  feature.set('f_datum',
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
  
  var transaction = new ol.format.WFS().writeTransaction([feature], null, null, {
    featureType: featureType,
    featureNS: featureNS,
    gmlOptions: {srsName: 'EPSG:4326'}
  });
  var request = new XMLHttpRequest();
  request.open('POST', 'http://student.ifip.tuwien.ac.at/geoserver/wfs', true);
  request.onload = function() {
    alert(request.responseText);
  }
  request.send(new XMLSerializer().serializeToString(transaction));
}