$.kladrapi = function(options, callback){
    var kladrapi = 'http://kladr-api.ru/api.php';
    $.getJSON(kladrapi + "?callback=?",
        options,
        function(data) {
            callback && callback(data);
        }
    );
}