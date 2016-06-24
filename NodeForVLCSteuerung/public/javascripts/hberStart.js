var timerToken;
var timer;
var span;
function formatTime(datum) {
    var Stunden = datum.getHours();
    var Minuten = datum.getMinutes();
    var Sekunden = datum.getSeconds();
    var sStunden;
    var sMinuten;
    var sSekunden;
    if (Stunden < 10) {
        sStunden = "0" + Stunden;
    }
    else {
        sStunden = Stunden.toString();
    }
    if (Minuten < 10) {
        sMinuten = "0" + Minuten;
    }
    else {
        sMinuten = Minuten.toString();
    }
    if (Sekunden < 10) {
        sSekunden = "0" + Sekunden;
    }
    else {
        sSekunden = Sekunden.toString();
    }
    return sStunden + ":" + sMinuten + ":" + sSekunden;
}
function myTime() {
    var newDate;
    newDate = new Date();
    var strTime = formatTime(newDate);
    span.innerHTML = strTime;
}
function start() {
    // timerToken = setInterval(() => span.innerHTML = formatTime( new Date() ), 500 );
    console.log(formatTime(new Date()));
    // timerToken = setInterval(() => span.innerHTML =  new Date().toTimeString() , 500 );
    timerToken = setInterval(myTime, 500);
}
function stop() {
    clearTimeout(timerToken);
}
window.onload = function () {
};
//# sourceMappingURL=hberStart.js.map