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
                        type: $.ui.kladrObjectType.REGION,
                        parentType: $.ui.kladrObjectType.REGION,
                        parentId: null,
                        search: '',
                        limit: 10
                },

                objects: [],

                _key: function(val){
                        var s1 = "qazwsxedcrfvtgbyhnujmik,ol.p;[']- ";
                        var s2 = "йфяцычувскамепинртгоьшлбщдюзжхэъ- ";

                        var s12 = "QAZWSXEDCRFVTGBYHNUJMIK<OL>P:{\"} ";
                        var s22 = "ЙФЯЦЫЧУВСКАМЕПИНРТГОЬШЛБЩДЮЗЖХЭЪ ";

                        var strNew = '';
                        var ch;
                        var index;
                        for( var i=0; i<val.length; i++ ){
                                ch = val[i];

                                if(s2.indexOf(ch) > -1){
                                        strNew += ch;
                                        continue;
                                }

                                if(s22.indexOf(ch) > -1){
                                        strNew += ch;
                                        continue;
                                }

                                index = s1.indexOf(ch);
                                if(index > -1){
                                        strNew += s2[index];
                                        continue;
                                }

                                index = s12.indexOf(ch);
                                if(index > -1){
                                        strNew += s22[index];
                                        continue;
                                }
                        }

                        return strNew;
                },

                _dataUpdate: function(name, callback){
                        name = this._key($.trim(name).toLowerCase());
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

                        var query = {};
                        if(this.options.parentId){
                                var parent = (this.options.parentType ? this.options.parentType : kladrObjectType.REGION)+'Id';
                                query[parent] = this.options.parentId;
                        }

                        query.query = name;

                        var type = this.options.type ? this.options.type : kladrObjectType.REGION;
                        query.contentType = type;

                        query.limit = limit;

                        var that =this;
                        $.kladrapi(query, function(data){
                                var objects = data.result;
                                var source = [];
                                for(var i in objects){
                                       var value = objects[i].name;

                                       var exist = false;
                                       for(var j in source){
                                                if(source[j].value == value){
                                                        exist = true;
                                                        break;
                                                }
                                       }

                                       if(exist) continue;
                                       
                                       source.push({
                                            label: value,
                                            value: value,
                                       });
                                }
                                that.objects = source;
                                callback && callback();
                        });
                },

                _create: function() {
                        $.ui.autocomplete.prototype._create.call(this);
                        var kladrObjectType = $.ui.kladrObjectType;

                        var query = {};
                        if(this.options.parentId){
                                var parent = (this.options.parentType ? this.options.parentType : kladrObjectType.REGION)+'Id';
                                query[parent] = this.options.parentId;
                        }

                        var type = this.options.type ? this.options.type : kladrObjectType.REGION;
                        query.contentType = type;

                        if(this.options.limit){
                                query.limit = this.options.limit;
                        }

                        var that = this;
                        this.source = function( request, response ) {
                                that._dataUpdate(request.term);
                                response( $.ui.autocomplete.filter( that.objects, request.term ) );
                        };
                },

                destroy: function() {
                        $.ui.autocomplete.prototype.destroy.call(this);
                },
        });
})(jQuery);

