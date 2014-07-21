(function () {

    /**
     *
     * @param {Object} $http - angular $http service
     * @param {Object} - UrlConfig constant service
     * @constructor
     */

    var MessageService = function ($http, urlConfig) {

        var url = urlConfig.messages;

        /**
         *
         * @param {string} text - message content
         * @param {string} sender - name of message author
         * @constructor
         */
        var Message = function (text, sender, date, id) {
            this.text = text;
            this.sender = sender;
            this.date = date ? date : new Date();
            this.id = id ? id : null;
        };

        /**
         * @returns {string}
         */
        Message.prototype.toString = function () {
            return this.text + ' [' + this.sender + ']';
        };

        /**
         *
         * @param {string} text
         * @param {string} sender
         * @param {Date | optional} date
         * @returns {Message}
         */
        this.make = function (text, sender, date) {
            return new Message(text, sender, date);
        };

        /**
         * Create instance of Message from persisted instance
         * @param dbMessage
         * @returns {Message}
         */
        this.convert = function (dbMessage) {
            return new Message(dbMessage.text, dbMessage.sender, dbMessage.date, dbMessage._id);
        };

        /**
         * Posts a collection of messages to the server
         * @param messages - array of messages to post
         * @returns {*|HttpPromise}
         */
        this.post = function (messages) {
            return $http.post(url, {
                messages: messages
            });
        };

        this.delete = function () {
            return $http.delete(url);
        }


        /**
         * Get all messages from the server
         * @returns {*|HttpPromise}
         */
        this.get = function () {
            return $http.get(url);
        };

    };

    angular.module('dummy.message').service('MessageService', ['$http', 'UrlConfig', MessageService]);

})();