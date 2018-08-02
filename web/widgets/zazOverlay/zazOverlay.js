define([
    'jquery.plugins',
    'css!widgets/zazOverlay/zazOverlay'
], function ($) {

    /**
     * @namespace zazOverlay 
     * @classdesc A widget that creates an overlay.
     */
    return $.widget('zaz.zazOverlay', {
        options: {
            modal: true,
            title: 'Overlay',
            hide: {
                enabled: false,
                delay: 3000
            },
            color: {
                background: '#CCCCCC',
                opacity: '0.5'
            },
            escape: {
                enabled: true
            },
            animation: {
                enabled: true,
                delay: 200
            },
            drag: {
                enabled: true,
                handle: '.zaz-overlay-header',
                containment: 'document'
            },
            returnElement: null
        },

        close: function () {
            this._close();
        },

        _setDefaults: function () {
            var context = this,
                returnElement = window.lastElement || document.activeElement;

            //set returnElement
            this.options.returnElement = this.options.returnElement || returnElement;

            //if auto hide is enabled
            if (this.options.hide.enabled) {
                window.setTimeout(function () {
                    context._close();
                }, this.options.hide.delay);
            }

            this.element.attr('tab-index', '0');
        },

        _create: function () {
            this._super();

            this._setDefaults();
            this._renderBackground();
            this._renderLayout();
            this._bindListeners();
            this._open();
        },

        _renderBackground: function () {
            var $background = $('.zaz-overlay-background'),
                intMaxZIndex;

            if (!this.options.modal) {
                return;
            }

            if (!$background.length) {
                $background = $('<div>').addClass('zaz-overlay-background');
                $background.appendTo('body');
            }
            intMaxZIndex = $.maxZIndex();
            $background.css({
                'z-index': intMaxZIndex,
                'background-color': this.options.color.background,
                'opacity': this.options.color.opacity
            });
        },

        _renderLayout: function () {
            $('.zaz-overlay').removeClass('zaz-overlay-active');
            if (this.options.title !== '') {
                this.element.find('.zaz-overlay-header-title').html(this.options.title);
                this.element.attr('aria-label', this.options.title);
            }
        },

        _open: function () {
            var context = this,
                $dragHandle,
                intMaxZIndex = $.maxZIndex();

            this.element.css({
                'z-index': intMaxZIndex
            });
            //set draggable if handle is found
            $dragHandle = this.element.find(this.options.drag.handle);
            if ($dragHandle.length) {
                $dragHandle.css({
                    cursor: 'move'
                });
                context.element.draggable({
                    handle: this.options.drag.handle,
                    containment: this.options.drag.containment
                });
            }
            if (this._trigger('before-open')) {
                if (context.options.modal) {
                    $('.zaz-overlay-background').fadeIn(context.options.animation.delay / 2);
                }
                // this.element.fadeIn(context.options.animation.delay, function () {
                this.element.addClass('zaz-overlay-active');
                context._resize();
                context._trigger('open');
                context.element.focus();
                // });
            }
        },

        _close: function () {
            var context = this;

            //hide the overlay
            if (!this._trigger('before-close')) {
                return true;
            }

            this.element.removeClass('zaz-overlay-active');

            //hide the overlay background
            if (this.options.modal) {
                $('.zaz-overlay-background').hide();
            }
            window.setTimeout(function () {
                $(context.options.returnElement).focus();
                context._trigger('close');
                context.element.remove();
            }, 200);
        },

        _resize: function () {
            var intHeight = this.element.height(),
                intWidth = this.element.width(),
                intTop,
                intLeft;

            intTop = ($(window).height() - intHeight) / 2;
            intLeft = ($(window).width() - intWidth) / 2;
            this.element.css({
                'top': intTop,
                'left': intLeft
            });
        },

        _setCircularTab: function () {
            var $firstElement = this.element.find('.zaz-overlay-header-title');
            var $lastElement = this.element.find('.zaz-overlay-footer button').last();

            $lastElement.off('keydown.zaz-overlay');
            $lastElement.on('keydown.zaz-overlay', function (e) {
                if ((e.which === 9 && !e.shiftKey)) {
                    e.preventDefault();
                    $firstElement.focus();
                }
            });

            $firstElement.off('keydown.zaz-overlay');
            $firstElement.on('keydown.zaz-overlay', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    $lastElement.focus();
                }
            });
        },

        _bindListeners: function () {
            var context = this;

            this._setCircularTab();

            $(window).on('resized', function () {
                context._resize();
            });


            this.element.off('click', '.zaz-overlay-header-close');
            this.element.on('click', '.zaz-overlay-header-close', function () {
                context._close();
            });

            this.element.on('click', '.zaz-overlay-footer button', function (e) {
                var data = $(this).data();
                context._trigger('button-click', null, [data]);
            });

            this.element.off('keyup');
            this.element.on('keyup', function (e) {
                context._handleKeyUp(e);
            });

            /* focus overlay when background is clicked if visible */
            if (this.options.modal) {
                $(document.body).off('click.zaz-overlay');
                $(document.body).on('click.zaz-overlay', '.zaz-overlay-background', function () {
                    context.element.focus();
                });
            }
        },

        _handleKeyUp: function (e) {
            if (e.keyCode === $.ui.keyCode.ESCAPE && this.options.escape.enabled) {
                this._close();
            }
        }
    });
});