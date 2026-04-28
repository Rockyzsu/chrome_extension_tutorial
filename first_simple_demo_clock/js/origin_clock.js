function displayClockForTest(clock_elem) {
    setInterval(function () {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        clock_elem.innerHTML = h + " : " + m + " : " + s;
    }, 1000);

}
const clock_elem = document.getElementById('clock');
displayClockForTest(clock_elem);