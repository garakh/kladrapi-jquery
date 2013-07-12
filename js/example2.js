(function($){
    $(function() {
        var token = '51dfe5d42fb2b43e3300006e';
        var key = '86a2c2a06f1b2451a87d05512cc2c3edfdf41969';        
        
        var city = $( '[name="city"]' );
        var street = $( '[name="street"]' );
        var building = $( '[name="building"]' );
        var buildingAdd = $( '[name="building-add"]' );

        var map = null;
        var placemark = null;
        var map_created = false;

        var Label = function( obj, query ){
            var label = '';

            if(obj.name){
                if(obj.typeShort){
                    label += '<span class="ac-s2">' + obj.typeShort + '. ' + '</span>';
                }

                if(query.length < obj.name.length){
                    label += '<span class="ac-s">' + obj.name.substr(0, query.length) + '</span>';
                    label += '<span class="ac-s2">' + obj.name.substr(query.length, obj.name.length - query.length) + '</span>';
                } else {
                    label += '<span class="ac-s">' + obj.name + '</span>';
                }
            }

            if(obj.parents){
                for(var k = obj.parents.length-1; k>-1; k--){
                    var parent = obj.parents[k];
                    if(parent.name){
                        if(label) label += '<span class="ac-st">, </span>';
                        label += '<span class="ac-st">' + parent.name + ' ' + parent.typeShort + '.</span>';
                    }
                }
            }

            return label;
        };

        var MapUpdate = function(){
            var zoom = 12;
            var address = '';

            var cityVal = $.trim(city.val());
            if(cityVal){
                var cityObj = city.data( "kladr-obj" );
                if(address) address += ', ';
                address += ( cityObj ? (cityObj.typeShort + ' ') : '' ) + cityVal;
                zoom = 12;
            }

            var streetVal = $.trim(street.val());
            if(streetVal){
                var streetObj = street.data( "kladr-obj" );
                if(address) address += ', ';
                address += ( streetObj ? (streetObj.typeShort + ' ') : '' ) + streetVal;
                zoom = 14;
            }

            var buildingVal = $.trim(building.val());
            if(buildingVal){
                var buildingObj = building.data( "kladr-obj" );
                if(address) address += ', ';
                address += ( buildingObj ? (buildingObj.typeShort + ' ') : '' ) + buildingVal;
                zoom = 16;
            }

            var buildingAddVal = $.trim(buildingAdd.val());
            if(buildingAddVal){
                if(address) address += ', ';
                address += buildingAddVal;
                zoom = 16;
            }

            if(address && map_created){
                var geocode = ymaps.geocode(address);
                geocode.then(function(res){
                    map.geoObjects.each(function (geoObject) {
                            map.geoObjects.remove(geoObject);
                    });

                    var position = res.geoObjects.get(0).geometry.getCoordinates();

                    placemark = new ymaps.Placemark(position, {}, {});

                    map.geoObjects.add(placemark);
                    map.setCenter(position, zoom);
                });
            }
        }

        city.kladr({
            token: token,
            key: key,
            type: $.ui.kladrObjectType.CITY,
            withParents: true,
            label: Label,
            select: function( event, ui ) {
                city.data( "kladr-obj", ui.item.obj );
                city.parent().find( 'label' ).text( ui.item.obj.type );
                street.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
                building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
                MapUpdate();
            }
        });

        street.kladr({
            token: token,
            key: key,
            type: $.ui.kladrObjectType.STREET,
            label: Label,
            select: function( event, ui ) {
                street.data( "kladr-obj", ui.item.obj );
                street.parent().find( 'label' ).text( ui.item.obj.type );
                building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
                MapUpdate();
            }
        });

        building.kladr({
            token: token,
            key: key,
            type: $.ui.kladrObjectType.BUILDING,
            label: Label,
            select: function( event, ui ) {
                building.data( "kladr-obj", ui.item.obj );
                MapUpdate();
            }
        });

        city.add(street).add(building).add(buildingAdd).change(function(){
            MapUpdate();
        });

        ymaps.ready(function(){
            if(map_created) return;
            map_created = true;

            map = new ymaps.Map('map', {
                center: [55.76, 37.64],
                zoom: 12
            });

            map.controls.add('smallZoomControl', { top: 5, left: 5 });
        });
    });
})(jQuery);