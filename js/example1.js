(function($){
    $(function() {
            $( '[name="location"]' ).kladr({
                    key: 'demo',
                    type: $.ui.kladrObjectType.CITY,
                    select: function( event, ui ) {
                            $( '[name="street"]' ).kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
                    }
            });

            $( '[name="street"]' ).kladr({
                    key: 'demo',
                    type: $.ui.kladrObjectType.STREET
            });
    });
})(jQuery);