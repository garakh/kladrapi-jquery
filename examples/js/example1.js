(function($){
    $(function() {
        $( '[name="location"]' ).kladr({
            token: '51dfe5d42fb2b43e3300006e',
            key: '86a2c2a06f1b2451a87d05512cc2c3edfdf41969',
            type: $.ui.kladrObjectType.CITY,
            select: function( event, ui ) {
                $( '[name="street"]' ).kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
            }
        });

        $( '[name="street"]' ).kladr({
            token: '51dfe5d42fb2b43e3300006e',
            key: '86a2c2a06f1b2451a87d05512cc2c3edfdf41969',
            type: $.ui.kladrObjectType.STREET
        });
    });
})(jQuery);