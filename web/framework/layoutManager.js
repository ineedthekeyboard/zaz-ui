define([
    'jquery.plugins',
    'framework/preferencesManager',
    'framework/languageManager',
    'settings/globals',
    'settings/layouts',
    'handlebars-helpers'
], function ($,
    preferencesManager,
    languageManager,
    globals,
    layouts,
    HBS) {


    var layoutManager = {

        state: null,
        $layout: null,
        $mainZone: null,

        init: function () {
            this.renderLayout();
        },

        renderLayout: function () {
            this.state = layouts.getUserLayout();
            this.$layout = $('.__layout');

            this.createMainZone();
            if (!window.mobile) {
                this.setState(this.state, this.$mainZone);
            }
            window.layout = this.state;
        },

        getDeepestZone: function (strZone) {
            var $zone = this.$layout.find('[data-zone="' + strZone + '"]');

            if ($zone.children('.zone').length === 0) {
                return strZone;
            }

            var $target = $zone.children('.zone');
            var $nextZone = $target;

            while ($nextZone.length) {
                $target = $nextZone;
                $nextZone = $nextZone.children('.zone');
            }
            return $target.attr('data-zone');
        },

        isZoneDepthValid: function (strZone) {
            var intZoneDepth = strZone.split('-').length;

            if (intZoneDepth && intZoneDepth > layouts.maxZoneDepth) {
                console.warn('Layout: ' + strZone + ' exceeds layouts.maxZoneDepth value of ' + layouts.maxZoneDepth + '.');
                return false;
            }
            return true;
        },

        createMainZone: function () {
            var strHtml = HBS['framework/layoutManager']({
                mainZone: true,
                items: languageManager.translations()
            });
            this.$layout.html(strHtml);
            this.$mainZone = this.$layout.find('.zone[data-zone="main"]');
        },

        setState: function (state, $zone) {
            var strZone;

            strZone = $zone.attr('data-zone');
            if (!this.isZoneDepthValid(strZone)) {
                return true;
            }

            if (state.orientation) {
                $zone.attr('data-orientation', state.orientation);
            }
            if (state.collapsed) {
                $zone.attr('data-collapsed', state.collapsed);
            }
            if (state.size) {
                $zone.attr('data-size', state.size);
            }

            //check for orientation to determine if sub zone is to created
            if (state.orientation) {
                //adding a child zone so remove the zone-drop, zone-meta from self
                $zone.find('> .zone-drop').remove();
                $zone.find('> .zone-meta').remove();

                //if this is main zone then hide the help, logo
                if (strZone === 'main') {
                    this.$layout.find('.zone-help, .zone-logo').hide();
                }

                //create sub zone now
                this.createSubZone($zone, state);
            }

            if (state.prev) {
                this.setState(state.prev, $zone.children('.zone:first'));
            }
            if (state.next) {
                this.setState(state.next, $zone.children('.zone:last'));
            }
        },

        createSubZone: function ($parentZone, state, strNewZone) {
            var strHtml = '',
                strZone = $parentZone.attr('data-zone'),
                subZone = true,
                isVertical = (state.orientation === 'v');

            strHtml = HBS['framework/layoutManager']({
                parentZone: strZone,
                subZone: subZone,
                isVertical: isVertical,
                items: languageManager.translations()
            });

            //remove meta, drop from parent zone before moving content
            $parentZone.find('> .zone-meta').remove();
            $parentZone.find('> .zone-drop').remove();

            if (strZone === 'main') {
                this.$layout.find('.zone-help, .zone-logo').hide();
            }

            //get all panel content from parent zone if any
            var $content = $parentZone.children('.panel');

            //append sub zone template
            $parentZone.append(strHtml);

            //grab the new zone, get sibling and move content to that zone
            var $newZone = layoutManager.$layout.find('.zone [data-zone="' + strNewZone + '"]');
            var $otherZone = $newZone.siblings('.zone');
            $content.appendTo($otherZone);

            if (state.collapsed) {
                //get the zone to collapse
                if (state.collapsed === 'next') {
                    strZone = (state.orientation === 'v') ? strZone + '-bottom' : strZone + '-right';
                } else {
                    strZone = (state.orientation === 'v') ? strZone + '-top' : strZone + '-left';
                }
                //collapse zone will handle sizes in flex/pixels
                //this.collapseZone(strZone, $('.zone[data-zone="' + strZone + '"]'));
                this.collapseZone(strZone);
            } else if (state.size) {
                //force jQuery css to use number on flex key
                $.cssNumber.flex = true;
                $parentZone.find('> .zone:first').css('flex', Math.round(state.size));
                $parentZone.find('> .zone:last').css('flex', 100 - Math.round(state.size));
            }
        }
    };

    if (window.CONFIG.debug) {
        window.layoutManager = layoutManager;
    }
    return layoutManager;
});