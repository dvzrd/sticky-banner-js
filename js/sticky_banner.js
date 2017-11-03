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
    /**
     * Use strict mode
     *
     * Using `strict` enhances development process,
     * but restricts you from calling delete or remove on object instances.
     * Typically you can remove `strict` mode in production.
    */
    'use strict';

    /**
     * Object literal for storing constants.
     *
     * 1. Configure script settings (i.e., debug).
     * 2. HTML/CSS that needs to be created using JavaScript.
     * 3. Relative banner settings (i.e., elements, classes, and default config).
     * 4. Repeated unique values (i.e., DOM query selectors).
    */
    Kargo.config = {
        debug: true,
        banners: {
            containerElement: 'aside',
            containerId: 'kargo-banners',
            hideClass: 'hide',
            sticky: {
                element: 'figure',
                class: 'banner-sticky',
                config: {
                    position: 'top',
                    hide: false
                },
                style: {
                    zIndex: '1',
                    cursor: 'pointer',
                    backgroundColor: '#000',
                    padding: '0.25em',
                    margin: '0',
                    width: '100%',
                    position: 'fixed',
                    left: '0'
                }
            }
        },
        selectors: {
            contentContainer: '.main',
            stickyBlocker: '.blocker'
        }
    };

    /**
     * Object literal for storing references to object instances of banner.
     *
     * Can only hold two object references at a time:
     * 1. Object reference for top positioned banner.
     * 2. Object reference for bottom positioned banner.
    */
    Kargo.store = {
        banners: {
            rendered: {
                top: {},
                bottom: {}
            }
        }
    };

    /**
     * Singelton function with helper functions for public use.
     *
     * @returns a new object of helper with access to internal methods (i.e., isElementVisible, generateId).
    */
    Kargo.helper = (function() {
        function _helper() {
            /**
             * In non-strict mode, 'this' is bound to the global scope when it isn't bound to anything else.
             * In strict mode it is 'undefined'. That makes it an error to use it outside of a method.
            */
            var _this = this;

            /**
             * Initialize helper
             *
             * @returns 'this' to allow for the chaining of methods.
            */
            this.init = function() {
                return this;
            };

            /**
             * Checks if an object's property is empty.
             *
             * @param object to check against the passed property parameter.
             * @param property to check inside the passed object parameter.
             *
             * @returns a boolean indicating if the object's property is empty.
            */
            this.isPropertyEmpty = function(object, property) {
                return Object.keys(object[property]).length === 0;
            };

            /**
             * Checks if an element is currently visible on the screen.
             *
             * @param element object used to test for visibility.
             *
             * @returns a boolean indicating if an element is currently visible to the user.
            */
            this.isElementVisible = function(element) {
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

                 return 'Kargo-'+(S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
            };

            /**
             * Transforms an object into a string following CSS syntax.
             *
             * 1. transforms original object into JSON string.
             * 2. replaces capital letters with lowercase letters with prepended hyphens.
             * 3. removes quotes and brackets and replaces commas with semicolons.
             *
             * @param object to be transformed.
             *
             * @returns a string formatted with proper CSS syntax used for setting style attributes.
            */
            this.formatForStyling = function(object) {
                var strung = _this.objectToString(object);
                var pierced = _this.camelToKebabCase(strung);

                return pierced.replace(/['"{}]+/g, '').split(',').join(';');
            };

            /**
             * Transforms object to JSON string.
             *
             * @param object to be transformed.
             *
             * @returns a stringified JSON object.
            */
            this.objectToString = function(object) {
                return JSON.stringify(object);
            };

            /**
             * Transforms string from camelCase to kebab-case.
             *
             * @param string to be transformed.
             *
             * @returns a string whose capital letters are replaced by hyphens and lowercase letters.
            */
            this.camelToKebabCase = function(string) {
                return string.replace(/([A-Z])/g, '-$1').toLowerCase();
            };

            /**
             * Removes dot from class selector string.
             *
             * @param string to be transformed.
             *
             * @returns a clean string without any dots.
            */
            this.cleanSelector = function(selector) {
                return selector.replace(/\./g,'');
            }

            return this.init();  // 'this' refers to Kargo.helper.init()
        }

        return new _helper();
    }());

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

                this.html = html;
                this.config = noConfig ? defaultConfig : config;

                renderBanner(this.html, this.config);
            };

            /**
             * Defines method for destroying an object instance of StickyBanner.
             *
             * Removes all references to banner object instance:
             * 1. Clears the banner's object reference from internal store.
             * 2. Removes the rendered banner HTML from the DOM.
            */
            this.StickyBanner.prototype.destroy = function() {
                var banner = this;

                removeBanner(banner);

                // Destroys the actual object instance (must disable `strict` mode)
                // banner = null;
                // delete banner
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
     * Private banner methods
     *
     * Function declarations to be used internally for
     * generating banners and inserting them into DOM.
     *
     **
     * Initialize private methods
     *
     * Calls required methods after document loads:
     * 1. Renders a container element for inserting banners.
     * 2. Adds event listeners that fire when user performs certain actions (i.e., scrolling).
    */
    function init() {
        renderBannersContainer();
        attachBannerEvents();
    };

    /**
     * Renders a template used to contain generated banners into the DOM
     *
     * 1. Defines necessary variables used for rendering the template.
     * 2. Checks to see if template already exists to avoid template duplication.
     * 3. Inserts a template container into the body, before the main content.
    */
    function renderBannersContainer() {
        var containerRendered = hasBannersContainer();

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
    function hasBannersContainer() {
        var containerId = Kargo.config.banners.containerId;
        var container = document.getElementById(containerId);

        return !!container;
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
    function renderBanner(html, config) {
        var containerId = Kargo.config.banners.containerId;
        var container = document.getElementById(containerId);
        var bannerRendered = hasBanner(config.position);
        var bannerElement = Kargo.config.banners.sticky.element;
        var bannerId = Kargo.helper.generateId();
        var bannerClass = getBannerClass(config);
        var bannerStyle = getBannerStyle(config.position);
        var banner = document.createElement(bannerElement);

        banner.setAttribute('id', bannerId);
        banner.setAttribute('class', bannerClass);
        banner.setAttribute('style', bannerStyle);
        banner.innerHTML = html;

        bannerRendered ? replaceBanner(banner, config) : container.appendChild(banner);

        storeBanner(banner, config);
    };

    /**
     * Stores a reference to the banner object instance rendered into the DOM.
     *
     * 1. Defines necessary variables used for storing the banner.
     * 2. Checks to see if another object reference occuppies a similar position.
     * 3. Saves the banner object reference to the internal store.
     *
     * @param html object of rendered banner HTML inserted into the DOM.
     * @param config object of config options used to determine rendered banner's position.
    */
    function storeBanner(html, config) {
        var store = Kargo.store.banners.rendered;
        var position = config.position;

        store[position] = {
            html: html,
            config: config
        };
    };

    /**
     * Checks the DOM for existing banner in the same position.
     *
     * @param position string used to test new banner's position against position of existing banner.
     *
     * @returns a boolean indicating if a banner exists in the same position.
    */
    function hasBanner(position) {
        var store = Kargo.store.banners.rendered;
        var storeEmpty = Kargo.helper.isPropertyEmpty(store, position);

        if (!storeEmpty) {
            var bannerPosition = store[position].config.position;

            return bannerPosition === position;
        }

        return false;
    };

    /**
     * Replaces existing banner with a new banner matching the same position.
     *
     * @param banner HTML object used for rendering new banner into the DOM.
     * @param config object of config options used to determine new banner's position.
    */
    function replaceBanner(banner, config) {
        var store = Kargo.store.banners.rendered;
        var containerId = Kargo.config.banners.containerId;
        var container = document.getElementById(containerId);
        var renderedBannerId = store[config.position].html.id;
        var renderedBanner = document.getElementById(renderedBannerId);

        container.removeChild(renderedBanner);
        container.appendChild(banner);
    };

    /**
     * Removes banner from the DOM and internal store.
     *
     * @param banner object reference of banner that will be removed.
    */
    function removeBanner(banner) {
        var store = Kargo.store.banners.rendered;
        var containerId = Kargo.config.banners.containerId;
        var container = document.getElementById(containerId);
        var bannerPosition = banner.config.position;
        var bannerId = store[bannerPosition].html.id;
        var bannerToRemove = document.getElementById(bannerId);

        store[bannerPosition] = {};
        container.removeChild(bannerToRemove);
    };

    /**
     * Generates class name for banner using default config settings and passed parameters.
     *
     * @param config object used to determine hide and position class settings.
     *
     * @returns a string to be used for setting a banner's class attribute.
    */
    function getBannerClass(config) {
        var baseClass = Kargo.config.banners.sticky.class;
        var hideClass = Kargo.config.banners.hideClass;
        var bannerClass = config.hide ?
                            baseClass + ' ' + config.position + ' ' + hideClass :
                            baseClass + ' ' + config.position;

        return bannerClass;
    };

    /**
     * Transforms configured banner styles and position into a style attribute.
     *
     * @param position string used to define a banner's position inside it's config property.
     *
     * @returns a string of CSS rules used to style generated banner.
    */
    function getBannerStyle(position) {
        var styleConfig = Kargo.config.banners.sticky.style;
        var formatForStyling = Kargo.helper.formatForStyling;
        var bannerStyle = formatForStyling(styleConfig);
        var bannerPosition = position + ':0;';

        return bannerStyle + ';' + bannerPosition;
    };

    /**
     * Checks if sticky blocker element is visibile on the screen.
     *
     * @returns a boolean value for each blocker element to confirm if it's visible or not.
    */
    function isBlockerVisible() {
        var isElementVisible = Kargo.helper.isElementVisible;
        var blockerClass = Kargo.helper.cleanSelector(Kargo.config.selectors.stickyBlocker);
        var blockers = document.getElementsByClassName(blockerClass);
        var blocker, value = false;

        for (blocker = 0; blocker < blockers.length; blocker++) {
            if (isElementVisible(blockers[blocker])) {
                value = true;
            }
        }

        return value;
    };

    /**
     * Sets display styles on banner(s) with the hide configuration.
     *
     * 1. Defines necessary variables used for setting the display.
     * 2. Hides banner(s) when blocker element is on screen.
     * 3. Shows banner(s) when blocker element is off screen.
    */
    function setBannerDisplay() {
        var storedTopBanner = Kargo.store.banners.rendered.top;
        var storedBottomBanner = Kargo.store.banners.rendered.bottom;
        var hideTopBanner = storedTopBanner.config.hide;
        var hideBottomBanner = storedBottomBanner.config.hide;
        var topBanner = storedTopBanner ? document.getElementById(storedTopBanner.html.id) : null;
        var bottomBanner = storedBottomBanner ? document.getElementById(storedBottomBanner.html.id) : null;

        if (topBanner && hideTopBanner) {
            topBanner.style.display = isBlockerVisible() ? 'none' : 'block';
        }

        if (bottomBanner && hideBottomBanner) {
            bottomBanner.style.display = isBlockerVisible() ? 'none' : 'block';
        }
    }

    /**
     * Adds event listeners to the scope.
     *
     * 1. Sets display styles for rendered banner(s) on window scroll event.
    */
    function attachBannerEvents() {
        addEventListener('scroll', setBannerDisplay);
    };

    return init();

/**
 * Check to evaluate whether 'Kargo' exists in the global namespace
 * if not, assign window.Kargo an object literal
*/
}(window.Kargo = window.Kargo || {}));
