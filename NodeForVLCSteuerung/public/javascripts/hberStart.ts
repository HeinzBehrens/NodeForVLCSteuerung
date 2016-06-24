var timerToken
var timer: HTMLElement 
var span: HTMLElement 

function formatTime( datum: Date ): string {

    var Stunden: number = datum.getHours()
    var Minuten: number = datum.getMinutes()
    var Sekunden: number = datum.getSeconds()

    var sStunden: string
    var sMinuten: string
    var sSekunden: string
    if ( Stunden < 10 ) { sStunden  = "0" + Stunden } else { sStunden = Stunden.toString() }
    if ( Minuten < 10 ) { sMinuten = "0" + Minuten } else { sMinuten=Minuten.toString() }
    if ( Sekunden < 10 ) { sSekunden = "0" + Sekunden } else { sSekunden = Sekunden.toString()}
    return sStunden+":"+sMinuten+":"+sSekunden 
}

function myTime(): void  {
    var newDate: Date 
    newDate = new Date()
    var strTime: string  = formatTime(newDate )
    span.innerHTML =strTime
}

function start() {
  // timerToken = setInterval(() => span.innerHTML = formatTime( new Date() ), 500 );
    console.log (formatTime(new Date()))
   // timerToken = setInterval(() => span.innerHTML =  new Date().toTimeString() , 500 );
    timerToken = setInterval(myTime , 500 );

   }

function stop() {
    clearTimeout( timerToken );
}




window.onload = () => {


};