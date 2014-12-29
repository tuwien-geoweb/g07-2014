//THIS IS THE JAVASCRIPT ENGINE FOR THE GEOWEB-PROJECT OF GROUP G07. 
// C by Isaak Granzer, Clemens Raffler, Kerstin Sigl
// 2014/15

//------------Basemap.at WMTS Control------------
	var template =
    '{Layer}/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpeg';
	var urls = [
	  'http://maps1.wien.gv.at/basemap/' + template,
	  'http://maps2.wien.gv.at/basemap/' + template,
	  'http://maps3.wien.gv.at/basemap/' + template,
	  'http://maps4.wien.gv.at/basemap/' + template,
	  'http://maps.wien.gv.at/basemap/' + template
	];
	
	//Get DEVICE_PIXEL_RATIO from device
	var hiDPI = ol.has.DEVICE_PIXEL_RATIO > 1;
	
	//WMTS source:
	var source = new ol.source.WMTS({
	  projection: 'EPSG:3857',
	  layer: hiDPI ? 'bmaphidpi' : 'geolandbasemap',
	  tilePixelRatio: hiDPI ? 2 : 1,
	  style: 'normal',
	  matrixSet: 'google3857',
	  urls: urls,
	  requestEncoding: /** @type {ol.source.WMTSRequestEncoding} */ ('REST'),
	  tileGrid: new ol.tilegrid.WMTS({
		origin: [-20037508.3428, 20037508.3428],
		resolutions: [
		  559082264.029 * 0.28E-3,
		  279541132.015 * 0.28E-3,
		  139770566.007 * 0.28E-3,
		  69885283.0036 * 0.28E-3,
		  34942641.5018 * 0.28E-3,
		  17471320.7509 * 0.28E-3,
		  8735660.37545 * 0.28E-3,
		  4367830.18773 * 0.28E-3,
		  2183915.09386 * 0.28E-3,
		  1091957.54693 * 0.28E-3,
		  545978.773466 * 0.28E-3,
		  272989.386733 * 0.28E-3,
		  136494.693366 * 0.28E-3,
		  68247.3466832 * 0.28E-3,
		  34123.6733416 * 0.28E-3,
		  17061.8366708 * 0.28E-3,
		  8530.91833540 * 0.28E-3,
		  4265.45916770 * 0.28E-3,
		  2132.72958385 * 0.28E-3,
		  1066.36479193 * 0.28E-3
		],
		matrixIds: [
		  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
		]
	  })
	});

//------------Basemap.at WMTS Control------------
	
	var marker = new ol.Feature();

      var map = new ol.Map({
        target: 'map',
        layers: [
		  new ol.layer.Tile({
		    //Extent der Basemap.at
		    extent: [977844.377599999, 5837774.6617, 1915609.8654, 6295560.8122],
			//Source aus Abschnitt "Basemap.at WMTS Control"
			source: source
		  }),
		  /*
          new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'osm'})
         }),
		 */
          new ol.layer.Tile({
            source: new ol.source.TileWMS({
              url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
              params: {VERSION: '1.1.1', LAYERS: 'g07_2014:feedback', TRANSPARENT: true, FORMAT: 'image/png'}
            })
          })
        ],
        view: new ol.View({
          center: ol.proj.transform([16.373, 48.208], 'EPSG:4326', 'EPSG:3857'),
          zoom: 11
        })
      });
      
      function button() {
//  var geolocation = new ol.Geolocation({projection: 'EPSG:3857'});
//  geolocation.setTracking(true); // here the browser may ask for confirmation
//  geolocation.on('change', function() {
//    geolocation.setTracking(false);
//    map.getView().fitGeometry(geolocation.getAccuracyGeometry(), map.getSize(), { nearest: true, maxZoom: 19 });
//    marker.setGeometry(new ol.geom.Point(map.getView().getCenter()));
//    console.log("Accuracy of Geometry: " + geolocation.getAccuracy() + " meters");
//  });
	}
	button();

	var form = document.getElementById("search");
	form.onsubmit = function(evt) {
	  evt.preventDefault();
	  var url = 'http://nominatim.openstreetmap.org/search?format=json&countrycodes=at&q=' + form.query.value;  var xhr = new XMLHttpRequest();
	  xhr.open("GET", url, true);
	  xhr.onload = function() {
	  var result = JSON.parse(xhr.responseText);
		var bbox = result[0].boundingbox;
		var extent = /** @type {ol.Coordinate} */ [
			parseFloat(bbox[2]), parseFloat(bbox[0]),
			parseFloat(bbox[3]), parseFloat(bbox[1])
			];
		map.getView().fitExtent(ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'), map.getSize());
		marker.setGeometry(new ol.geom.Point(map.getView().getCenter()));

	  };
	  xhr.send();
	 console.log(result);
	}

	document.getElementById('p_bezirksgrenzen').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_bezirksgrenzen);
	  }else{
		map.removeLayer(lay_p_bezirksgrenzen);
	  }
	};
			
	var lay_p_bezirksgrenzen = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_bezirksgrenzen', TRANSPARENT: true, FORMAT: 'image/png'}
				})
			  });