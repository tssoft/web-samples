(function () {

    var _rootScope = undefined;

    /**
     * @param $scope
     * @param $rootScope
     * @param messageManagerFactory
     * @constructor
     */
    var AppController = function ($scope, messageManagerFactory) {
        var me = this;
        me.saidHi = false;
        $scope.$on('message.new.local', function (event, args) {
            me.messages.push(args);
        });

        me.messageManager = messageManagerFactory.make(this);

        $scope.someBoolean = true;
        $scope.anotherBoolean = true;
        me.someBoolean = true;
        $scope.wrap = {
            someBoolean: true
        }

        me.messages = [];
    };

    /**
     * @returns {Array} of locally stored messages
     */
    AppController.prototype.getMessages = function () {
        return this.messages;
    };

    /**
     * Sets messages array in $rootScope
     * @param {Array} messages
     */
    AppController.prototype.setMessages = function (messages) {
        this.messages = messages;
    };

    /**
     * Not much, just saying Hi
     */
    AppController.prototype.sayHi = function () {
        this.greeting = this.saidHi ? 'Watcha doin\'?' : 'Sup, bro?';
        this.saidHi = true;
    };


    angular.module('dummy')
        .controller('AppController', ['$scope', 'MessageManagerFactory', AppController]);
})();
