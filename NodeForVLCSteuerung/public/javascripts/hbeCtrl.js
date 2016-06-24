/// <reference path="../../Scripts/typings/angular.d.ts" />
/// <reference path="../../Scripts/typings/moment.d.ts" />
/// <reference path="../../Scripts/typings/hbe.d.ts" />
"use strict";
angular.module("hbeVLC", ['ngRoute', 'ngAnimate', 'ui.bootstrap'])
    .config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $routeProvider.when("/", {
            templateUrl: "/javascripts/main.html",
            controller: "mainCtrl",
            controllerAs: "ctrl"
        })
            .when("/moreInfo", {
            //  templateUrl: "/javascripts/EpisodeInfo.html",
            templateUrl: "/javascripts/CarouselDemo2.html",
            controller: "CarouselDemoCtrl",
            controllerAs: "ctrl"
        })
            .when("/Steuerung", {
            templateUrl: "/javascripts/Steuerung.html",
            controller: "SteuerungCtrl",
            controllerAs: "ctrl"
        })
            .otherwise({ redirectTo: '/' });
    }])
    .factory('hbeFactory', ["$window", function ($window) {
        return {
            getViewport: function () {
                var w = $window.innerWidth;
                if (w < 768) {
                    return 'xs';
                }
                else if (w < 992) {
                    return 'sm';
                }
                else if (w < 1200) {
                    return 'md';
                }
                else {
                    return 'lg';
                }
            },
            isViewport: function (vpname) {
                return (vpname.toLowerCase().trim() == this.getViewport);
            }
        };
    }
])
    .directive('holder', [
    // Diese Direktive ermöglicht die Nutzung von HOLDER.JS 
    // Dazu wird im Element das Attribut holder verwendet 
    //  z. B.     <div class="col-sm-3"><img holder="holder.js/300x441?random=yes&text=1"></div>
    //  Durch die Verwendung von holder wird diese Direktive aktiviert.
    //       - Die Direktive ersetzt das Attribut holder durch das Attribut "data-src"
    //         und ruft danach mit Holder.run auf, und übergibt das image-Element an diese Funktion
    function () {
        return {
            // Directives that want to modify the DOM typically use the link option to register DOM listeners 
            //  as well as update the DOM.It is executed after the template has been cloned and is where directive 
            // logic will be put.
            // link takes a function with the following signature, 
            //                function link( scope, element, attrs, controller, transcludeFn ) { ... }, where:
            //        scope is an Angular scope object - The scope to be used by the directive for registering watches.
            //        element is the jqLite- wrapped element that this directive matches.
            //        attrs is a hash object with key- value pairs of normalized attribute names and their corresponding attribute values.
            //        controller is the directive's required controller instance(s) or its own controller (if any). 
            //                                                  The exact value depends on the directive's require property.
            //                    no controller(s) required: the directive's own controller, or undefined if it doesn't have one
            //                    string: the controller instance
            //                    array: array of controller instances
            //        transcludeFn is a transclude linking function pre-bound to the correct transclusion scope.
            link: function (scope, element, attrs) {
                if (attrs.holder)
                    attrs.$set('data-src', attrs.holder);
                Holder.run({ images: element[0] });
            }
        };
    }])
    .directive("hbeimg", function () {
    return {
        restrict: "E",
        replace: true,
        template: '<div class="col-xs-3"><img  class="img-responsive center-block" holder= "holder.js/300x441?random=yes&text=11" height="100" > </div>',
        link: function () { alert("hallo"); }
    };
})
    .directive("hbeimg2", function (hbeFactory) {
    return {
        restrict: "EA",
        replace: true,
        //template: '<div class="col-xs-3">test01 </div>',
        link: function (scope, element, atrrs) {
            alert(hbeFactory.getViewport());
            // Anzahl der Elemente in playlist
            alert("Anzahl: " + scope.playlist.length);
            for (var i = 0; i < 4; i++) {
                element.append('<div class="col-xs-3">test' + i.toString() + scope.testfeld[i] + ' </div>');
            }
        }
    };
})
    .directive('holderFix', function () {
    return {
        link: function (scope, element, attrs) {
            Holder.run({ images: element[0], nocss: true });
        }
    };
})
    .controller("mainCtrl", ["$scope", "$timeout", "$interval", "$http", "$location", "$window",
    function ($scope, $timeout, $interval, $http, $location, $window) {
        // this festnageln auf interne Variable self
        var self = this;
        // hier wird die Server-Adresse gepeichert: 192.168.178.xxx
        var ServerAddress = location.hostname;
        // Diese Variablen werden direkt angzeigt
        //
        $scope.Season = 0;
        $scope.Episode = 0;
        $scope.Show;
        $scope.Titel = "Test-Titel";
        $scope.aktZeit;
        $scope.endZeit;
        $scope.runTime;
        $scope.leftTime;
        $scope.imgSource = "images/PoI-1.jpg";
        $scope.imdbURL = "http://www.imdb.com/";
        $scope.playlist;
        self.name = "Selfname";
        $scope.name = "ScopeName";
        $scope.testfeld = [777, 123, 345, 222];
        // -----------------------------------------------------------------------------
        //
        //  und ein paar interne Variablen, die nicht von außen zugägnglich sein müssen
        //
        // -----------------------------------------------------------------------------
        var StartTime;
        var momStartTime;
        var durRunTime;
        var durTotalTime;
        var durLeftTime;
        var curPosInPlayList = -1;
        var arPlayList = [];
        var aktWerte;
        var timerGetTime;
        //  "holder.js/300x441?random=yes&text=5" />
        //    <img class="img2" ng- src="getHolder(6)" />
        $scope.getHolder = function (i) {
            var myStr = "holder.js/" + window.innerWidth / 5 + "x" + window.innerWidth / 5.0 * 441.0 / 300.0 + "?random=yes&text=" + i;
            alert(myStr);
            return myStr;
        };
        $scope.getScreenwidth = function () {
            alert("IW: " + window.innerWidth + " --- OW: " + window.outerWidth);
        };
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: GO
        //           - Funktion, um auf eine andere interne Seite zu springen
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.go = function (path) {
            $location.path(path);
        };
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: goext
        //           - Funktion, um auf eine andere externe Seite zu springen
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.goext = function (url) {
            // $window.location.href =  url
            $window.open(url, "_blank");
        };
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: fillPlaylist
        //           - Playlist wird gefüllt, dabei wwerden die Indizes gesetzt, die ich für Carousel
        //             brauche. 
        //             Außerdem erfolgt die Zuweisung der internen Variable in den Scope
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        function fillPlaylist(ar) {
            arPlayList = ar;
            arPlayList.forEach(function (val, ndxI, arPL) {
                val.ndx = ndxI;
            });
            $scope.playlist = arPlayList;
        }
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: hbetimer
        //           diese Funktion wird jede Sekunde aufgerufen, und setzt die laufenden Timer
        //           ==>  aktZeit, runTime und leftTime
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        function hbetimer() {
            $scope.aktZeit = new Date(); // aktuelle Zeit holen
            // die Daten werden nicht neu berechnet... ich gehe davon aus, dass für einen kurzen Zeitraum
            // 10... 60s die Abweichung nicht auffällig ist, sodass ich einfach nur eine Sekunde subtrahiere
            // bzw. addiere
            // dieser Timer wird auch in diesem Controller gestartet...
            //
            $scope.runTime.setSeconds($scope.runTime.getSeconds() + 1);
            $scope.leftTime.setSeconds($scope.leftTime.getSeconds() - 1);
        }
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: init
        //           Initilisierungsfunktion, die ein paar Daten belegt, damit ich starten kann
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        function init(curTime, length) {
            if (!curTime || !length) {
                return;
            }
            durTotalTime = moment.duration(moment(length).format("HH:mm:ss"));
            durLeftTime = moment.duration(moment(length).diff(moment(curTime)));
            momStartTime = moment().add(-curTime.getHours(), "h").add(-curTime.getMinutes(), "m").add(-curTime.getSeconds(), "s");
            StartTime = momStartTime.toDate();
            $scope.aktZeit = new Date();
            $scope.endZeit = moment($scope.aktZeit).add(durLeftTime).toDate();
            $scope.runTime = curTime;
            $scope.leftTime = new Date(2000, 1, 1, durLeftTime.hours(), durLeftTime.minutes(), durLeftTime.seconds());
            // Pseudo Playlist erzeugen  - hier wird nur der Bildeintrag benötigt
            var plEntry = {};
            plEntry.imgSrcNode = "images/PoI-1.jpg";
            plEntry.ndx = 0;
            var arPl = [];
            arPl.push(plEntry);
            fillPlaylist(arPl);
        }
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: scope-Werte berechnen, die sich aus einer Abfrage an den Server ergeben
        //           Initilisierungsfunktion, die ein paar Daten belegt, damit ich starten kann
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        function belegeScopeWerte() {
            if (!angular.isDefined(aktWerte)) {
                alert("aktwerte undefined");
                return;
            }
            curPosInPlayList = aktWerte.aktPos;
            // dann suche ich mal aus der PlayList den richtigen Eintrag heraus
            var aktEintrag;
            if (aktWerte.aktPos < arPlayList.length) {
                // zuerst die aktuelle Spielzeit setzen
                $scope.runTime = new Date(2000, 1, 1, 0, 0, aktWerte.aktSpielzeit, (aktWerte.aktSpielzeit));
                aktEintrag = arPlayList[aktWerte.aktPos];
                $scope.Episode = aktEintrag.Episode;
                durTotalTime = moment.duration(aktEintrag.Duration, "seconds");
                $scope.imgSource = aktEintrag.imgSrcNode;
                $scope.imdbURL = "";
                $scope.Season = aktEintrag.Season;
                $scope.Show = aktEintrag.Show;
                $scope.Titel = aktEintrag.Titel;
            }
            else {
                return;
            }
            // Timer in Abhängigkeit von der aktuellen Zeit setzen
            // Endzeit berechnen....
            // Restzeit berechnen 
            // Endzeit = Aktuelle Zeit + Duration (s) - aktSpielzeit (s)
            //
            $scope.endZeit = moment(new Date()).add(aktEintrag.Duration - aktWerte.aktSpielzeit, "seconds").toDate();
            // Restzeit = Duration(s) - aktSpielzeit(s9
            $scope.leftTime = new Date(2000, 1, 1, 0, 0, aktEintrag.Duration - aktWerte.aktSpielzeit);
        } // function 
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: setNewTime
        //           hier werden die Zeiten und internen Variablen belegt
        //           bei einer fehlerhaften Info wird nichts durchgeführt
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        function setNewTime(time) {
            if (time > -1) {
                if (time < aktWerte.aktSpielzeit) {
                    getFullInfo();
                }
                aktWerte.aktSpielzeit = time;
                belegeScopeWerte();
            }
        } //setNewTime
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: getSEClass
        //           Die class für Season - Episode Anzeige soll noch farblich darstellen, wann
        //           der Link tatsächlich auf die Episode in IMDB verweist
        //           Dazu wird im HTML mit ngClass diese Funktion aufgerufen, 
        //           die dann in Abhängigkeit des Parameters die entsprechende Klasse zurückgibt
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.getSEClass = function (url) {
            //    alert( url )
            if (url.indexOf("ttep_") > -1) {
                return "episeaGreen";
            }
            else if (url.indexOf("/tt") > -1) {
                return "episeaYellow";
            }
            else if (url.indexOf("/title/") > -1) {
                return "episeaRed";
            }
            else
                return "episeaPurple";
        };
        // Bilderleiste anlegen
        //      1) Welche Breite hat der Bildschirm ==> Anzahl und Breite der Bilder
        //      2) Bilder darstellen
        //         a) aktuelle Anzahl < Platz ==> zentrieren
        //         b) aktuelle Anzahl = Platz ==> OK
        //         c) aktuelle Anzahl > Platz ==> Chevrolet-Zeichen rechts/links zum Scrollen
        //
        function anlegenBilderleiste() {
            alert(angular.element(document.querySelector("#hbeIdImg")).html());
            // 1) Welche Breite hat der Bildschirm ==> Anzahl und Breite der Bilder
            //
            var AnzBilder, BreiteBilder;
            var w = $window.innerWidth;
            if (w < 768) {
                AnzBilder = 4;
            }
            else if (w < 992) {
                AnzBilder = 4;
            }
            else if (w < 1200) {
                AnzBilder = 6;
            }
            else {
                AnzBilder = 6;
            }
            BreiteBilder = w / AnzBilder;
            var ele;
            ele = angular.element(document.querySelector("#hbeIdImg"));
            ele.empty();
            for (var i = 0; i < 4; i++) {
                // <img  class="img-responsive center-block" holder="holder.js/300x441?random=yes&text=1" height="100">
                //          ele.append( '<div class="col-xs-3"><img  class="img-responsive center-block" src="' + arPlayList[i].imgSrcNode + '" width="200"> </div>' )
                ele.append('<div class="col-xs-3"><img  class="img-responsive center-block" src="' + arPlayList[i].imgSrcNode + '" width="200"> </div>');
            }
            // angular.bootstrap( document, ["hbeVLC"] )
        }
        // getfullinfo fragt beim Node-Server an, und holt sich von dort die Infos über laufendes Video
        // und Playlist
        // Es wird hier der Node-Server angefragt, da ich von diesem die Images benötige (diese müssen notfalls
        // aber noch in das entsprechende Image-Verzeichnis auf dem Node-Server kopiert werden)
        function getFullInfo() {
            // var url = "http://192.168.178.18:6001/getfullinfo"
            var url = "http://" + ServerAddress + ":6001/getfullinfo";
            //           if ( navigator.platform === "ARM" ) { alert( "ID:" + globalWinMobile ) }
            //           if ( navigator.platform === "ARM" ) { alert( "URL:" + url ) }
            $http.get(url).then(function () { alert("erfolg"); }, function (reason) { alert("error aus http.get"); }, function () { alert("notify"); });
            $http.get(url)
                .then(// success
            function (response) {
                //                   if ( navigator.platform === "ARM" ) { alert( "Get-Success" ) }
                // manchmal werden keine aktuellen Werte übertragen... dann wiederhole ich diesen Aufruf in einer Sekunde
                if (response.data.aktWerte.aktPos < 0) {
                    $timeout(getFullInfo);
                    return;
                }
                aktWerte = response.data.aktWerte;
                if (navigator.platform === "iPhone") {
                    alert("aktWerte: " + aktWerte.aktPos + " : " + aktWerte.aktSpielzeit + " : " + aktWerte.aktTitel);
                }
                fillPlaylist(response.data.playListForWebServer);
                belegeScopeWerte();
                // Bilderleiste anzeigen
                anlegenBilderleiste();
                // Timer zur regelmäßigen Zeitabfrage starten...
                if (angular.isDefined(timerGetTime)) {
                    $interval.cancel(timerGetTime);
                }
                timerGetTime = $interval(getCurrentTimeFromVLCSteuerung, 5000);
            }, // error-callback
            function (response) {
                //                  if ( navigator.platform === "ARM" ) { alert( "Get-Error" ) }
                alert("Fehler in getFullInfo: " + response.errmsg);
            }); // then
        } // ...function getFullInfo
        $scope.$on("$destroy", function () {
            if (angular.isDefined(timerToken)) {
                $interval.cancel(timerToken);
            }
            if (angular.isDefined(timerGetTime)) {
                $interval.cancel(timerGetTime);
            }
        });
        if (navigator.platform === "ARM") {
            alert("Hallo, blödes WinPhone!");
        }
        //alert( "Platf:" + navigator.platform )
        //alert( "H-W: " + $( window ).height() + " - " + $( window ).width() ) 
        //alert("Screen H-W:" + screen.height + " - " + screen.width)
        /// Wird regelmäßig abgefragt - über einen Timer gestartet, und holt die 
        // aktuelle Zeit, sowie die aktualisierten Infos über die URLs
        function getCurrentTimeFromVLCSteuerung() {
            //  var url = "http://192.168.178.18:6001/getCurrentTime"
            var url = "http://" + ServerAddress + ":6001/getCurrentTime";
            $http.get(url)
                .then(// success
            function (response) {
                //                   if ( navigator.platform === "ARM" ) { alert( "Get-Success" ) }
                setNewTime((response.data.time));
                if (response.data.urlInfo) {
                    // 05.06.2016 
                    // funktioniert nicht mehr über den Shownamen, da ich diesen um Season und Episode erweitert habe
                    // Alternativ versuche ich es über die Position
                    // $scope.imdbURL = response.data.urlInfo[arPlayList[aktWerte.aktPos].Show].ImdbURL
                    Object.keys(response.data.urlInfo).forEach(function (key, index) {
                        if (index == aktWerte.aktPos) {
                            $scope.imdbURL = response.data.urlInfo[key].ImdbURL;
                        }
                    });
                }
            }, // error-callback
            function (response) { }); // then
        } // function getCurrentTimeFromVLCSteuerung
        // Initilisierung, damit schon mal etwas angezeigt wird
        init(new Date(2000, 1, 1, 0, 22, 32), new Date(2000, 1, 1, 0, 44, 56));
        // vollständige Informationen holen
        getFullInfo();
        var timerToken = $interval(hbetimer, 1000);
        // TEST TEST TEST TEST TEST TEST 
        //
    }]) // controller mainCtrl
    .controller('CarouselDemoCtrl', function ($scope) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;
    $scope.addSlide = function () {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'http://lorempixel.com/' + newWidth + '/300',
            text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
            id: currIndex++
        });
    };
    $scope.randomize = function () {
        var indexes = generateIndexesArray();
        assignNewIndexesToSlides(indexes);
    };
    for (var i = 0; i < 4; i++) {
        $scope.addSlide();
    }
    // Randomize logic below
    function assignNewIndexesToSlides(indexes) {
        for (var i = 0, l = slides.length; i < l; i++) {
            slides[i].id = indexes.pop();
        }
    }
    function generateIndexesArray() {
        var indexes = [];
        for (var i = 0; i < currIndex; ++i) {
            indexes[i] = i;
        }
        return shuffle(indexes);
    }
    // http://stackoverflow.com/questions/962802#962890
    function shuffle(array) {
        var tmp, current, top = array.length;
        if (top) {
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
        }
        return array;
    }
    alert("carou controller");
})
    .controller("SteuerungCtrl", ["$scope", "$timeout", "$interval", "$http", "$location", "$window",
    function ($scope, $timeout, $interval, $http, $location, $window) {
        // this festnageln auf interne Variable self
        var self = this;
        var isPlaying = true;
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // function: GO
        //           - Funktion, um auf eine andere interne Seite zu springen
        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        $scope.go = function (path) {
            $location.path(path);
        };
        $scope.sendSeek = function (num) {
            // hier wird die Server-Adresse gepeichert: 192.168.178.xxx
            var ServerAddress = location.hostname;
            var xxx = { "seekTime": num };
            $http.post("http://" + ServerAddress + ":6001/sendSeek", xxx)
                .then(function succCB(response) {
                // alert ("SUCC: " + response)
            }, function errCB(response) {
                alert("ERR: " + response);
                alert("sendSeek : " + num.toString());
            });
        };
        $scope.StartStopImage = "../images/PauseHot-128.png";
        $scope.sendStartStop = function () {
            if (isPlaying) {
                console.info("pause geliefert");
                $scope.StartStopImage = "../images/PauseHot-128.png";
            }
            else {
                console.info("play geliefert");
                $scope.StartStopImage = "../images/Play-128.png";
            }
            isPlaying = !isPlaying;
            $scope.sendSeek(0);
        };
    }]);
//# sourceMappingURL=hbeCtrl.js.map