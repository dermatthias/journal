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
    exports.mapLoaded = false;

    exports.init = function() {
        Map.map = L.map('map').setView([48.395, 9.98], 10);

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(Map.map);

        Map.map.on('click', Map.onMapClick);

        // click listener for large map
        $('#floating-map-icon').on('click', function(event){
            Map.showLargeMap();
        });

        $('.large-map-close').on('click', function(event){
            $(this).parent().fadeOut();
        });
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

    exports.showEntryMap = function(id) {
        var entryMapDiv = $('#entry-map-'+id);
        entryMapDiv.show();

        var lat = entryMapDiv.data('lat');
        var lng = entryMapDiv.data('lng');
        var entryMap = L.map('entry-map-'+id).setView([lat, lng], 10);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(entryMap);
        var marker = L.marker([lat, lng]).addTo(entryMap);
    };

    exports.showLargeMap = function() {
        var largeMapDiv = $('#large-map');

        if (Map.mapLoaded) {
            largeMapDiv.fadeIn();
        } else {

            var currentWindowWidth = $(window).width();
            var currentWindowHeight = $(window).height();
            var mapWidth = currentWindowWidth - (currentWindowWidth / 10);
            var mapHeight = currentWindowHeight - (currentWindowHeight / 10);

            largeMapDiv.width(mapWidth);
            largeMapDiv.height(mapHeight);

            largeMapDiv.css({
                top: $(window).scrollTop() + (currentWindowHeight / 10 / 2),
                left: currentWindowWidth / 10 / 2
            });

            largeMapDiv.fadeIn();

            var main = $('#main');
            var latestLat = main.data('latest-lat');
            var latestLng = main.data('latest-lng');

            var center;
            if (latestLat != "None" && latestLng != "None") {
                center = [latestLat, latestLng];
            } else {
                center = [48.3769, 9.998];
            }

            var largeMap = L.map('large-map').setView(center, 10);
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                maxZoom: 18
            }).addTo(largeMap);

            // query all markers via AJAX
            $.ajax({
                url: 'all_locations',
                type: 'GET',
                dataType: 'json'
            }).done(function (data) {
                // put all marker in the map
                $.each(data, function (index, value) {
                    L.marker([value[0], value[1]]).addTo(largeMap);
                });

            }).fail(function (jqXHR, status) {

            });

            Map.mapLoaded = true;
        }
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