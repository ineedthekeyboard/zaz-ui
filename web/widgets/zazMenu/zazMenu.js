define([
    'jquery.plugins',
    'css!widgets/zazMenu/zazMenu'
], function ($) {

    /**
     * @namespace zazMenu
     * @classdesc A widget that creates a simgle level menu.
     */
    return $.widget('zaz.zazMenu', {
        options: {
            selector: null,
            useOffset: true,
            useMousePosition: false,
            menuitem: '.item',
            event: null,
            hideAfterClick: true,
            returnElement: null,
            focus: false
        },

        _setDefaults: function () {
            window.lastElement = $(this.options.selector);
            if (!this.options.focus) {
                this.element.attr('tabindex', '0');
            }
        },

        _create: function () {
            this._super();

            this._setDefaults();
            this._renderLayout();
            this._bindListeners();
            this._open();
        },

        _renderLayout: function () {
            this.element.appendTo(document.body);
            this._setPosition();
        },

        _setPosition: function () {
            var $element = $(this.options.selector),
                $menu = this.element,
                position = $element.position(),
                intTop = position.top + $element.height(),
                intLeft = position.left,
                onRight = false,
                intMaxZIndex = $.maxZIndex();


            //set aria-expanded attribute for strSelector
            if ($element.hasAttr('aria-expanded')) {
                $element.attr('aria-expanded', true);
            }

            if (this.options.useOffset) {
                position = $element.offset();
                intTop = (typeof this.options.topOffset !== 'undefined') ? (position.top + this.options.topOffset) : (position.top + $element.outerHeight());
                intLeft = (typeof this.options.leftOffset !== 'undefined') ? (position.left + this.options.leftOffset) : position.left;
            }

            if (this.options.useMousePosition) {
                intTop = this.options.event.pageY;
                intLeft = this.options.event.pageX;
            }

            //re-adjust the top and left based on available window width and height
            if ((intTop + $menu.outerHeight()) > $(window).height()) {
                intTop = $(window).height() - $menu.outerHeight();
            }
            if ((intLeft + $menu.outerWidth()) > $(window).width()) {
                intLeft = intLeft - $menu.outerWidth() + $element.width();
                onRight = true;
            }

            $menu.attr('aria-hidden', 'false');
            if (!onRight) {
                $menu.css({
                    'top': intTop,
                    'left': intLeft,
                    'right': 'initial',
                    'z-index': intMaxZIndex
                });
            } else {
                $menu.css({
                    'top': intTop,
                    'left': 'initial',
                    'right': 0,
                    'z-index': intMaxZIndex
                });
            }
        },

        _open: function () {
            var $element = $(this.options.selector),
                $menu = this.element,
                items = $menu.find('[tabindex=0]'),
                context = this;

            //set aria-expanded attribute for strSelector
            if ($element.hasAttr('aria-expanded')) {
                $element.attr('aria-expanded', true);
            }
            $menu.attr('aria-hidden', 'false');

            this.element.addClass('zaz-menu-active');
            // $menu.fadeIn(0, function () {
                if (context.options.focus) {
                    $menu.find(context.options.menuitem).first().focus();
                } else {
                    $menu.focus();
                }
            // });
        },

        _bindListeners: function () {
            var $element = $(this.options.selector),
                $menu = this.element,
                items = $menu.find('[tabindex=0]'),
                context = this;


            $menu.off('keyup');
            $menu.on('keyup', function (e) {
                var item, pos;
                e.preventDefault();

                switch (e.keyCode) {
                    case $.ui.keyCode.ESCAPE:
                        context._close();
                        break;
                    case $.ui.keyCode.SPACE:
                    case $.ui.keyCode.ENTER:
                        $(this).find(':focus').trigger('click');
                        break;
                    case $.ui.keyCode.LEFT:
                    case $.ui.keyCode.UP:

                        item = $(this).find(':focus');
                        pos = items.index(item) - 1;
                        if (pos > -1) {
                            $(items[pos]).attr('tabindex', 0);
                            $(items[pos]).focus();
                        } else {
                            items.last().attr('tabindex', 0);
                            items.last().focus();
                        }
                        break;
                    case $.ui.keyCode.RIGHT:
                    case $.ui.keyCode.DOWN:
                        item = $(this).find(':focus');
                        pos = items.index(item) + 1;
                        if (pos < items.length) {
                            $(items[pos]).attr('tabindex', 0);
                            $(items[pos]).focus();
                        } else {
                            items.first().attr('tabindex', 0);
                            items.first().focus();
                        }
                        break;
                    case $.ui.keyCode.TAB:
                        if (e.shiftKey) {
                            item = $(this).find(':focus');
                            pos = items.index(item) - 1;
                            if (pos > -1) {
                                $(items[pos]).attr('tabindex', 0);
                                $(items[pos]).focus();
                            } else {
                                items.last().attr('tabindex', 0);
                                items.last().focus();
                            }
                            return true;
                        }

                        item = $(this).find(':focus');
                        pos = items.index(item) + 1;
                        if (pos < items.length) {
                            $(items[pos]).attr('tabindex', 0);
                            $(items[pos]).focus();
                        } else {
                            items.first().attr('tabindex', 0);
                            items.first().focus();
                        }
                        break;
                    default:
                        break;
                }
            });

            $menu.find('.item').off('click');
            $menu.find('.item').on('click', function (e) {
                var data = $(this).data();
                context._trigger('item-click', e, [data]);
                if (!data.sustain) {
                    context._close();
                }
            });

            $(document).mousedown(function (e) {
                if (!$menu.is(e.target) && $menu.has(e.target).length === 0) {
                    context._close();
                }
            });
        },

        _close: function () {
            var $element = $(this.options.selector),
                $menu = this.element,
                context = this;

            $menu.attr('aria-hidden', 'true');
            $menu.hide();
            if ($element.hasAttr('aria-expanded')) {
                $element.attr('aria-expanded', false);
            }
            $element.focus();
            $menu.remove();
        },

        _handleEscape: function () {}
    });
});