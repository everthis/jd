"use strict";

var tools = {};
tools.getMousePosOfElement = function(t, n) {
    var mouse_pos = tools.getMousePos(t),
        ele_pos = tools.getElementPos(n),
        c_width = n.clientWidth,
        c_height = n.clientHeight,
        deltaX = mouse_pos.left - ele_pos.left,
        deltaY = mouse_pos.top - ele_pos.top;
    return deltaX = deltaX < 0 ? 0 : deltaX > c_width ? c_width : deltaX, deltaY = deltaY < 0 ? 0 : deltaY > c_height ? c_height : deltaY, {
        x: deltaX,
        y: deltaY
    }
};

tools.getMousePos = function(el) {
    var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop),
        left = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
    return {
        top: top + el.clientY,
        left: left + el.clientX
    }
};

tools.getElementPos = function(el) {
        var top = 0, left = 0;
        do{
            top += el.offsetTop, left += el.offsetLeft;
        }
        while (el = el.offsetParent);
        return {top: top,left: left}
};

tools.browserPrefix = function() {
    var ua = navigator.userAgent.toLowerCase(), prefix = "";
        prefix = (ua.indexOf("chrome") >= 0 || window.openDatabase) ? "-webkit-" : (ua.indexOf("firefox") >= 0) ? "-moz-" : window.opera ? "-o-" : (document.all && navigator.userAgent.indexOf("Opera") === -1) ? "-ms-" : "";
        return prefix;

};
tools.getTranslateX = function(el) {
        var style_attr = tools.browserPrefix() + 'transform';
        var transform = window.getComputedStyle(el, null).getPropertyValue(style_attr);
        var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);
        if(!results) return [0, 0, 0];
        if(results[1] === '3d') return results.slice(2,5);
        results.push(0);
        return results.slice(5, 8)[0]; // returns the [X,Y,Z,1] values
};
/**
 * javascript carousel
 *
 * HTML format
 <div class="carousel_section">
    <div id="carousel_inner_container">
        <ul id="carousel">
            <li>
                <img src="images/carousel.jpg" />
            </li>
            <li>
                <img src="images/carousel01.jpg" />
            </li>
            <li>
                <img src="images/carousel02.jpg" />
            </li>
        </ul>
        <div id="carousel_control_list">
            <ul id="control_list_item">
            </ul>
        </div>
    </div>
</div>
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
var carousel = (function() {

    var arg;

    return {
        initialize: function(opt) {
            arg = this.settings(opt);
            this.index = arg.startIndex,
            this.isFirstRun = true; // set true for regular use.
            this.manipulateDOM();
            this.isPaused = false,
            this.bindEvent();
            this.stopPlay();
            this.play(arg.interval);
            this.calcinterWidth();
        },
        /**
         * default settings
         */
        settings: function(opt) {
            var defaults = {
                direction: "right",
                startIndex: 0,
                speed: .5,
                autoPlay: false,
                interval: 2000
            };
            for (var p in opt) {
                defaults[p] = opt[p]
            }
            return defaults;
        },
        manipulateDOM: function() {
           var first_dupe = this.imagesLis()[0].cloneNode(true),
               last_dupe = this.imagesLis()[this.imagesLength() - 1].cloneNode(true),
               first_child = this.imagesLis()[0];

               var fragment_first = document.createDocumentFragment();
               var fragment_last = document.createDocumentFragment();

                   fragment_first.appendChild( first_dupe );
                   fragment_last.appendChild( last_dupe );

                   this.imageinter().insertBefore(fragment_last, first_child);
                   this.imageinter().appendChild(fragment_first);
                   this.createDotMarks();
                   this.updateDotMarks();

        },
        initPosition: function(index) {
            this.init_distance = index * this.imageActualWidth();
            if (this.isFirstRun) {
                this.imageinter().style[tools.browserPrefix() + "transition"] = "";
            } else{
                this.imageinter().style[tools.browserPrefix() + "transition"] = "all " + arg.speed + "s linear";
            };
            this.imageinter().style[tools.browserPrefix() + "transform"] = "translate3d(-" + this.init_distance + "px, 0, 0)";
        },
        calcinterWidth: function() {
            var img,
                img_width,
                images_Lis,
                images_Length,
                window_width,
                $imageinter = this.imageinter(),
                img_height = this.firstImage().clientHeight,
                 $imagesLis;
                $imagesLis = this.imagesLis();              
                
                images_Length = this.imagesLis().length;
                window_width = Math.ceil(window.innerWidth);
            $imageinter.style.width  = this.imagesLength() * window_width + 'px';
            $imageinter.style.height = img_height + 'px';
            for (var i = images_Length - 1; i >= 0; i--) {
                this.imagesLis()[i].style.width = window_width + 'px';
            };
            this.initPosition(arg.startIndex);
            // this.imageouter().style.height = img_height + 'px';
        },
        resizeCarousel: function() {
            var window_width,
                img_height,
                images_Length,
            $imagesLis = this.imagesLis(),
            $imageinter = this.imageinter(),
            $imageouter = this.imageouter();
            images_Length = $imagesLis.length;
            window_width = Math.ceil(window.innerWidth);
            img_height = this.firstImage().clientHeight;
            for (var i = 0; i < images_Length; i++) {
               $imagesLis[i].style.width = window_width + 'px';
               $imagesLis[i].style.height = img_height + 'px';
            }
            $imageinter.style.height = img_height + 'px';
            $imageinter.style.width = window_width * this.imagesLength() + 'px';
            $imageouter.style.width = window_width + 'px';
            // $imageouter.style.height = img_height + 'px';
        },
        play: function(time) {
            var _this = this;

            this.auto_play = setInterval(function() {
                _this.isFirstRun = false;
                if (!_this.isPaused && arg.autoPlay) {
                    if (arg.direction === "left") {
                        _this.plusIndex(_this.index);
                        _this.forward();
                    } else if (arg.direction === "right"){
                        _this.minusIndex(_this.index);
                        _this.backward();
                    };
                    _this.setCurrentMark(_this.index);
                };
            }, time);

        },

        forward: function() {
            if(this.index === 1){
                this.staticSlide(0);
                setTimeout(this.dynamicSlide.bind(this, this.index), 100);
            }else{
                this.dynamicSlide(this.index);
            };
        },
        backward: function() {
            if(this.index === (this.imagesLength() - 2)){
                this.staticSlide( (this.imagesLength() - 1) );
                setTimeout(this.dynamicSlide.bind(this, this.index), 100);
            }else{
                this.dynamicSlide(this.index);
            }
        },
        bindEvent: function() {
            window.addEventListener("resize", this.resizeCarousel.bind(this), false),
            this.imageouter().addEventListener("touchstart", this.onTouchStart.bind(this), false),
            this.imageouter().addEventListener("touchmove", this.onTouchMove.bind(this), false),
            this.imageouter().addEventListener("touchend", this.onTouchEnd.bind(this), false),
            this.imageouter().addEventListener("touchcancel", this.onTouchEnd.bind(this), false)
        },
        imageouter: function() {
            return document.getElementById('carousel_inner_container');
        },
        imageinter: function() {
            return document.getElementById('carousel');
        },
        imagesLis: function() {
            return document.querySelectorAll('#carousel li');
        },
        firstImage: function() {
            return document.querySelector('#carousel img');
        },
        imageActualWidth: function() {
            return this.firstImage().clientWidth;
        },
        imagesLength: function() {
            return document.querySelectorAll('#carousel img').length;
        },
        dotMarks: function() {
            return document.querySelectorAll('#control_list_item li');
        },
        createDotMarks: function() {
            var dot_list = document.createDocumentFragment();
            for (var i = this.imagesLength() - 1; i >= 0; i--) {
                var li = document.createElement("li");
                dot_list.appendChild(li);
            };
            document.getElementById('control_list_item').appendChild(dot_list);

        },
        updateDotMarks: function() {
            var dot_marks = this.dotMarks(),
                dot_marks_length = dot_marks.length;
            if ( arg.direction === "right") {
                dot_marks[(dot_marks_length - 1)].style.display = "none";
                dot_marks[(dot_marks_length - 2)].style.display = "none";
            } else if( arg.direction === "left") {
                dot_marks[1].style.display = "none";
                dot_marks[0].style.display = "none";
            };
        },
        setCurrentMark: function(index) {
            var dot_lis = document.querySelectorAll('#control_list_item li');
            for (var i = dot_lis.length - 1; i >= 0; i--) {
                dot_lis[i].classList.remove('current');
            };

            if (arg.direction === "right") {
                if ((index - 1) < 0) {
                    dot_lis[(dot_lis.length - 3)].classList.add('current');
                } else {
                    dot_lis[(index - 1)].classList.add('current');
                };
            } else if (arg.direction === "left"){
                if ( (index + 1) === dot_lis.length ) {
                    dot_lis[2].classList.add('current');
                } else{
                    dot_lis[(index + 1)].classList.add('current');
                };
            };

        },
        onTouchStart: function(a) {

            this.imageinter().style[tools.browserPrefix() + "transition"] = "";
            var start_distance = tools.getMousePosOfElement(a.targetTouches[0], a.currentTarget);
            this.isPaused = true;
            this.startX = start_distance.x, this.startY = start_distance.y,
            this.imageinterLeft = parseInt(tools.getTranslateX(this.imageinter()));
        },
        onTouchMove: function(a) {
            var distance = tools.getMousePosOfElement(a.targetTouches[0], a.currentTarget);
            var deltaX = distance.x - this.startX,
                deltaY = distance.y - this.startY;
                this.margin_left = this.imageinterLeft + deltaX;
                this.imageinter().style[tools.browserPrefix() + "transition"] = "";

                if (this.margin_left > -this.imageActualWidth() ) {
                    this.imageinter().style[tools.browserPrefix() + "transform"] = "translate3d(-" + ( (this.imagesLength() - 1) * this.imageActualWidth() - deltaX ) + "px, 0, 0)";
                } else if(this.margin_left < -(this.imagesLength() - 2) * this.imageActualWidth() && this.margin_left > -(this.imagesLength() ) * this.imageActualWidth() ){
                    this.imageinter().style[tools.browserPrefix() + "transform"] = "translate3d(-" +  Math.abs(deltaX) + "px, 0, 0)";
                } else {
                    this.imageinter().style[tools.browserPrefix() + "transform"] = "translate3d(" + this.margin_left + "px, 0, 0)";
                };
        },
        onTouchEnd: function(a) {
                var distance = tools.getMousePosOfElement(a.changedTouches[0], a.currentTarget);
                var deltaX = distance.x - this.startX;
                    if (deltaX > 50) {
                        this.minusIndex(this.index);
                        this.initPosition(this.index);
                    } else if(deltaX < -50) {
                        this.plusIndex(this.index);
                        this.initPosition(this.index);
                    } else {
                        this.holdIndex();
                    };
                    this.setCurrentMark(this.index);
                    setTimeout(this.resumePlay.bind(this), 3000);
        },
        holdIndex: function() {
            this.imageinter().style[tools.browserPrefix() + "transform"] = "translate3d(" + this.margin_left + "px, 0, 0)";
            this.initPosition(this.index);
        },
        plusIndex: function(index) {
                index += 1; 
            if (index === (this.imagesLength() - 1 )) { 
                this.index = 1;
            } else {
                this.index = index;
            }
        },
        minusIndex: function(index) {
                index -= 1;
            if (index === 0) { 
                this.index = (this.imagesLength() - 2);
            } else {
                this.index = index;
            }
        },
        staticSlide: function(index) {
            this.imageinter().style[tools.browserPrefix() + "transition"] = "";
            this.imageinter().style[tools.browserPrefix() + "transform"] = "translate3d(-" + ( index * this.imageActualWidth()) + "px, 0, 0)";
        },
        dynamicSlide: function(index) {
            this.imageinter().style[tools.browserPrefix() + "transition"] = "all " + arg.speed + "s linear";
            this.imageinter().style[tools.browserPrefix() + "transform"] = "translate3d(-" + (index * this.imageActualWidth()) + "px, 0, 0)";
        },

        pausePlay: function() {
            this.isPaused = true;
        },
        resumePlay: function() {
            this.isPaused = false;
        },
        stopPlay: function() {
            clearInterval(this.auto_play)
        }
    }
})();



carousel.initialize({
    autoPlay: true,
    startIndex: 1,
    direction: "left",
    speed: .4,
    interval: 3000
});

