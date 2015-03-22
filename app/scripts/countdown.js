function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        interval,
        hours,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        hours   = (diff / 3600) | 0;
        minutes = ((diff - hours * 60 * 60) / 60)   | 0;
        seconds = (diff % 60)   | 0;

        hours   = hours   < 10 ? "0" + hours   : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // display.textContent = hours + minutes + seconds;
        var tmp = hours + minutes + seconds,
            tmp_string = tmp.toString();
        display[0].innerHTML = tmp_string.slice(0, 1);
        display[1].innerHTML = tmp_string.slice(1, 2);
        display[2].innerHTML = tmp_string.slice(2, 3);
        display[3].innerHTML = tmp_string.slice(3, 4);
        display[4].innerHTML = tmp_string.slice(4, 5);
        display[5].innerHTML = tmp_string.slice(5, 6);
        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            // start = Date.now() + 1000;
            clearInterval(interval);
        }
    };
    // do not wait a full second before the timer starts
    timer();
    interval = setInterval(timer, 1000);
}

// window.onload = function () {
    /** for the sake of JD DEMO, not integrated into angular. */

    var fiveMinutes = 1 * 5,
        twoHours    = 60 * 60 * 2,
        display1 = document.querySelectorAll('#time1 .digit'),
        display2 = document.querySelectorAll('#time2 .digit');

    startTimer(fiveMinutes, display1);
    startTimer(twoHours, display2);
// };

/**
 * hide bottom nav while scrolling, show when stopped.
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */

var $bottomNav = document.querySelector('.bottomNav');
var $search_container = document.querySelector('.search_container')
var timer;
window.onscroll = function() {
    // top search bar control
    if (window.scrollY >= 65){
        $search_container.style.position = "fixed";
    } else {
        $search_container.style.position = "relative";

    };

    // bottom nav bar control
    $bottomNav.style.display = 'none';
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        $bottomNav.style.position = 'fixed';
        $bottomNav.style.display = 'block';
    }, 100);
}




