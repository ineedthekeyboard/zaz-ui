define([
    'jquery.plugins',
    'handlebars-helpers',
    'common/formatter',
    'framework/framework',
    'maps',
    'css!gadgets/mapData/mapData'
], function ($,
    HBS,
    formatter,
    framework) {


    return $.widget('zaz.mapData', framework.baseGadget, {

        data: [
            {
                coordinates: [38.3466672, -81.6301627],
                age: 2,
                wearTear: 20
            },
            {
                coordinates: [39.1811156, -94.5109903],
                age: 4,
                wearTear: 40
            },
            {
                coordinates: [45.7795466, -108.5395631],
                age: 1,
                wearTear: 10
            },
            {
                coordinates: [45.4430765, -122.7258747],
                age: 8,
                wearTear: 80
            },
            {
                coordinates: [33.4081168, -112.0704597],
                age: 5,
                wearTear: 50
            },
            {
                coordinates: [33.2114519, -92.6555128],
                age: 3,
                wearTear: 30
            },
            {
                coordinates: [32.3594065, -86.3059523],
                age: 9,
                wearTear: 90
            },
            {
                coordinates: [30.4351917, -84.2880913],
                age: 6,
                wearTear: 60
            },
            {
                coordinates: [28.5498216, -81.3589989],
                age: 10,
                wearTear: 100
            },
            {
                coordinates: [39.1722876, -78.1745939],
                age: 7,
                wearTear: 70
            }
        ],

        _resize: function () {
            var center = this.map.getCenter();
            google.maps.event.trigger(this.map, 'resize');
            this.map.panTo(center);
        },

        _create: function () {
            this._super();
            this._renderLayout();
            this._renderData();
            this._loadData();
            this._bindListeners();

            this._resize();
        },

        _bindListeners: function () {

        },

        _renderLayout: function () {
            var strHtml = HBS['gadgets/mapData/mapData']({
                main: true,
                items: framework.languageManager.translations()
            });
            this.element.append(strHtml);
        },

        _loadData: function () {
            var deferred = $.Deferred();
                // context = this;

            // context._getData().done(function () {
            //     context._renderData();
            //     deferred.resolve();
            // });

            return deferred.promise();
        },

        _getData: function () {
            var context = this;

            return framework.serviceManager.exec({
                service: 'map.get',
                success: function () {},
                error: function () {}
            }).always(function () {
                context.hideLoader();
            });
        },

        _renderData: function () {
            var context = this,
                center = {
                    lat: 37.9954745,
                    lng: -97.9575328
                };

            this.map = new google.maps.Map(this.element.find('.container')[0], {
                zoom: this.preferences.zoom || 5,
                center: this.preferences.center || center
            });

            $.each(this.data, function(i, property) {
                var position = {
                        lat: property.coordinates[0],
                        lng: property.coordinates[1]
                    },
                    infoWindow = new google.maps.InfoWindow({
                        content: HBS['gadgets/mapData/mapData']({
                            tooltip: true,
                            property: property,
                            items: framework.languageManager.translations()
                        })
                    }),
                    marker = new google.maps.Marker({
                        position: position,
                        map: context.map,
                        icon: context._getIcon(property)
                    });

                marker.addListener('click', function() {
                    context.map.panTo(marker.position);

                    // if (context.map.zoom >=8) {
                    //     return true;
                    // }


                    // context.map.addListener('zoom_changed', function () {
                    //     if (context.map.zoom >= 8) {
                    //         google.maps.event.clearListeners(context.map, 'zoom_changed');
                    //         return true;
                    //     }
                    //     setTimeout(function () {
                    //         context.map.setZoom(context.map.zoom + 1);
                    //     }, 150);
                    // });

                    context.map.setZoom(8);
                });

                marker.addListener('mouseover', function() {
                    infoWindow.open(context.map, marker);
                });

                marker.addListener('mouseout', function() {
                    infoWindow.close();
                });
            });

            this.hideLoader();
        },

        _getIcon: function (property) {
            if (property.wearTear <= 20) {
                return 'images/maps/darkgreen_MarkerA.png';
            }
            if (property.wearTear <= 40) {
                return 'images/maps/green_MarkerB.png';
            }
            if (property.wearTear <= 60) {
                return 'images/maps/yellow_MarkerC.png';
            }
            if (property.wearTear <= 80) {
                return 'images/maps/orange_MarkerD.png';
            }
            if (property.wearTear <= 100) {
                return 'images/maps/red_MarkerE.png';
            }
        },

        _destroy: function () {
            this.preferences = {
                center: {
                    lat: this.map.getCenter().lat(),
                    lng: this.map.getCenter().lng()
                },
                zoom: this.map.getZoom()
            }
            this.setPreferences();
            this._super();
        }
    });
});