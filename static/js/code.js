// journal javascript


var Controls = Controls || {};
(function(window, $, exports){

    exports.init = function() {

        var title = $('#headline-date');
        var dateFormField = $('#form-date');

        $('.controls .add').on('click', function(){
            title.html(DateTools.addDay());
            dateFormField.val(DateTools.formatDateForAPI(DateTools.currentDate));
        });

        $('.controls .sub').on('click', function(){
            title.html(DateTools.subDay());
            dateFormField.val(DateTools.formatDateForAPI(DateTools.currentDate));
        });

    };

})(window, jQuery, Controls);

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


var DateTools = DateTools || {};
(function(window, $, exports){

    exports.currentDate = moment();

    exports.addDay = function() {
        var future = DateTools.currentDate.add(1, 'day');
        DateTools.currentDate = future;
        return DateTools.formatDate(future);
    };

    exports.subDay = function() {
        var past = DateTools.currentDate.subtract(1, 'day');
        DateTools.currentDate = past;
        return DateTools.formatDate(past);
    };

    exports.formatDate = function(momentDate) {
        return momentDate.format('dddd, DD. MMMM YYYY');
    };

    exports.formatDateForAPI = function(momentDate) {
        return momentDate.format('YYYY-MM-DD HH:mm:ss');
    };

}(window, jQuery, DateTools));


// fire the engines
$(function(){
    Map.init();
    Controls.init();
});