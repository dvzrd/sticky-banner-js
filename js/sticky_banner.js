/**
 * Defines a global namespace to preserve external scope.
 *
 * 1. The namespace can be modified locally and isn't
 *    overwritten outside of this function's context.
 * 2. The value of undefined is guaranteed to be truly
 *    undefined. This is to avoid issues with undefined being
 *    mutable pre-ES5.
 *
 * @param Kargo is used as the global namespace for this script.
 * @param undefined is the true value of undefined passed to the inner component.
 */
(function (Kargo, undefined) {
    'use strict';

    /**
     * Object literal for storing constants.
     *
     * 1. Configure script settings (i.e., debug).
     * 2. HTML that needs to be created using JavaScript.
     * 3. Relative banner settings (i.e., elements, classes, and default config).
     * 4. Repeated unique values (i.e., DOM query selectors).
     */
    Kargo.config = {
        debug: true,
        banners: {
            containerElement: 'aside',
            containerId: 'kargo-banners',
            hideClass: 'hidden',
            sticky: {
                element: 'figure',
                class: 'banner-sticky',
                config: {
                    position: 'top',
                    hide: false
                }
            }
        },
        selectors: {
            contentContainer: '.main',
            stickyBlocker: '.blocker'
        }
    };

    /**
     * Singelton function for creating object instances of banner.
     *
     * Serves as a namespace provider to isolate implementation code from the global namespace,
     * to provide a single point of access for functions - useful for organizing code into logical sections.
     *
     * @returns a new object of banner with access to internal constructors (i.e., StickyBanner).
     */
    Kargo.banner = (function() {
        function _banner() {
            /**
             * In non-strict mode, 'this' is bound to the global scope when it isn't bound to anything else.
             * In strict mode it is 'undefined'. That makes it an error to use it outside of a method.
             */
            var _this = this;

            /**
             * Initialize banner
             *
             * @returns 'this' to allow for the chaining of methods.
             */
            this.init = function () {
                return this;
            };

            /**
             * Constructor function for creating multiple object instances of StickyBanner.
             *
             * Using passed paramaeters to define the object's properities.
             *
             * @param html string used for generating a banner to render into the DOM.
             * @param config object storing config options used for rendering different banner types.
             */
            this.StickyBanner = function(html, config) {
                var noConfig = Object.keys(config).length === 0 && config.constructor === Object;
                var defaultConfig = Kargo.config.banners.sticky.config;
                var renderBanner = Kargo.helper.renderBanner;

                this.html = html;

                noConfig
                    ? this.config = defaultConfig
                    : this.config = config

                renderBanner(this.html, this.config);
                console.log('RENDERED ', this.html, this.config);
            };

            /**
             * Defines method for destroying an object instance of StickyBanner.
             *
             * Removes rendered HTML of banner from the DOM.
             */
            this.StickyBanner.prototype.destroy = function() {
                var banner = this;

                console.log('DESTROYED: ', banner);
            };

            return this.init(); // `this` refers to Kargo.banner.init()
        }

        return new _banner();

    /**
     * Putting parentheses around this structure to instantiate it immediately after it's parsed.
     * This way it's always available as soon as the script is executed and doesn't have to be instantiated separately.
     */
    }());

    /**
     * Singelton function with helper functions for generating banners.
     *
     * @returns a new object of helper with access to internal methods (i.e., renderBannersContainer, renderBanner).
     */
    Kargo.helper = (function() {
        function _helper() {

            var _this = this;

            /**
             * Initialize helper
             *
             * Calls various methods that need to be used after document loads.
             *
             * @returns 'this' to allow for the chaining of methods.
             */
            this.init = function() {
                _this.renderBannersContainer();
                _this.addEventListeners();

                return this;
            };

            /**
             * Renders a template used to contain generated banners into the DOM
             *
             * 1. Defines necessary variables used for rendering the template.
             * 2. Checks to see if template already exists to avoid template duplication.
             * 3. Inserts a template container into the body, before the main content.
             */
            this.renderBannersContainer = function() {
                var containerRendered = _this.hasBannersContainer();

                if (!containerRendered) {
                    var contentContainerSelector = Kargo.config.selectors.contentContainer;
                    var contentContainer = document.querySelector(contentContainerSelector);
                    var containerElement = Kargo.config.banners.containerElement;
                    var containerId = Kargo.config.banners.containerId;
                    var container = document.createElement(containerElement);

                    container.setAttribute('id', containerId);
                    contentContainer.parentNode.insertBefore(container, contentContainer);
                }
            };

            /**
             * Checks the DOM for an existing template container for banners
             *
             * @returns a boolean indicating if a banners container already exists
             */
            this.hasBannersContainer = function() {
                var containerId = Kargo.config.banners.containerId;
                var container = document.getElementById(containerId);

                if (container) {
                    return true
                }

                return false;
            };

            /**
             * Renders an element containing a generated banner into the DOM
             *
             * 1. Defines necessary variables used for rendering the banner.
             * 2. Checks to see if banner already exists in the same position.
             * 3. Inserts a banner into the rendered banners container.
             *
             * @param html string used for generating a banner to render into the DOM.
             * @param config object storing config options used for rendering different banner types.
             */
            this.renderBanner = function(html, config) {
                // var bannerRendered = _this.hasBanner(config.position);

                // if (!bannerRendered) {
                    // code to render banner
                // }
                // _this.replaceBanner();

                var bannerElement = Kargo.config.banners.sticky.element;
                var bannerClass = Kargo.config.banners.sticky.class;
                var bannerId = _this.generateId();
                var bannerPosition = _this.translateBannerPosition(config.position);
                var banner = document.createElement(bannerElement);

                banner.setAttribute('id', bannerId);
                banner.setAttribute('class', bannerClass);
                banner.setAttribute('style', bannerPosition);

                banner.innerHTML = html;

                var containerId = Kargo.config.banners.containerId;
                var container = document.getElementById(containerId);

                container.appendChild(banner);

                /**
                 * To Remove stylesheet dependancy:
                 *
                 * 1. Define a bannerStyles variable using bannerPosition.
                 * 2. Set new style attribute for banner.
                 *
                 * @code var bannerStyles = 'position: fixed; ' + position + ' left: 50%; transform: translateX(-50%);';
                 *       banner.setAttribute('style', bannerStyles);
                 */
            };

            /**
             * Checks the DOM for existing banner in the same position.
             *
             * @param position string used to define new banner's position.
             *
             * @returns a boolean indicating if a banner exists in the same position.
             */
            this.hasBanner = function(position) {
                // get banner from store (not from DOM)
                // or pass banner object as param
                var bannerId = 'get id from store';
                var banner = document.getElementById(bannerId);
                var bannerPosition = 'get position from store';

                if (bannerPosition === position) {
                    return true
                }

                return false;
            };

            /**
             * Replaces existing banner with new banner into the same position.
             *
             * @param banner string used to check banner's position.
             * @param newBanner string used to check new banner's position.
             */
            this.replaceBanner = function(banner, newBanner) {

                console.log('replace ', banner);
                console.log('with ', newBanner);
            };

            /**
             * Changes configured position property into a style attribute.
             *
             * @param position string used to define a banner's position inside it's config property.
             *
             * @returns a string of a CSS rule used to determine an element's position.
             */
            this.translateBannerPosition = function(position) {
                switch(position) {
                    case 'top':
                        return 'top: 0;';
                        break;
                    case 'bottom':
                        return 'bottom: 0;';
                        break;
                    default:
                        return 'top: 0;';
                }
            };

            /**
             * Sets display styles on banner(s) with the hide configuration.
             *
             * 1. Defines necessary variables used for setting the display.
             * 2. Hides banner(s) when blocker element is on screen.
             * 3. Shows banner(s) when blocker element is off screen.
             */
            this.setBannerDisplay = function() {
                var blockerSelector = Kargo.config.selectors.stickyBlocker;
                var blocker = document.querySelector(blockerSelector);

                // fetch id of existing banners from store - this.storeBanner
                // check visibility on multiple blocker elements - loop through array
                // set display styles for banners marked with hidden class

                // var banner = document.querySelector('.sticky-banner');
                // var bannerId = banner.getAttribute('id');
                // var relativeBanner = document.getElementById(bannerId);

                // relativeBanner.style.display = checkElementVisibility(blocker) ? 'none' : 'block';

                console.log('set banner display');
            }

            /**
             * Checks if an element is currently visible on the screen.
             *
             * @param element object used to test for visibility.
             *
             * @returns a boolean indicating if an element is currently visible to the user.
             */
            this.checkElementVisibility = function(element) {
                var rect = element.getBoundingClientRect();
                var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

                return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
            };

            /**
             * Generates a random id for a banner's container element.
             *
             * @returns a string with a unique value used for identifying banners.
             */
            this.generateId = function() {
                var S4 = function() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                 };

                 return 'sb-'+(S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
            };

            /**
             * Adds event listens to the scope.
             *
             * 1. Sets display styles for rendered banner(s). on window scroll event.
             */
            this.addEventListeners = function() {
                var setBannerDisplay = _this.setBannerDisplay;

                addEventListener('scroll', setBannerDisplay);
            };

            return this.init();  // 'this' refers to Kargo.helper.init()
        }

        return new _helper();
    }());

/**
 * Check to evaluate whether 'Kargo' exists in the global namespace
 * if not, assign window.Kargo an object literal
 */
}(window.Kargo = window.Kargo || {}));
