
var geo_coord=[];
var geo_coord_save=[];
var lngth = 0;
var closed = true;
var flightPlanCoordinates = [];
var frst_cor = 0;
var last_lat = 0;
var last_lon = 0;
var frst_chck = false;
function readText(that){
                

			if(that.files && that.files[0]){
				var reader = new FileReader();
				reader.onload = function (e) {  
					var output=e.target.result;
				
					output=output.split("\n");
					var error;
					output.forEach(function(coords){
						new_coord = coords.split(",")
						matchs = new_coord[0].match( /\d/ );
						
						if (new_coord[0]=="" || new_coord[1]=="" || new_coord[0]!='area name' && matchs==null){
							
							error=true;
							
						}else{
				            if(new_coord[0]=="area name"){
					            	//area_value = document.getElementById('span-area').innerHTML ;
					              	
					              	if(frst_cor!=0){
					              		
					              		flightPlanCoordinates.push( {lat: last_lat, lng: last_lon});
					              		var flightPath = new google.maps.Polyline({
										    path: flightPlanCoordinates,
										    strokeColor: "#FF0000",
								            strokeOpacity: 1,
								            strokeWeight: 3
										  });
									    flightPath.setMap(map);
									    flightPlanCoordinates = [];
								
					              	}	

					              	frst_cor = 0;
					              	geo_coord_save.push(new_coord[0]+','+new_coord[1]);
					              	newPlot();

					            }else{
					            	new_coord_lat = new_coord[0].split('-');
					            	//alert(new_coord[1]);
					              	new_coord_lng = new_coord[1].split('-');
					              	lat=toDecimal(new_coord_lat[0],new_coord_lat[1],new_coord_lat[2]);
					              	lng=toDecimal(new_coord_lng[0],new_coord_lng[1],new_coord_lng[2]);
					            	
					            	if(frst_cor == 0){
					            		flightPlanCoordinates.push({lat: lat, lng: lng});
					            	}else{
					              		last_lat = lat;
					              		last_lon = lng;
					              	}
					            						              	
					              	frst_cor = frst_cor + 1;
					              
						            measureAdd(new google.maps.LatLng(lat, lng));
						        	geo_coord_save.push(lat+','+lng);
					        }
                    	}
                    });

                    if(error){
                    	measureReset();
                    	initialize();
                    	alert('Check the text file you upload!!!' );
                    }
          
        
				};
				reader.readAsText(that.files[0]);
			}
		} 
function toDecimal(deg, min, sec){
	return (((sec/3600 )+ (min/60))+(deg*1.0)) ;
}
/*
function readText(that){
                

			if(that.files && that.files[0]){
				var reader = new FileReader();
				reader.onload = function (e) {  
					var output=e.target.result;
				
					output=output.split("\n");
					var error;
					output.forEach(function(coords){
						new_coord = coords.split(",")
						matchs = new_coord[0].match( /\d/ );
						//alert(new_coord);
						if (new_coord[0]=="" || new_coord[1]=="" || new_coord[0]!='area name' && matchs==null){
							;
							error=true;
							
						}else{
				            if(new_coord[0]=="area name"){
					            	//area_value = document.getElementById('span-area').innerHTML ;
					              	
					              	geo_coord_save.push(new_coord[0]+','+new_coord[1]);
					              	newPlot();

					            }else{
						            measureAdd(new google.maps.LatLng(new_coord[0], new_coord[1]));
						        	geo_coord_save.push(new_coord[0]+','+new_coord[1]);
					        }
                    	}
                    });
                    if(error){
                    	measureReset();
                    	initialize();
                    	alert('Check the text file you upload!!!' );
                    }
          
        
				};
				reader.readAsText(that.files[0]);
			}
		} 
*/
function saveMultipleArea(){
	
    //alert($('#area_name').val());
    //alert(geo_coord);
    $.get('/save_multiple_area', {coordinates:geo_coord_save}, function(data){
     $('#map_save ').html(data);
    });
    geo_coord = [];
}

function setNumberPoints(){
	lngth = $('#numbers').val();
	$("#lat_number").append("<h4> Latitude</h4>");
	$("#lng_number").append("<h4> Longitude</h4>");
	for(i=1 ;i<=lngth; i++){
		
		$("#lat_number").append(i+". <input id='lat_deg"+i+"' style='width:15%' placeholder='degree'> <input style='width:15%' id='lat_min"+i+"' placeholder='minutes'> <input id='lat_sec"+i+"' style='width:15%' placeholder='seconds'> </br>");
		$("#lng_number").append(i+". <input id='lng_deg"+i+"' style='width:15%' placeholder='degree'> <input style='width:15%' id='lng_min"+i+"' placeholder='minutes'> <input id='lng_sec"+i+"' style='width:15%' placeholder='seconds'> </br>");
	}
     $("#lng_number").append("<a href='javascript:plotNumbers();' style='width: 50%' class='btn btn-warning'> Check </a>");
}

function plotNumbers(){

	for(i=1 ;i<=lngth; i++){

		lat =  toDecimal($('#lat_deg'+i).val(), $('#lat_min'+i).val() ,$('#lat_sec'+i).val());
		lng = toDecimal($('#lng_deg'+i).val(),$('#lng_min'+i).val(), $('#lng_sec'+i).val());
		if(i==1 || i==lngth){
			flightPlanCoordinates.push( {lat: lat, lng: lng});
		}
		measureAdd(new google.maps.LatLng(lat,lng));
        geo_coord.push(lat+','+lng);
       
	}
    
		var flightPath = new google.maps.Polyline({
		    path: flightPlanCoordinates,
		    strokeColor: "#FF0000",
		    strokeOpacity: 1,
		    strokeWeight: 3
		  });
		flightPath.setMap(map);
		flightPlanCoordinates = [];

}

function toDegree(latlng){
    	new_lat = latlng.toString().split('.');
        
        m_lat = (('0.'+new_lat[1])*60).toString().split('.');
        s_lat = (('0.'+m_lat[1])*60);
        
    	return new_lat[0]+'\xB0'+m_lat[0]+"'"+Math.round(s_lat * 100)/ 100+'"' ;
    }

function search_name(){

    $.get('/search_name', {search_name:$('#search_name').val()}, function(data){
     $('#result_table ').html(data);
      
    });
}

function saveAreaName(){
	
    $.get('/save_area', {area_name:$('#area_name').val(), coordinates:geo_coord}, function(data){
     $('#map_save ').html(data);
      
    });
    geo_coord = [];
}

function getCoord(){
  	geo_coord.forEach(function(item){
        //alert(item.toString());
                    //item = item.toString().split(",");
                    $("#area_result").append(" <span>"+item+"</span> <br/>");
                     
            });
  }

function newPlot(){
	closed = true;
	frst_cor = 0;
    measure.mvcLine = new google.maps.MVCArray(),
    measure.mvcPolygon= new google.maps.MVCArray(),
    measure.mvcMarkers= new google.maps.MVCArray(),
    measure.line= null,
    measure.polygon= null,
    geo_coord = [];

}


function getAreaName(id) {
  //alert(id);

    
  $("#area_result").html("");
  closed = false;
  $.get('/getAreaName', {area_name_id: id}, function(data){
      /*$('#stud_list ').html(data);*/
      //alert(data.coordins);
      
      name_area = data.area_name;
      data = data.coordins;
       $("#area_result").append(" <b> Area Name: <span>"+ name_area+" </span> </b>");
      $("#area_result").append(" <table border='1' > <thead > <th style='padding-right: 6px; padding-left: 6px'>Corner</th> <th style='padding-right: 6px; padding-left: 6px'>Longitude</th><th style='padding-right: 6px; padding-left: 6px'>Latitude</th>  </thead> <tbody id='result_td'> </tbody> </table>");
      var corner = 0 
     	flightPlanCoordinates = [
	    {lat: Number(data[0].toString().split(",")[0]), lng: Number(data[0].toString().split(",")[1])},
	    {lat: Number(data[data.length-1].toString().split(",")[0]), lng: Number(data[data.length-1].toString().split(",")[1])}
	  ];
	    var flightPath = new google.maps.Polyline({
		    path: flightPlanCoordinates,
		    strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeWeight: 3
		  });
	    flightPath.setMap(map);
      data.forEach(function(item){
        //alert(item.toString());
             		corner = corner + 1;
                    item = item.toString().split(",");
                    //alert(item[1]);
                        //alert(item[1]);
                    measureAdd(new google.maps.LatLng(item[0], item[1]));
                    geo_coord.push(item[0]+','+item[1]);    
                    $("#result_td").append("<tr> <td style='padding-left: 13px'>"+corner+"</td><td style='padding-right: 6px; padding-left: 6px'>"+ toDegree(item[1])+"</td> <td style='padding-right: 6px; padding-left: 6px'>"+toDegree(item[0])+"</td></tr>");
            });
     // geo_coord.push(data[0]+','+data[1]);
    // area_value = document.getElementById('span-area').innerHTML ;
     
     
    });
	  	newPlot();
	   	geo_coord = [];

 };




var measure = {
    mvcLine: new google.maps.MVCArray(),
    mvcPolygon: new google.maps.MVCArray(),
    mvcMarkers: new google.maps.MVCArray(),
    line: null,
    polygon: null
};
var map;
var infowindow = new google.maps.InfoWindow({
    
    maxWidth: 200
	});	


function initialize() {
	
    map = new google.maps.Map(document.getElementById("map-canvas"), {
       // zoom: 16,
        zoom: 12,
        center: new google.maps.LatLng(8.454167, 125.162778),
        mapTypeId: google.maps.MapTypeId.MAP,
        draggableCursor: "crosshair"
    });
    //alert(new google.maps.LatLng(7.59537, 124.17342));
   	




		
	    	google.maps.event.addListener(map, "click", function(evt) {
	    	    		
				
	    
	    	        measureAdd(evt.latLng);
	    	         geo_coord.push(evt.latLng.lat()+', '+evt.latLng.lng());
	    	    
	    	    });
	
	 
	 

    google.maps.event.addListener(map, "mousemove", function(evt) {
    	$("#latitude").html(" <span> Latitude = "+toDegree(evt.latLng.lat())+"</span> <br/>");
    	$("#longitude").html(" <span> Longitude = "+toDegree(evt.latLng.lng())+"</span> <br/>");   
    	
    });

    
}

function measureAdd(latLng) {

    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        
        
        //draggable: true,
       // raiseOnDrag: false,
        
    });

    measure.mvcLine.push(latLng);
    measure.mvcPolygon.push(latLng);

    measure.mvcMarkers.push(marker);

    var latLngIndex = measure.mvcLine.getLength() - 1;

    measure.mvcMarkers.forEach(function(elem, index) {
    	index = index + 1;
        elem.setIcon(new google.maps.MarkerImage("http://thydzik.com/thydzikGoogleMap/markerlink.php?text="+index+"&color=5680FC", new google.maps.Size(20, 19), new google.maps.Point(0, 0), new google.maps.Point(8, 8)));
    });
    google.maps.event.addListener(marker, "mouseover", function() {
    	$("#latitude").html(" <span> Latitude = "+toDegree(marker.position.lat())+"</span> <br/>");
    	$("#longitude").html(" <span> Longitude = "+toDegree(marker.position.lng())+"</span> <br/>");   
    	
    	infowindow.setContent("<div>Latitude = "+toDegree(marker.position.lat())+" <br> Longitude = "+toDegree(marker.position.lng())+" </div>");
 		infowindow.open(map, marker);

    //    marker.setIcon(new google.maps.MarkerImage("http://thydzik.com/thydzikGoogleMap/markerlink.php?text=1&color=5680FC", new google.maps.Size(15, 15), new google.maps.Point(0, 0), new google.maps.Point(8, 8)));
    });

   // google.maps.event.addListener(marker, "mouseout", function() {
     //   marker.setIcon(new google.maps.MarkerImage("http://thydzik.com/thydzikGoogleMap/markerlink.php?text=1&color=5680FC", new google.maps.Size(9, 9), new google.maps.Point(0, 0), new google.maps.Point(5, 5)));
    //});

    
   /* google.maps.event.addListener(marker, "drag", function(evt) {
        measure.mvcLine.setAt(latLngIndex, evt.latLng);
        measure.mvcPolygon.setAt(latLngIndex, evt.latLng);
    });

   google.maps.event.addListener(marker, "dragend", function() {
        if (measure.mvcLine.getLength() > 1) {
            measureCalc();
        }
    });*/

    if (measure.mvcLine.getLength() > 1) {

       if (!measure.line) {

             measure.line = new google.maps.Polyline({
                map: map,
                clickable: false,
                strokeColor: "#FF0000",
                strokeOpacity: 1,
                strokeWeight: 3,
                path:measure. mvcLine
            });

        }

       if (measure.mvcPolygon.getLength() > 2) {

            if (!measure.polygon) {

                measure.polygon = new google.maps.Polygon({
                    clickable: false,
                    map: map,
                    fillOpacity: 0.25,
                    strokeOpacity: 0,
                    paths: measure.mvcPolygon
                });

            }

        }

    }

    if (measure.mvcLine.getLength() > 1) {
        measureCalc();
    }

}

function measureCalc() {

    if (measure.mvcPolygon.getLength() > 2) {
       	
        var area = google.maps.geometry.spherical.computeArea(measure.polygon.getPath());
     	
        jQuery("#span-area").text((area/10000));
    }
  
}

function measureReset() {
    geo_coord=[];
    initialize();
    if (measure.polygon) {
        measure.polygon.setMap(null);
        measure.polygon = null;
    }
    if (measure.line) {
        measure.line.setMap(null);
        measure.line = null
    }

    measure.mvcLine.clear();
    measure.mvcPolygon.clear();

    measure.mvcMarkers.forEach(function(elem, index) {
        elem.setMap(null);
    });
    measure.mvcMarkers.clear();

    jQuery("#span-length,#span-area").text(0);

}
google.maps.event.addDomListener(window, 'load', initialize);