(function () {

    /**
     *
     * @returns {{restrict: string, link: link}}
     */
    var directive = function () {
        return {
            restrict: 'E',
            scope: {
                getMessages: '&messagesGetter'
            },
            controller: 'MessageListController',
            templateUrl: 'dummy/components/message/message-list/message-list.html',
            replace: true
        };
    };


    var sortableFields = ['text', 'sender', 'date'];

    var MessageListController = function ($scope) {
        $scope.sortableFields = sortableFields;
        $scope.sortBy = 'date';

        $scope.messages = [];

        $scope.$watchCollection('getMessages()', function (newValue) {
            $scope.messages = newValue;
        });
    };

    angular.module('dummy.message.messageList', [])
        .directive('messageList', directive)
        .controller('MessageListController', ['$scope', MessageListController]);
})();
