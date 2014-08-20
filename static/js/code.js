// ************************
// journal javascript     *
// flurp.de - hello       *
// ************************

var Controls = Controls || {};
(function(window, $, exports){

    exports.currentNumOfEntries = 5;

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


        $('.entry').on('mouseenter', function(event){
            $(this).find('.entry-edit').show();
        }).on('mouseleave', function(event){
            $(this).find('.entry-edit').hide();
        });
        $('.entry-edit').on('click', function(event){
            var entry_id = $(this).parents('.entry').data('entry-id');
            $(this).parent().siblings('.edit-controls').fadeToggle();
            var entry_element = $(this).parent().parent();
            // toggle edit mode
            if (entry_element.data('in-edit-mode')) {
                entry_element.data('in-edit-mode', false);
            } else {
                entry_element.data('in-edit-mode', true);
            }

            $('#entry-map-'+entry_id).slideUp();

            $(this).parent().parent().find('.submit-edit').on('click', function(event){
                Controls.updateEntry(entry_id, entry_element);
            });
        });

        // load more listener
        $('#more-button').on('click', function(event){
            var that = this;
            $(this).hide();
            $('#more-loader').show();

            $.ajax({
                url: '/get/',
                type: 'GET',
                dataType: 'html',
                data: {
                    limit: 5,
                    offset: exports.currentNumOfEntries
                }
            }).done(function(data){
                console.log('lalala');
                $('#entries').append(data);

                $(that).show();
                $('#more-loader').hide();

                exports.currentNumOfEntries += 5;

            }).fail(function(jqXHR, status){

            });
        });

        $('.edit-delete').on('click', function (event) {
            var entry_element = $(this).parent().parent().parent();
            var entry_id = entry_element.data('entry-id');
            console.log(entry_id);
            $.ajax({
                url: '/delete/',
                type: 'POST',
                dataType: 'json',
                data: {entry_id: entry_id}
            }).done(function(data) {
                entry_element.fadeOut(400, function(){
                    $(this).remove();
                });
            }).fail(function(jqXHR, status) {

            });
        })
    };

    exports.updateEntry = function(id, entry_element) {
        var textarea_element = entry_element.find('.text-edit');
        var text = textarea_element.val();
        // after the edit was submitted, close the edit mode
        entry_element.data('in-edit-mode', false);

        $.ajax({
            url: '/edit/',
            type: 'POST',
            dataType: 'json',
            data: {
                entry_id: id,
                text: text,
                lat: textarea_element.data('edited-lat'),
                lng: textarea_element.data('edited-lng')
            }
        }).done(function(data) {

            entry_element.find('.edit-controls').fadeToggle();
            entry_element.find('.text').html(data.content);

        }).fail(function(jqXHR, status) {

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
    exports.maps = {};
    exports.mapsMarker = {};

    exports.init = function() {

        if ($('#map').length != 0) {
            Map.map = L.map('map').setView([48.395, 9.98], 10);

            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                maxZoom: 18
            }).addTo(Map.map);

            Map.map.on('click', Map.onMapClick);

            // click listener for large map
            $('#floating-map-icon').on('click', function (event) {
                Map.showLargeMap();
            });

            $('.large-map-close').on('click', function (event) {
                $(this).parent().fadeOut();
            });
        }
        $('.location-text').on('click', function(event){
            var entry_id = $(this).data('entry-id');
            Map.showEntryMap(entry_id);
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

        // get the entry element of this ma
        var entry_element = entryMapDiv.parent().parent();
        var in_edit_mode = entry_element.data('in-edit-mode');

        if(entryMapDiv.is(':visible')) {
            entryMapDiv.slideUp();
        }  else {

            entryMapDiv.slideDown(400, function(){
                var lat = entryMapDiv.data('lat');
                var lng = entryMapDiv.data('lng');

                if (entryMapDiv.data('initialized')) {
                    console.log('map was already initialized. just showing it.');
                    var entryMap = Map.maps[id];
                } else {

                    var entryMap = L.map('entry-map-' + id).setView([lat, lng], 10);
                    Map.maps[id] = entryMap;
                    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                        maxZoom: 18
                    }).addTo(entryMap);

                    entryMapDiv.data('initialized', true);
                }


                if (Map.mapsMarker[id]) {
                    var marker = Map.mapsMarker[id];
                    marker.dragging.enable();
                } else {
                    var marker = L.marker([lat, lng], {draggable: in_edit_mode}).addTo(entryMap);
                    Map.mapsMarker[id] = marker;
                    // if we can drag and edit the marker, set the new position to the edit-text textarea data field
                    // and later submit them with the ajax request.
                    marker.on('dragend', function (event) {
                        var position = marker.getLatLng();
                        if (entry_element != undefined) {
                            var textarea_element = entry_element.find('.text-edit');
                            textarea_element.data('edited-lat', position.lat);
                            textarea_element.data('edited-lng', position.lng);
                        }
                    });
                }

            });
        }
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
                    var marker = L.marker([value.lat, value.lng]).addTo(largeMap);
                    var content = '<div class="bubble">'+value.date + '<br>' + '<a href="/get/'+value.id+'">Show me this single day</a>'+'</div>';
                    marker.bindPopup(content);
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