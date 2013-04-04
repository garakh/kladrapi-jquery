Primepix КЛАДР
==============

Primepix КЛАДР – виджет jQuery UI для автодополнения адреса при вводе.
Виджет унаследован от $.ui.autocomplete, в качестве источника данных используется сервис [kladr-api.ru] [1]

Опции виджета
-------------

*key* – ключ для доступа к сервису kladr-api.ru, по умолчанию равен null

*type* – тип объектов для подстановки, по умолчанию *$.ui.kladrObjectType.REGION*

*parentType* – тип родительского объекта для ограничения области поиска, по умолчанию *$.ui.kladrObjectType.REGION*

*parentId* – код родительского объекта для ограничения области поиска, по умолчанию равен null - область поиска не ограничивается

*withParents* – получить объект вместе с родителями, по умолчанию false

*label* = function( obj, query) { return label; } – функция для получения подписей, в качестве параметров принимает obj – объект КЛАДР, query – текущее значение поля ввода

*value* = function( obj, query) { return label; } – функция для получения подставляемых значений, в качестве параметров принимает obj – объект КЛАДР, query – текущее значение поля ввода

*filter* = function( array, term ){ return array; } – функция для фильтрации вариантов подстановки.

*select* = function( event, ui ){} – функция вызываемая при событии выбора пользователем значения для автодополнения, в поле ui.item.obj – передаётся выбранный пользователем объект КЛАДР

Перечисление $.ui.kladrObjectType
---------------------------------

*$.ui.kladrObjectType.REGION*  -  область, регион
*$.ui.kladrObjectType.DISTRICT*  -  район
*$.ui.kladrObjectType.CITY*  -  населённый пункт
*$.ui.kladrObjectType.STREET*  -  улица
*$.ui.kladrObjectType.BUILDING* -  дом, строение


[1]: http://kladr-api.ru/        "КЛАДР API"