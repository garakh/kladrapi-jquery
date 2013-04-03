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
                        key: null,
                        type: $.ui.kladrObjectType.REGION,
                        parentType: $.ui.kladrObjectType.REGION,
                        parentId: null,
                        label: function( obj ){
                                return obj.typeShort + '. ' + obj.name;
                        },
                        value: function( obj ){
                                return obj.name;
                        },
                        filter: function( array, term ) {
                                var matcher = new RegExp( '^'+$.ui.autocomplete.escapeRegex(term), "i" );
                                return $.grep( array, function( value ) {
                                        return matcher.test( value.value );
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
                        if(!this.options.key) return;

                        name = this._key( $.trim( name ).toLowerCase() );
                        if(!name) return;

                        var length = name.length;
                        var limit = 1000;

                        switch(length){
                                case 1: limit = 50; break;
                                case 2: limit = 100; break;
                                case 3: limit = 200; break;
                                case 4: limit = 400; break;
                                case 5: limit = 800; break;
                        }

                        var kladrObjectType = $.ui.kladrObjectType;

                        var query = {};
                        query.key = this.options.key;

                        if(this.options.parentId){
                                var parent = (this.options.parentType ? this.options.parentType : kladrObjectType.REGION)+'Id';
                                query[parent] = this.options.parentId;
                        }

                        query.query = name;

                        var type = this.options.type ? this.options.type : kladrObjectType.REGION;
                        query.contentType = type;

                        query.limit = limit;

                        var that =this;
                        $.kladrapi( query, function( data ){
                                var objects = data.result;
                                var source = [];
                                for(var i in objects){
                                       var label = that.options.label(objects[i]);
                                       var value = that.options.value(objects[i]);

                                       var exist = false;
                                       for(var j in source){
                                                if(source[j].value == value){
                                                        exist = true;
                                                        break;
                                                }
                                       }

                                       if(exist) continue;

                                       source.push({
                                            label: label,
                                            value: value,
                                            obj: objects[i],
                                       });
                                }
                                that.objects = source;
                                callback && callback();
                        });
                },

                _create: function() {
                        $.ui.autocomplete.prototype._create.call( this );

                        var that = this;
                        $.ui.autocomplete.filter = this.options.filter;

                        this.source = function( request, response ) {
                                that._dataUpdate( request.term );
                                response( $.ui.autocomplete.filter( that.objects, request.term ) );
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