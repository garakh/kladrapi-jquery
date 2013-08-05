(function($){
        $.kladrapi = function( options, callback ){
                var kladrapi = 'http://kladr-api.ru/api.php';
                $.getJSON(kladrapi + "?callback=?",
                        options,
                        function( data ) {
                                callback && callback( data );
                        }
                );
        }

        $.extend( $.ui, {
                kladrObjectType: {
                        REGION: 'region',
                        DISTRICT: 'district',
                        CITY: 'city',
                        STREET: 'street',
                        BUILDING: 'building'
                }
        });

        $.widget("primepix.kladr", $.ui.autocomplete, {
                options: {
                        token: null,
                        key: null,
                        type: $.ui.kladrObjectType.REGION,
                        parentType: $.ui.kladrObjectType.REGION,
                        parentId: null,
                        withParents: false,
                        minLength: 0,
                        label: function( obj, query ){
                                return obj.typeShort + '. ' + obj.name;
                        },
                        value: function( obj, query ){
                                return obj.name;
                        },
                        filter: function( array, term ) {
                                var matcher = new RegExp( '^'+$.ui.autocomplete.escapeRegex(term), "i" );
                                return $.grep( array, function( value ) {
                                        return matcher.test( value.name );
                                });
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
                        if( !this.options.key ) return;

                        var limit = 2000;

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

                        query.limit = limit;

                        var that =this;
                        $.kladrapi( query, function( data ){
                                that.objects = [];
                                var objects = data.result;
                                for( var i in objects ){
                                       var exist = false;
                                       for( var j in that.objects ){
                                                if( that.objects[j].id == objects[i].id ){
                                                        exist = true;
                                                        break;
                                                }
                                       }

                                       if( exist ) continue;
                                       that.objects.push(objects[i]);
                                }
                                
                                console.log(that.objects.length);
                                
                                callback && callback();
                        });
                },

                _create: function() {
                        $.ui.autocomplete.prototype._create.call( this );

                        var that = this;
                        
                        that._dataUpdate();
                        $.ui.autocomplete.filter = this.options.filter;

                        this.source = function( request, response ) {
                                var query = this._key( $.trim( request.term ).toLowerCase() );

                                that._dataUpdate( query );
                                
                                console.log(that.objects.length);

                                var result = [];
                                var objects = $.ui.autocomplete.filter( that.objects, query );
                                for(var i in objects){
                                    result.push({
                                        label: that.options.label( objects[i], query ),
                                        value: that.options.value( objects[i], query ),
                                        obj: objects[i],
                                    });
                                }

                                response(result);
                        };

                        this._renderItem = function( ul, item ) {
                                return $( "<li>" )
                                        .append( $( "<a>" ).html( item.label ) )
                                        .appendTo( ul );
                        };

                        $.ui.autocomplete.escapeRegex = function( value ) {
                                var val = value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
                                return that._key( val ).toLowerCase();
                        };
                },

                destroy: function() {
                        $.ui.autocomplete.prototype.destroy.call( this );
                },
        });
})(jQuery);