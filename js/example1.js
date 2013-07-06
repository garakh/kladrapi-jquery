(function($){
    $(function() {
        $( '[name="location"]' ).kladr({
            token: '51b6e1e267363dc01900000e',
            key: '9f63e8f1c464e5f4745d1e8ee3a7230eb123500d',
            type: $.ui.kladrObjectType.CITY,
            select: function( event, ui ) {
                $( '[name="street"]' ).kladr( 'option', { parentType: $.ui.kladrObjectType.CITY, parentId: ui.item.obj.id } );
            }
        });

        $( '[name="street"]' ).kladr({
            token: '51b6e1e267363dc01900000e',
            key: '9f63e8f1c464e5f4745d1e8ee3a7230eb123500d',
            type: $.ui.kladrObjectType.STREET
        });
    });
})(jQuery);