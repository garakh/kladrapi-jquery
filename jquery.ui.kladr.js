(function($){
    $.kladrapi = function(options, callback){
        var kladrapi = 'http://kladr-api.ru/api.php';
        $.getJSON(kladrapi + "?callback=?",
            options,
            function(data) {
                callback && callback(data);
            }
        );
    }

    $.widget("primepix.kladr", $.ui.autocomplete, {
        options: {},
        _create: function() {}
    });
})(jQuery);

