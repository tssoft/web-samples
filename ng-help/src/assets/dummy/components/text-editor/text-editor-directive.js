(function () {

    /**
     *
     * @returns {{restrict: string, link: link}}
     */
    var directive = function () {
        return {
            restrict: 'E',
            scope: {
                params: '=params'
            },
            controller: 'TextEditorController',
            templateUrl: 'dummy/components/text-editor/text-editor-template.html',
            replace: true
        };
    };

    var TextEditorController = function () {

    };

    angular.module('dummy.textEditor', [])
        .directive('textEditor', directive)
        .controller('TextEditorController', [TextEditorController]);
})();
