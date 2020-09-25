// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 4
  });
  
  // Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// API url -- all events last day
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
console.log(geoData);

function markerSize(mag) {
    return Math.floor(mag) * 10000;
};

function markerColor(depth) {
    if (depth > 90) {
        return "#b30000"
    } else if (depth > 70) {
        return "#e34a33"
    } else if (depth > 50) {
        return "#fc8d59"
    } else if (depth > 30) {
        return "#fdbb84" 
    } else if (depth > 10) {
        return "#fdd49e"
    } else {
        return "#fef0d9"
    }
};

// grab data with d3
d3.json(geoData, function(data) {
    var markers = L.markerClusterGroup();
    for (var i = 0; i < data.features.length; i++) {
        // location arr of int; lng, lat, depth in km
        var location = data.features[i].geometry.coordinates;
        var latlng = [location[1], location[0]];
        var magnitude = data.features[i].properties.mag;
        var name = data.features[i].properties.place;
        L.circle(latlng, {
            fillOpacity: 0.75,
            color: markerColor(location[2]),
            radius: markerSize(magnitude)
        })
            .bindPopup(`<h1> ${name} </h1> <hr> <h3> Magnitude ${magnitude} </h3> <hr> <p> Depth of Earth: ${location[2]}km </p>`)
            .addTo(myMap);
     }
 });

// modified code borrowed from https://leafletjs.com/examples/choropleth/
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (data) {
    this._div.innerHTML = '<h4>Earthquakes in the last day</h4> <br> <p> Size of dots relates to magnitude</p> <br> <p> Color relates to depth in km </p>';
};

info.addTo(myMap);
 
 
 // modified code borrowed from https://leafletjs.com/examples/choropleth/
 var legend = L.control({position: 'bottomright'});

 legend.onAdd = function (map) {
     var div = L.DomUtil.create("div", "info legend"),
     grades = [-10, 10, 30, 50, 70, 90],
     labels = [];
     for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
 };

 legend.addTo(myMap);

