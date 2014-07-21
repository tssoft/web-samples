(function () {

    var MessageManagerFactory = function (messageService, $timeout) {

        var _filterNew = function (messages) {
            return   _.filter(messages, function (message) {
                return !message.id;
            });
        };

        var _private = {
            hideStatusMessage: (function () {
                var _hide = function (instance) {
                    instance.timeout(function () {
                        instance.makingRequest = false;
                    }, 1000, true);
                };

                return function (instance) {
                    return function () {
                        _hide(instance);
                    };
                };
            })(),

            defaultRequestCallback: (function () {
                var _do = function (instance, data, status) {
                    instance.requestStatus = status;
                };
                return function (instance) {
                    return function (data, status) {
                        _do(instance, data, status);
                    };
                };
            })()
        };


        /**
         * @param messagesContainer
         * @param messageService
         * @param $timeout
         * @constructor
         */
        var MessagesManager = function (messagesContainer, messageService, $timeout) {
            this.messagesContainer = messagesContainer;
            this.messageService = messageService;
            this.timeout = $timeout;
            var me = this;
        }

        /**
         * Posts all messages stored in $rootScope to the server
         */
        MessagesManager.prototype.saveMessages = function () {
            var me = this;
            me.makingRequest = true;
            me.requestStatus = 'waiting...';
            me.messageService
                .post(_filterNew(me.messagesContainer.getMessages()))
                .success(_private.defaultRequestCallback(me))
                .error(_private.defaultRequestCallback(me))
                .finally(_private.hideStatusMessage(me));
        };


        /**
         * Deletes all messages from DB
         */
        MessagesManager.prototype.deleteMessages = function () {
            var me = this;
            me.makingRequest = true;
            me.requestStatus = 'waiting...';
            me.messageService.delete()
                .success(function (data, status) {
                    _private.defaultRequestCallback(me)(data, status);
                    me.messagesContainer.setMessages([]);
                })
                .error(_private.defaultRequestCallback(me))
                .finally(_private.hideStatusMessage(me));
        };

        /**
         * Fetches all messages and replaces current messages in messageContainer with request result
         */
        MessagesManager.prototype.getMessages = function () {
            var me = this;
            me.makingRequest = true;
            me.requestStatus = 'waiting...';
            me.messageService
                .get()
                .success(function (data, status) {
                    me.messagesContainer.setMessages(_.map(data.items, me.messageService.convert));
                    _private.defaultRequestCallback(me)(data, status);
                })
                .error(_private.defaultRequestCallback(me))
                .finally(_private.hideStatusMessage(me));
        };

        return {

            /**
             * @constructs
             * @param messagesContainer - MUST have a getter and a setter methods for messages array
             * @returns {MessagesManager}
             */
            make: function (messagesContainer) {
                return new MessagesManager(messagesContainer, messageService, $timeout);
            }
        }
    }

    angular.module('dummy.message').factory('MessageManagerFactory', ['MessageService', '$timeout', MessageManagerFactory])

})();