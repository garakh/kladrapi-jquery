(function($) {    
    $.kladrapi = function( options, callback ){
        var kladrapi = 'http://kladr-api.ru/api.php';
        $.getJSON(kladrapi + "?callback=?",
            options,
            function( data ) {
                callback && callback( data );
            }
        );
    };
    
    $.ui = {
        kladrObjectType: {
            REGION: 'region',
            DISTRICT: 'district',
            CITY: 'city',
            STREET: 'street',
            BUILDING: 'building'
        }
    };
    
    $.kladrCheck = function( options, callback ){
        var query = {
            token: options.token,
            key: options.key,
            query: options.value,
            contentType: options.type,
            limit: 1,
        };
        
        if(options.parentId){
            switch(options.parentType){
                case $.ui.kladrObjectType.REGION:
                    query['regionId'] = options.parentId; break;
                case $.ui.kladrObjectType.DISTRICT:
                    query['districtId'] = options.parentId; break;
                case $.ui.kladrObjectType.CITY:
                    query['cityId'] = options.parentId; break;
                case $.ui.kladrObjectType.STREET:
                    query['streetId'] = options.parentId; break;
                case $.ui.kladrObjectType.BUILDING:
                    query['buildingId'] = options.parentId; break;
            }
        }
        
        $.kladrapi(query, function(res){
            if(res && res.result.length){
                callback && callback(res.result[0]);
            } else {
                callback && callback();
            }
        });
    };
    
    $.fn.kladr = function(opt, callback) {
        var options = $.extend( {
            token: null,
            key: null,
            type: $.ui.kladrObjectType.REGION,
            parentType: $.ui.kladrObjectType.REGION,
            parentId: null,
            withParents: false,
            minLength: 0,
            limit: 50,
            label: function( obj, query ){
                return obj.typeShort + '. ' + obj.name;
            },
            value: function( obj, query ){
                return obj.name;
            }
        }, opt);
        
        return this.each(function() {
            var $this = $(this);
            
            $this.typeahead({
                delay: 3000,
                minLength: options.minLength,
                items: options.limit,
                property: 'name',
                
                source: function(text, process) {
                    if( !options.token ) return;
                    if( !options.key ) return;
                    if( !text ) return;
                    
                    var kladrObjectType = $.ui.kladrObjectType;
                    
                    var query = {};
                    
                    query.token = options.token;
                    query.key = options.key;
                    
                    if( options.parentId ){
                        var parent = ( options.parentType ? options.parentType : $.ui.kladrObjectType.REGION )+'Id';
                        query[parent] = options.parentId;
                    }
                    
                    if( options.withParents ){
                        query.withParent = 1;
                    }
                    
                    query.query = text;
                    
                    var type = options.type ? options.type : $.ui.kladrObjectType.REGION;
                    query.contentType = type;
                    
                    query.limit = options.limit;
                    
                    $.kladrapi( query, function( response ){

                        var data = [];
                        $.map(response.result, function(itm){
                            var item = $.extend(itm, {
                                toString: function () {
                                    return JSON.stringify(this);
                                },
                                toLowerCase: function () {
                                    return this.name.toLowerCase();
                                },
                                indexOf: function (string) {
                                    return String.prototype.indexOf.apply(this.name, arguments);
                                },
                                replace: function (string) {
                                    return String.prototype.replace.apply(this.name, arguments);
                                }
                            });
                            data.push(item);
                        });
                        return process(data);
                        /*
                        var data = [];
                        $.each(response.result, function(i, item) {
                            data.push(item.name);
                            suggestions[item.name] = item;
                        })
                        return process(data);
                        */
                    });
                },            
                highlighter: function(obj) {
                    return options.label( obj )
                },
                updater: function (obj) {
                    var obj = JSON.parse(obj);
                    options.select( obj, $this );
                    return options.value( obj );
                }
            })
        })
    }
})( jQuery );
