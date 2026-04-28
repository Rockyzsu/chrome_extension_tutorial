function displayClockForTest(elem) {
    setTimeout(function () {
        elem.innerHTML = "<h4>Change by clock</h4>"
    }, 5000);
}


function displayClock(item, img_node, img_div) {

    setInterval(function () {
        var today = new Date();

        var m = today.getMinutes()
        var s = today.getSeconds()

        if (m < 9) {
            m = '0' + m
        }
        if (s < 9) {
            s = '0' + s
        }

        item.innerHTML = m + " : " + s;
    }, 1000);

    // setTimeout(function () {
    //     img_div.innerHTML = img_node.src
    // }, 5000);

    // setTimeout(function () {
    //     img_div.innerHTML = img_node.src;
    //     console.log('change ');
    // }, 5000);
}

clock_div = document.getElementById('clock');
img_div = document.getElementById('img_path');
img_node = document.getElementById('pic');
displayClock(clock_div, img_node, img_div);
