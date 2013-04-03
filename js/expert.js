$(function() {
        var city = $( '[name="city"]' );
        var street = $( '[name="street"]' );
        var building = $( '[name="building"]' );

        var label = function( obj, query ){
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

        city.kladr({
                key: 'demo',
                type: $.ui.kladrObjectType.CITY,
                withParents: true,
                label: label,
                select: function( event, ui ) {
                    street.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
                    building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
                }
        });

        street.kladr({
                key: 'demo',
                type: $.ui.kladrObjectType.STREET,
                label: label,
                select: function( event, ui ) {
                    building.kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
                }
        });

        building.kladr({
                key: 'demo',
                type: $.ui.kladrObjectType.BUILDING,
                label: label
        });
});