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
	

       var map = new ol.Map({
        target: 'map',
        layers: [/*
         new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'osm'})
         }),*/
        new ol.layer.Tile({
		    //Extent der Basemap.at
		    extent: [977844.377599999, 5837774.6617, 1915609.8654, 6295560.8122],
		    //Source aus Abschnitt "Basemap.at WMTS Control"
		    source: source
   	})

         /* new ol.layer.Tile({
            source: new ol.source.TileWMS({
              url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
              params: {VERSION: '1.1.1', LAYERS: 'g07_2014:feedback', TRANSPARENT: true, FORMAT: 'image/png'}
            })
          })
        */],
        view: new ol.View({
          center: ol.proj.transform([16.373, 48.208], 'EPSG:4326', 'EPSG:3857'),
          zoom: 11,
          maxZoom: 19
        })
      });
      
      
        // select interaction working on "click"
        var selection = new ol.interaction.Select({
        condition: ol.events.condition.click
        });
        map.addInteraction(selection);
        delete_feature = selection.getFeatures();
      
  
        
    // Search  
	var searchform = document.getElementById("search");
	searchform.onsubmit = function(evt) {
	  evt.preventDefault();
	  var url = 'http://nominatim.openstreetmap.org/search?format=json&countrycodes=at&q=' + searchform.query.value +'%20Wien';
	  var xhr = new XMLHttpRequest();
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
	
	
	if(document.getElementById('toggle_editing').checked == true){	
        //Send Coordinates of Nominatim Query to database
    	var featureType = 'wohnstandorte';
    	var featureNS = 'http://geoweb/2014/g07';
	//var form = document.forms[0];
	var LocationWohnstandort = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
	  var feature = new ol.Feature();
	  if (LocationWohnstandort) {
	    feature.setGeometryName('geom');
	    feature.setGeometry(new ol.geom.Point(LocationWohnstandort));
	  }
	  feature.set('Adresse', searchform.query.value);
	  
	  var transaction = new ol.format.WFS().writeTransaction([feature], null, null, {
	    featureType: featureType,
	    featureNS: featureNS,
	    //gmlOptions: {srsName: 'EPSG:4326'}
	  });
	  var request = new XMLHttpRequest();
	  request.open('POST', 'http://student.ifip.tuwien.ac.at/geoserver/wfs', true);
	  request.onload = function() {
	    alert(request.responseText);
	  }
	  request.send(new XMLSerializer().serializeToString(transaction));
	//Send Coordinates of Nominatim Query to database
	}
	};
	  xhr.send();
	}
    
    // geolocation
    function geol() {
  var geolocation = new ol.Geolocation({projection: 'EPSG:3857'});
  geolocation.setTracking(true); // here the browser may ask for confirmation
  geolocation.on('change', function() {
    geolocation.setTracking(false);
    map.getView().fitGeometry(geolocation.getAccuracyGeometry(), map.getSize(), { nearest: true, maxZoom: 19 });
    console.log("Accuracy of Geometry: " + geolocation.getAccuracy() + " meters");
  });
};
	  
	// Load variables into dropdown
$.get("datadict.txt", function(response) {
  // We start at line 3 - line 1 is column names, line 2 is not a variable
  $(response.split('\n').splice(2)).each(function(index, line) {
    $('#topics').append($('<option>')
      .val(line.substr(0, 21).trim())
      .html(line.substr(21, 105).trim()));
  });
});

// Add behaviour to dropdown
// Changes the WMS parameters in Link
$('#topics').change(function() {
  zbez_dropdown_view.getSource().updateParams({
    'viewparams': 'column:' + $('#topics>option:selected').val()
  });
});

     // Create an ol.Overlay with a popup anchored to the map
	var popup = new ol.Overlay({
	  element: $('#popup')
	});
	map.addOverlay(popup);
	
	// Handle map clicks to send a GetFeatureInfo request and open the popup
	map.on('singleclick', function(evt) {
	  var view = map.getView();
	  var url = lay_p_wohnstandorte_query_zbez_voronoi.getSource().getGetFeatureInfoUrl(evt.coordinate,
	      view.getResolution(), view.getProjection(), {'INFO_FORMAT': 'text/html'});
	  coordinate_of_wohnstandort = evt.coordinate;
	  popup.setPosition(evt.coordinate);
	  $('#popup-content iframe').attr('src', url);
	  $('#popup')
	    .popover({content: function() { return $('#popup-content').html(); }})
	    .popover('show');
	  // Close popup when user clicks on the 'x'
	  $('.popover-title').click(function() {
	    $('#popup').popover('hide');
	  });
	
	$('.popover form')[0].onsubmit = function(e) {
	var wohnstandort_feature = new ol.Feature();
	wohnstandort_feature.setGeometryName('geom');
	wohnstandort_feature.setGeometry(new ol.geom.Point(evt.coordinate));
	wohnstandort_feature.set('Adresse', this.comment.value); 
	var xml = new ol.format.WFS().writeTransaction([wohnstandort_feature], null, null, {
	  featureType: 'wohnstandorte', featureNS: 'http://geoweb/2014/g07',
	  gmlOptions: {srsName: 'EPSG:3857'}
	});
	var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://student.ifip.tuwien.ac.at/geoserver/wfs', true);
	xhr.onload = function() {
	  lay_p_wohnstandorte_query_zbez_voronoi.getSource().updateParams({});
	  alert('Wohnstandort hinzugefügt.');
	};
	xhr.send(new XMLSerializer().serializeToString(xml));
        e.preventDefault();
        };

        //Wohnstandort löschen        
        var delete_wohnstandort_ausfuehren = 0;
        $('.popover button')[1].onclick = function(e){
	  if(delete_wohnstandort_ausfuehren=='0'){
	  var xml = new ol.format.WFS().writeTransaction(null, null, [delete_feature], {
	  featureType: 'wohnstandorte', featureNS: 'http://geoweb/2014/g07',
	  gmlOptions: {srsName: 'EPSG:3857'}
 	  });
	  var xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://student.ifip.tuwien.ac.at/geoserver/wfs', true);
	  xhr.onload = function() {
	    lay_p_wohnstandorte_query_zbez_voronoi.getSource().updateParams({});
	    alert(xhr.responseText);
	  };
	  xhr.send(new XMLSerializer().serializeToString(xml));
          e.preventDefault();
	      
	  delete_wohnstandort_ausfuehren = 1;
	  }else{
	      delete_wohnstandort_ausfuehren = 0;
	  }
	};
	});
	
		



    //WFS Wohnstandortelayer zur Auswahl für die Löschabfrage
            var lay_p_wohnstandorte = new ol.layer.Vector({
		source: new ol.source.GeoJSON({
		url: 'http://student.ifip.tuwien.ac.at/geoserver/g07_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g07_2014:wohnstandorte&outputFormat=json',
		projection: 'EPSG:3857'
		}),
		style: new ol.style.Style({
		     image: new ol.style.Circle({
		       radius: 4,
		       fill: new ol.style.Fill({
		         color: [251, 187, 16, 1]
		       }),
		       stroke: new ol.style.Stroke({
		         color: [0, 0, 0, 1],
		         width: 0.5
		       })
		     })
		})
	      });
	map.addLayer(lay_p_wohnstandorte);
     
     
    //WMS Layer Wohnstandorte (Dieser Layer wird immer angezeigt)
        var lay_p_wohnstandorte_query_zbez_voronoi = new ol.layer.Tile({
        	source: new ol.source.TileWMS({
        		url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
        		params: {VERSION: '1.1.1', LAYERS: 'wohnstandorte_query_zbez_voronoi', TRANSPARENT: true, FORMAT: 'image/png'},
        		})
        });
        map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
        
        
    //WMS zbez_dropdown_view
      var zbez_dropdown_view = new ol.layer.Tile({
        	source: new ol.source.TileWMS({
        		url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
        		params: {VERSION: '1.1.1', LAYERS: 'zbez_dropdown_view', TRANSPARENT: true, FORMAT: 'image/png'},
        		}),
        		//opacity: 0.5
        });
        
       $('#topics').change(function() {
       var selected_index = document.getElementById('topics').selectedIndex;
       console.log(selected_index);
       if(selected_index == -1 || selected_index == 0){
       	map.removeLayer(zbez_dropdown_view);
       	$('#legend').remove()
       } else {
       	map.removeLayer(zbez_dropdown_view);
       	map.addLayer(zbez_dropdown_view);
       	map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
       	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
       	//insert Legend in map div
        $('#map').prepend('<img id ="legend" class="legend img-rounded" src="http://student.ifip.tuwien.ac.at/geoserver/g07_2014/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=g07_zbez_dropdown_view" />');
       }
       });
       
    // layer Bezirksgrenzen
	var lay_p_bezirksgrenzen = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_bezirksgrenzen', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });


   var lay_p_bezirksgrenzenvisible = 0;

   var lay_p_wohnstandortevisible = 1;

    // add layer Bezirksgrenzen triggered by Button
	document.getElementById('p_bezirksgrenzen').onclick = function(e){
	  if(lay_p_bezirksgrenzenvisible=='0'){
		map.addLayer(lay_p_bezirksgrenzen), lay_p_bezirksgrenzenvisible = 1;
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
       	        map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
		console.log(coordinate_of_wohnstandort);
	  }else{
		map.removeLayer(lay_p_bezirksgrenzen), lay_p_bezirksgrenzenvisible = 0;
	  }
	};

	document.getElementById('toggle_wohnstandorte').onclick = function(e){
	  if(lay_p_wohnstandortevisible=='0'){
		map.addLayer(lay_p_wohnstandorte), map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi), lay_p_wohnstandortevisible = 1;
		console.log(coordinate_of_wohnstandort);
	  }else{
		map.removeLayer(lay_p_wohnstandorte), map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi), lay_p_wohnstandortevisible = 0;
	  }
	};

    // layers POI
	var lay_p_carsharing = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_carsharing_standorte', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });

	var lay_p_fahrrad = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_fahrradabstellanlagen', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });

	var lay_p_haltestellen = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_haltestellen', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });

	var lay_p_parkanlagen = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_parkanlagen', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });

	var lay_p_schulen = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_schulen', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });

	var lay_p_spielplaetze = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_spielplaetze', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });

	var lay_p_sportstaetten = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_sportstaetten', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });

	var lay_p_universitaeten = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_universitaeten', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });
			  
var lay_p_realnutzung = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_realnutzungskartierung2012', TRANSPARENT: true, FORMAT: 'image/png'},
				})
			  });

	var lay_p_tempo30 = new ol.layer.Vector({
				source: new ol.source.GeoJSON({
				url: 'http://student.ifip.tuwien.ac.at/geoserver/g07_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g07_2014:g07_2014_p_tempo30zonen,g07_2014_p_wohnstrassen&outputFormat=json',
				projection: 'EPSG:3857'
				}),
                                style: new ol.style.Style({
				        fill: new ol.style.Fill({
				                color: [251, 241, 83, 0.55]
				        })
                                     })
			        });

	var lay_p_zone = new ol.layer.Vector({
				source: new ol.source.GeoJSON({
				url: 'http://student.ifip.tuwien.ac.at/geoserver/g07_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g07_2014:g07_2014_p_fussgaengerzonen&outputFormat=json',
				projection: 'EPSG:3857'
				}),
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: [251, 187, 16, 0.55]
					})
				})
			  });

      	var lay_p_voronoi = new ol.layer.Vector({
        			source: new ol.source.GeoJSON({
                  		url: 'http://student.ifip.tuwien.ac.at/geoserver/g07_2014/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g07_2014:g07_2014_p_HighRankStopsVoronoi_bez&outputFormat=json',
                		projection: 'EPSG:3857'
        			}),
				style: new ol.style.Style({
				      stroke: new ol.style.Stroke({
				        color: 'black',
				        width: 1
				      })
				    })
				});

	var lay_p_parken = new ol.layer.Tile({
				source: new ol.source.TileWMS({
				  url: 'http://student.ifip.tuwien.ac.at/geoserver/wms',
				  params: {VERSION: '1.1.1', LAYERS: 'g07_2014:g07_2014_p_parkpickerlgeltungsbereich', TRANSPARENT: true, FORMAT: 'image/png'}
				})
			  });

    

/*// code snippet from last years groups, dont work either, even breaks WMS layers
var lay_p_zone = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'http://student.ifip.tuwien.ac.at/geoserver/g03_2013/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=g03_2013:HALTESTELLEWLOGD&outputFormat=json',
    parser: new ol.parser.GeoJSON()
  }),
            style: new ol.style.Style({
                     symbolizers: [
               new ol.style.Icon({
			url: 'http://student.ifip.tuwien.ac.at/geoweb/2013/g03/images/Haltestellen.png',
		       })
                  ]
            })
  });*/

    // Layers triggered by checkboxes
	document.getElementById('p_carsharing').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_carsharing);
         	map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
         	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_carsharing);
    	  }
    	};

	document.getElementById('p_fahrrad').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_fahrrad);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
       	        map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_fahrrad);
    	  }
    	};

	document.getElementById('p_haltestellen').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_haltestellen);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_haltestellen);
    	  }
    	};

	document.getElementById('p_parkanlagen').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_parkanlagen);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_parkanlagen);
    	  }
    	};

	document.getElementById('p_schulen').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_schulen);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_schulen);
    	  }
    	};

	document.getElementById('p_spielplaetze').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_spielplaetze);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_spielplaetze);
    	  }
    	};

	document.getElementById('p_sportstaetten').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_sportstaetten);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_sportstaetten);
    	  }
    	};

	document.getElementById('p_universitaeten').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_universitaeten);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_universitaeten);
    	  }
    	};
    	
    	document.getElementById('p_realnutzung').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_realnutzung);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_realnutzung);
    	  }
    	};

	document.getElementById('p_tempo30').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_tempo30);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_tempo30);
    	  }
    	};

	document.getElementById('p_zone').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_zone);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_zone);
    	  }
    	};

	document.getElementById('p_voronoi').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_voronoi);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);		
	  }else{
		map.removeLayer(lay_p_voronoi);
    	  }
    	};

	document.getElementById('p_parken').onclick = function(e){
	  if(this.checked==1){
		map.addLayer(lay_p_parken);
		map.removeLayer(lay_p_wohnstandorte_query_zbez_voronoi);
          	map.addLayer(lay_p_wohnstandorte_query_zbez_voronoi);
	  }else{
		map.removeLayer(lay_p_parken);
    	  }
    	};
