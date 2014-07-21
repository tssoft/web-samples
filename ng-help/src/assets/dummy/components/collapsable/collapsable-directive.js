(function () {

    var directive = function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {

                scope.toggle = function () {
                    scope.collapsed = !scope.collapsed;
                }
                scope.title = attrs.title;
            },
            transclude: true,
            templateUrl: 'dummy/components/collapsable/collapsable.html'
        }
    };

    angular.module('dummy.collapsable', [])
        .directive('collapsable', [directive]);

})()