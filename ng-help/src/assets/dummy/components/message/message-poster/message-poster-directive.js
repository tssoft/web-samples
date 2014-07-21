(function () {

    /**
     *
     * @returns {{restrict: string, link: link}}
     */
    var directive = function (messageService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    var currentText = scope.params.getCurrentText();
                    scope.$emit('message.new.local', messageService.make(currentText ?
                        currentText : scope.params.defaultText, scope.params.sender));
                    scope.params.setCurrentText('');
                    if (attrs.apply === 'true') {
                        scope.$apply();
                    }
                });
            },
            scope: {
                params: '=params'
            }
        };
    };

    angular.module('dummy.messagePoster', [])
        .directive('messagePoster', ['MessageService', directive]);
})();
