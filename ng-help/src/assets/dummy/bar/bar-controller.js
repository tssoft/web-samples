(function () {

    /**
     * @param $scope
     * @constructor
     */
    var BarController = function () {
        var me = this;
        this.textEditorParams = {
            text: '',
            multiline: false
        }
        this.messageSenderParams = {
            sender: 'Bar',
            defaultText: 'Yo momma is so fat she can\'t be injected',
            getCurrentText: function () {
                return me.textEditorParams.text;
            },
            setCurrentText: function (value) {
                me.textEditorParams.text = value;
            }
        };
    };

    angular.module('dummy.bar')
        .controller('BarController', [BarController]);

})();
