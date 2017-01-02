!function($, window, document, undefined) {
    "use strict";
    function Plugin(element, options) {
        this.element = element, this.$element = $(this.element), this.elementPosition = this.$element.position(), 
        this.elementSize = {
            width: this.$element.outerWidth(),
            height: this.$element.outerHeight()
        }, this.bigImage = this.$element.data("zoom-image"), this.settings = $.extend({}, defaults, options), 
        this._defaults = defaults, this._name = pluginName, this.init();
    }
    var pluginName = "kkZoom", defaults = {
        parentSize: !1,
        zoomButtonWidth: 30,
        zoomButtonHeight: 30,
        zoomWidth: 795,
        zoomHeight: 641,
        debug: !1,
        afterZoomOpened: function() {},
        afterZoomClosed: function() {}
    };
    $.extend(Plugin.prototype, {
        init: function() {
            var a = this.createZoomButton(), div = this.createZoomImage();
            this.$element.before(a), this.bindEvents(a, div);
        },
        bindEvents: function(button, zoomImage) {
            var _this = this;
            button.on("click", function() {
                return _this.calculatePosition(zoomImage), !1;
            });
        },
        calculatePosition: function(zoomImage) {
            this.log("====> calculatePosition"), this.settings.parentSize ? (this.log("--> ALIGN PARENT: ", $(this.settings.parentSize).length), 
            this.calculatePositionParent(zoomImage)) : (this.log("--> ALIGN ELEMENT: ", this.$element.length), 
            this.calculatePositionAuto(zoomImage)), this.log("=================");
        },
        calculatePositionParent: function(zoomImage) {
            var _this = this, parent = this.$element.parents(this.settings.parentSize), toTop = Math.floor(this.$element.offset().top - parent.offset().top), toLeft = Math.floor(this.$element.offset().left - parent.offset().left), proportion = this.elementSize.height / this.elementSize.width, zoomImageHeight = Math.floor(parent.outerWidth() * proportion), bodyBottomSpace = $("body").height() - parent.offset().top - this.$element.height(), canBottomDisplay = zoomImageHeight < bodyBottomSpace;
            this.log("--> height: ", zoomImageHeight), this.log("--> bottom: ", bodyBottomSpace), 
            this.log("--> space to bottom: ", canBottomDisplay), zoomImage.css({
                top: canBottomDisplay ? -1 * toTop : "auto",
                bottom: canBottomDisplay ? "auto" : 0,
                left: -1 * toLeft,
                width: parent.outerWidth(),
                "max-width": parent.outerWidth(),
                height: zoomImageHeight
            }), _this.openZoom(zoomImage);
        },
        calculatePositionAuto: function(zoomImage) {
            var _this = this, toLeft = Math.floor(this.$element.offset().left), toRight = Math.floor($(window).outerWidth() - toLeft - this.elementSize.width), difference = toLeft - toRight;
            this.log("--> toLeft: ", toLeft), this.log("--> toRight: ", toRight), this.log("--> difference: ", difference), 
            zoomImage.css({
                width: _this.settings.zoomWidth,
                height: _this.settings.zoomHeight
            }), difference < 50 && difference > -50 ? (this.log("--> center"), zoomImage.css({
                transform: "translate(-50%, 0)",
                "margin-left": "50%"
            }), _this.openZoom(zoomImage)) : difference < 0 ? (this.log("--> left"), _this.openZoom(zoomImage)) : difference > 0 && (this.log("--> right"), 
            zoomImage.css({
                transform: "translate(-100%, 0)",
                "margin-left": "100%"
            }), _this.openZoom(zoomImage));
        },
        openZoom: function(zoomImage) {
            var _this = this;
            _this.$element.before(zoomImage), setTimeout(function() {
                zoomImage.addClass("kk-zoom-image-big").css({
                    top: zoomImage.position().top,
                    bottom: "auto",
                    opacity: 1
                }), _this.settings.afterZoomOpened();
            }, 10), zoomImage.on("click", function() {
                _this.closeZoom(zoomImage);
            });
        },
        closeZoom: function(zoomImage) {
            var _this = this;
            this.log("===> closeZoom"), this.log("--> image top: ", zoomImage.position().top), 
            this.log("--> top: ", _this.elementPosition.top), zoomImage.css({
                width: _this.elementSize.width,
                height: _this.elementSize.height,
                top: _this.elementPosition.top,
                left: _this.elementPosition.left,
                opacity: 0
            }), _this.settings.afterZoomClosed(), setTimeout(function() {
                zoomImage.remove();
            }, 300);
        },
        createZoomButton: function() {
            var a = $(document.createElement("a"));
            return a.attr({
                href: "javacript://"
            }), a.css({
                top: this.elementPosition.top,
                left: this.elementPosition.left,
                width: this.elementSize.width,
                height: this.elementSize.height
            }), a.addClass("kk-zoom-button"), a;
        },
        createZoomImage: function() {
            var img = null;
            return img = this.settings.parentSize ? $(document.createElement("img")).attr({
                src: this.bigImage
            }).css({
                width: this.elementSize.width,
                height: this.elementSize.height,
                top: this.elementPosition.top,
                left: this.elementPosition.left,
                opacity: 0
            }).addClass("kk-zoom-image") : $(document.createElement("div")).css({
                "background-image": "url(" + this.bigImage + ")",
                width: this.elementSize.width,
                height: this.elementSize.height,
                top: this.elementPosition.top,
                left: this.elementPosition.left,
                opacity: 0
            }).addClass("kk-zoom-image");
        },
        log: function(desc, prop) {
            this.settings.debug && (prop === undefined ? console.log(desc) : console.log(desc, prop));
        }
    }), $.fn[pluginName] = function(options) {
        return this.each(function() {
            $.data(this, "plugin_" + pluginName) || $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        });
    };
}(jQuery, window, document);