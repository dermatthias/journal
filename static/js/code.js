// journal javascript

// leaflet map code
var Map = Map || {};
(function(window, $, exports) {
    'use strict';

    exports.map = undefined;
    exports.currentMarker = undefined;

    exports.init = function() {
        Map.map = L.map('map').setView([48.395, 9.98], 10);

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(Map.map);

        Map.map.on('click', Map.onMapClick);
    };

    exports.onMapClick = function(e) {
        // clean old marker
        if (Map.currentMarker != undefined) {
            Map.map.removeLayer(Map.currentMarker);
        }

        // add new marker
        Map.currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(Map.map);
        $('#form-lat').val(e.latlng.lat);
        $('#form-lng').val(e.latlng.lng);
    };

}(window, jQuery, Map));


// fire the engines
$(function(){
    Map.init();
});