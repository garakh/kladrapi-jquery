(function($){
        $.kladrapi = function( options, callback ){
                var kladrapi = 'http://kladr-api.ru/api.php';
                $.getJSON(kladrapi + "?callback=?",
                        options,
                        function( data ) {
                                callback && callback( data );
                        }
                );
        };
        
        $.extend( $.ui, {
                kladrObjectType: {
                        REGION: 'region',
                        DISTRICT: 'district',
                        CITY: 'city',
                        STREET: 'street',
                        BUILDING: 'building'
                }
        });
        
        $.kladrCheck = function( options, callback ){
                var query = {
                        token: options.token,
                        key: options.key,
                        query: options.value,
                        contentType: options.type,
                        limit: 1,
                };
        
                if( options.parentId ){
                        var parent = ( options.parentType ? options.parentType : $.ui.kladrObjectType.REGION )+'Id';
                        query[parent] = options.parentId;
                }
            
                $.kladrapi(query, function(res){
                        if(res && res.result.length){
                               callback && callback(res.result[0]); 
                        } else {
                               callback && callback();
                        }
                });
        };

        $.widget("primepix.kladr", $.ui.autocomplete, {
                options: {
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
                },

                objects: [],

                _key: function( val ){
                        var s1 = "1234567890qazwsxedcrfvtgbyhnujmik,ol.p;[']- ";
                        var s2 = "1234567890йфяцычувскамепинртгоьшлбщдюзжхэъ- ";

                        var s12 = "QAZWSXEDCRFVTGBYHNUJMIK<OL>P:{\"} ";
                        var s22 = "ЙФЯЦЫЧУВСКАМЕПИНРТГОЬШЛБЩДЮЗЖХЭЪ ";

                        var strNew = '';
                        var ch;
                        var index;
                        for( var i=0; i<val.length; i++ ){
                                ch = val[i];

                                if(s2.indexOf( ch ) > -1){
                                        strNew += ch;
                                        continue;
                                }

                                if(s22.indexOf( ch ) > -1){
                                        strNew += ch;
                                        continue;
                                }

                                index = s1.indexOf( ch );
                                if(index > -1){
                                        strNew += s2[index];
                                        continue;
                                }

                                index = s12.indexOf( ch );
                                if(index > -1){
                                        strNew += s22[index];
                                        continue;
                                }
                        }

                        return strNew;
                },

                _dataUpdate: function( name, callback ){
                        if( !this.options.token ) return;
                        if( !this.options.key ) return;
                        if( !name ) return;
                        
                        this.element.trigger('downloadStart');
                        
                        var kladrObjectType = $.ui.kladrObjectType;
                        
                        var query = {};
                        
                        query.token = this.options.token;
                        query.key = this.options.key;

                        if( this.options.parentId ){
                                var parent = ( this.options.parentType ? this.options.parentType : kladrObjectType.REGION )+'Id';
                                query[parent] = this.options.parentId;
                        }

                        if( this.options.withParents ){
                                query.withParent = 1;
                        }

                        query.query = name;

                        var type = this.options.type ? this.options.type : kladrObjectType.REGION;
                        query.contentType = type;

                        query.limit = this.options.limit;

                        var that = this;
                        $.kladrapi( query, function( data ){
                                that.objects = data.result;
                                that.element.trigger('downloadStop');
                                callback && callback();
                        });
                },

                _create: function() {
                        $.ui.autocomplete.prototype._create.call( this );

                        var that = this;
                        this.source = function( request, response ) {
                                var query = this._key( $.trim( request.term ).toLowerCase() );                                
                                if(!query) response(null);

                                that._dataUpdate( query, function(){
                                    var result = [];
                                    for(var i in that.objects){
                                        result.push({
                                            label: that.options.label( that.objects[i], query ),
                                            value: that.options.value( that.objects[i], query ),
                                            obj: that.objects[i],
                                        });
                                    }

                                    response(result);
                                });
                        };

                        this._renderItem = function( ul, item ) {
                                return $( "<li>" )
                                        .append( $( "<a>" ).html( item.label ) )
                                        .appendTo( ul );
                        };
                },

                destroy: function() {
                        $.ui.autocomplete.prototype.destroy.call( this );
                },
        });
})(jQuery);
