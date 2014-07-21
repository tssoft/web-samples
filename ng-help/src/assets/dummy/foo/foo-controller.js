(function () {

    var _scope = {};

    /**
     *
     * @param $scope
     * @constructor
     */
    var FooController = function ($scope, messageService) {
        this.textEditorParams = {
            text: '',
            multiline: true
        }
        var defaultText = 'La-la-la-la-la';
        var sender = 'Foo';
        this.messageSenderParams = {
            sender: sender,
            defaultText: defaultText,
            getCurrentText: function () {
                return me.textEditorParams.text;
            },
            setCurrentText: function (value) {
                me.textEditorParams.text = value;
            }
        };

        this.ignoreOnDrag = 'select';
        var me = this;

        this.save = function () {
            $scope.$emit('message', messageService.make(this.textEditorParams.text ?
                this.textEditorParams.text : defaultText, sender));
            me.textEditorParams.text = '';
        };

        $scope.$watch(function () {
            return me.ignoreOnDrag;
        }, function (newVal, oldVal) {
            var draggable = $('.draggable');
            draggable.find(oldVal).removeClass('draggable-ignore');
            draggable.find(newVal).addClass('draggable-ignore');
        });
    };

    angular.module('dummy.foo')
        .controller('FooController', ['$scope', 'MessageService', FooController]);
})();