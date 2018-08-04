# Ad Tech Code Example

## StickyBanner

A JavaScript Object for constructing a Banner Ad that's affixed to the top or bottom of the viewport. 

* Banner remains fixed according to it's configured position as the user scrolls through the page.
* Banner's display changes whenever a blocker element enters visibility on the screen, if it's configuration is set to hidden.

View the code in [`js/sticky_banner.js`](https://github.com/dvzrd/sticky-banner-js/blob/master/js/sticky_banner.js).

### How to use StickyBanner

This will show you how to use the `StickyBanner` constructor.

#### Calling the namespace

You can define namespace variable to call `StickyBanner` more easily:

```
var StickyBanner = Kargo.banner.StickyBanner;
```

#### Creating object instance

Create a new `StickyBanner` instance by calling `new StickyBanner(html, config)`. The html argument is a string of the html to be placed in the Banner Ad. The config argument is an object that recognizes two keys:

* `position` - accepts string value of `top` or `bottom` to determine whether to affix the Banner Ad to the bottom or top of the viewport.
* `hide` - accepts boolean value of `true` or `false` to determine whether the Banner Ad should hide when blockers are visible.

Here's how you could use the constructor:

```
var bannerHTML = '<img src="http://placehold.it/480x120" />';
var bannerConfig = { position: 'top', hide: false };

var topBanner = new StickyBanner(bannerHTML, bannerConfig);
```

`config` values have default settings if they're not specified in the construtor:

* `position` = `top`
* `hide` = `false`

#### Destroying object instances

You can destroy a `StickyBanner` instance by calling the `destroy` method:

```
topBanner.destroy();
```

### Limitations

Multiple instances of a `StickyBanner` can exist at a time, but only one at each position. That means you can have, at most, one 'top' StickyBanner and one 'bottom' StickyBanner active at the same time.

* When creating a new `StickyBanner` of the same position as an active `StickyBanner`, the older instance is destroyed.

### Working Examples

Find working examples in [`index.html`](https://github.com/dvzrd/sticky-banner-js/blob/master/index.html).
