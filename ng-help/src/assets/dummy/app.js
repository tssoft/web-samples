(function () {

    var configuration = function ($routeProvider) {
        $routeProvider
            .when('/bar', {
                templateUrl: 'dummy/bar/bar.html'
            })
            .when('/foo', {
                templateUrl: 'dummy/foo/foo.html'
            })
            .when('/', {
                templateUrl: 'dummy/app.html'
            });
    };

    var run = function ($rootScope) {
        $rootScope.messages = [];
    };

    angular.module('dummy', ['dummy.bar', 'dummy.foo', 'dummy.config',
        'dummy.message', 'dummy.draggable', 'dummy.messagePoster',
        'dummy.collapsable', 'dummy.textEditor', 'ngAnimate', 'ngRoute'])
        .config(['$routeProvider', configuration])
        .run(['$rootScope', run]);

})();