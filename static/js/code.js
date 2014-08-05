// journal javascript

// leaflet map code
var Map = Map || {};
(function(window, $, exports) {
    'use strict';

    exports.map = undefined;

    exports.init = function() {
        Map.map = L.map('map').setView([48.395, 9.98], 10);

        //'http://{s}.tiles.mapbox.com/v3/MapID/{z}/{x}/{y}.png'
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(Map.map);

        Map.map.on('click', Map.onMapClick);

        // TODO: remove marker on second click
    };

    exports.onMapClick = function(e) {
        var map = Map.map;
        var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    };

}(window, jQuery, Map));


// fire the engines
$(function(){
    Map.init();
});