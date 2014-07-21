(function () {


    var directive = function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var pressed = false;
                var wrap = $(element);
                var body = $('body');
                var x = 0;
                var y = 0;

                var onMouseDown = function (event) {
                    if (!_.contains(wrap.find(attrs.exclude), $(event.target)[0])) {
                        pressed = true;
                        x = event.pageX;
                        y = event.pageY;
                    }
                };

                var onMouseMove = function (event) {
                    if (pressed) {
                        wrap.offset(function(index, coords){
                            return {
                                top: coords.top - (y - event.pageY),
                                left: coords.left - (x - event.pageX)
                            }
                        });
                        x = event.pageX;
                        y = event.pageY;
                    }
                };

                var onMouseUp = function () {
                    pressed = false;
                };

                wrap.on('mousedown', onMouseDown);
                body.on('mousemove', onMouseMove);
                body.on('mouseup', onMouseUp);

            }
        };
    };

    angular.module('dummy.draggable', [])
        .directive('draggable', directive);
})();
