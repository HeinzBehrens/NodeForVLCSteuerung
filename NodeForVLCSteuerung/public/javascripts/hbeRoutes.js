"use strict";
/// <reference path="dbConnect.ts" />
/// <reference path="../../Scripts/typings/mysql.d.ts" />
/// <reference path="hbeClasses.ts" />
/// <reference path="../../Scripts/typings/request.d.ts" />
/// <reference path="../../Scripts/typings/node.d.ts" />
// da ich auf Funktionen von express zugreifen möchte
var express = require("express");
var path = require('path');
// Debugging-Information vernünftig ausgeben
var debug = require('debug')('hbeRoutes');
debug("HBE Routes started ****** HBE Routes started ***** HBE Routes started ***** HBE Routes started ***** HBE Routes started ***** HBE Routes started ***** ");
// Zugriff auf Datenbanken
var dbConn = require("./dbConnect");
// für HTTP-Requests
var request = require("request");
// TEST: HTTP-Seiten durchsuchen
//var jsdom = require( "jsdom" ).jsdom 
var jsdom = require("jsdom");
// Zugriffe auf das Dateisystem
var fs = require("fs");
// Zugriff auf Netzwerk-Schnittstellen
var os = require("os");
// einige nützliche Utilities: https://nodejs.org/api/util.html
// z.B. ein Objekt ausgeben: util.inspect(object)
var util = require("util");
var myOwnIP = getOwnIpAdresses();
// var urlVLCSteuerungWebServer: string = 'http://192.168.178.18:8887'
var urlVLCSteuerungWebServer = "http://" + myOwnIP + ":8887";
console.log(urlVLCSteuerungWebServer);
var arForIMDB = {};
// hier definiere ich mir einen Router
var router = express.Router();
//       all: IRouterMatcher<T>;
//       get: IRouterMatcher<T>;
//       post: IRouterMatcher<T>;
//       put: IRouterMatcher<T>;
//       delete: IRouterMatcher<T>;
//       patch: IRouterMatcher<T>;
//       options: IRouterMatcher<T>;
//       head: IRouterMatcher<T>;
var test = function (req, res) {
    request({
        // url: 'http://192.168.178.18:8887', //URL to hit
        url: urlVLCSteuerungWebServer,
        qs: { from: 'blog example', time: +new Date() },
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            Name: 'Behrens',
            Vorname: 'Heinz',
            Anfrage: "fullinfo"
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            res.send("Fehler: hello heinz011");
        }
        else {
            console.log(response.statusCode, body);
            res.send(body);
        }
    });
};
// Testfunktion, die den Zugriff auf MySQL zeigt!!!!
// -----------------------------------------------------
var test1 = function (req, res, num) {
    debug("in test1 angekommen...");
    // oder mit einem Namen und Filter und Variablen
    var AnzSeason = 5;
    dbConn.query("SELECT COUNT(*) as anzahl FROM tbshows where seasons = ?", [AnzSeason], function (err, rows, fields) {
        if (err) {
            console.error("error counting season entries");
            return;
        } //if..
        console.log("number of entries with season = " + AnzSeason + ": " + rows[0].anzahl);
    } // function...
     // function...
    ); //query
    res.send("hell heinz in test1 und num: " + num);
};
var test2 = function (req, res) {
    console.log("in test2... von hbeRoutes.ts");
    dbConn.query("SELECT * FROM tbshows limit 4", function (err, rows, fields) {
        if (err) {
            console.error("error getting 4 entries");
            return;
        }
        res.send(rows);
    });
};
router.get("/test1", function (req, res) { test1(req, res, 22); });
router.get("/test2", test2);
//router.get( "/", function ( req, res ) {
//    console.log( "im Slash eingetroffen ##### ##### ##### ##### ##### ##### " )
//    debug( "im Slash eingetroffen" )
//})
request({ url: urlVLCSteuerungWebServer,
    //    qs: { from: 'blog example', time: +new Date() }, //Query string data
    method: 'POST',
    //Lets post the following key/values as form
    json: {
        Name: 'Behrens',
        Vorname: 'Heinz',
        Anfrage: "get_time"
    }
}, function (error, response, body) {
    if (error) {
        debug("*** *** *** *** *** NO CONNECTION TO VLC: " + error);
    }
    else {
        debug("*** *** *** *** *** CONNECTION TO VLC established!");
    }
}); // request
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//                  router.get( "/getCurrentTime"
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------   
router.get("/getCurrentTime", function (req, res) {
    request({
        //url: 'http://192.168.178.18:8887', //URL to hit
        url: urlVLCSteuerungWebServer,
        //    qs: { from: 'blog example', time: +new Date() }, //Query string data
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            Name: 'Behrens',
            Vorname: 'Heinz',
            Anfrage: "get_time"
        }
    }, function (error, response, body) {
        if (error) {
            debug(error);
        }
        else {
            debug("GetTimeAntwort: " + util.inspect(body));
            body.urlInfo = arForIMDB;
            res.send(body);
        }
    }); // request
});
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//                 router.get( "/getfullinfo/:id"
//
//                 hier kann ich auch ncoh anhand einer ID unterscheiden, wird im Moment nicht mehr gebraucht
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------   
router.get("/getfullinfo/:id", function (req, res) {
    var aktID = req.params.id;
    router.get("/getfullinfo");
    debug("ID: " + aktID);
    anfrageAnVlcSteuerung(req, res);
});
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//                 router.get( "/getfullinfo",
//
//                 Anfrage nach allen aktuellen Daten 
//                  Erwartet werden die aktuelle Playliste und der aktuell gespielte Titel
//                 Diese Anfrage wird weiter geleitet an anfrageAnVlcSteuerung 
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------   
router.get("/getfullinfo", function (req, res) {
    console.log("im getfullinfo eingetroffen ##### ##### ##### ##### ##### ##### ");
    anfrageAnVlcSteuerung(req, res);
});
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//                 sucheEpisodeInImdb( url: string, episode: number )
//
//                 gesucht wird der LINK in IMDB, der direkt auf diese Episode verweist
//
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------   
function sucheEpisodeInImdb(showArName, episode) {
    // ich hole mir die aktuelle IMDB.url aus der Minidatenbank. 
    // Dieser Eintrag sollte bereits auf die Staffel verweisen
    var url = arForIMDB[showArName].ImdbURL;
    // eine Web-Seite laden über request
    request({ uri: url }, function (error, response, body) {
        // nun den body in ein windows Document Format einlesen, und jquery spendieren, damit ich damit weiter arbeiten kann
        jsdom.env(body, ["http://code.jquery.com/jquery-1.5.min.js"], function (err, window) {
            if (err) {
                debug("Fehler in jsdom für: " + url);
                return;
            }
            var neuImdbUrl;
            var $ = window.jQuery;
            var elements = $(".eplist .image a");
            if (elements.length >= episode) {
                var gesuchtEpisode = $(elements[episode - 1]).attr("href");
                if (!!gesuchtEpisode && gesuchtEpisode.length > 0) {
                    arForIMDB[showArName].ImdbURL = "http://www.imdb.com" + gesuchtEpisode;
                }
            }
            window.close(); // Resourcen wieder freigeben
        }); // jsdom.env
    }); // request
} // ..function
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//                 function anfrageAnVlcSteuerung
//
//                 Anfrage an VLC: - Zwischenstufe ist mein VLCSteuerungsprogramm, dass diese Infos liefert
//
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------   
function anfrageAnVlcSteuerung(req, res) {
    request({
        // url: 'http://192.168.178.18:8887', //URL to hit
        url: urlVLCSteuerungWebServer,
        //    qs: { from: 'blog example', time: +new Date() }, //Query string data
        method: 'POST',
        //Lets post the following key/values as form
        json: {
            Name: 'Behrens',
            Vorname: 'Heinz',
            Anfrage: "fullinfo"
        }
    }, function (error, response, body) {
        if (error) {
            debug(error);
        }
        else {
            // dann nehme ich mal die Playlist entgegen
            console.log("Vor bodyPlaylist");
            var playlist = body.playListForWebServer;
            // Pfad zu den Images in diesem Programm festlegen...
            var imagePath = path.resolve(".", "public", "images");
            // Hier wird der Zähler eingerichtet, um festzustellen, wann ich fertig bin...
            //
            var ImagesGesamt = playlist.length;
            var ImagesFertig = 0;
            var _loop_1 = function(i) {
                var showToLookFor = playlist[i].Show.trim();
                playlist[i].Show = showToLookFor;
                var showToLookForEpisode = playlist[i].Episode;
                var showToLookForSeason = playlist[i].Season;
                var showArName = showToLookFor + "S" + showToLookForSeason.toString() + "E" + showToLookForEpisode.toString();
                // zunächst testen, ob diese Show schon mal abgefragt wurde ==> arForIMDB 
                if (showArName in arForIMDB) {
                    debug("######## Show %s schon in Minidatenbank: %s", playlist[i].Show, arForIMDB[showArName].ImdbID);
                }
                else {
                    var ndxShow = i;
                    debug("showToLookFor:" + showToLookFor);
                    arForIMDB[showArName] = {};
                    arForIMDB[showArName].ImdbURL = "http://www.imdb.com/";
                    debug("imdb für %s suchen!", showToLookFor);
                    // select IMDBid from dbshow.tbshows where `SearchName` like '%The Mindy Project%';
                    qstr = dbConn.format("SELECT  IMDBid as imdbid from dbshow.tbshows where `Show` like ?", ["%" + showToLookFor + "%"]);
                    debug("##### Q-STR:" + qstr);
                    dbConn.query(qstr, function (err, rows, fields) {
                        if (err) {
                            console.error("error getting imdb-ID for " + showToLookFor);
                            debug("####### error getting imdb-ID for " + showToLookFor);
                            return;
                        } //if..
                        if (rows.length == 0) {
                            debug("####### no imdbid found for: " + showToLookFor);
                        }
                        else {
                            console.log("IMDB-ID for %s is %s", showToLookFor, rows[0].imdbid);
                            debug("####### imdb-ID for " + showToLookFor + " is: " + rows[0].imdbid);
                            arForIMDB[showArName].ImdbID = rows[0].imdbid;
                            // und wenn ich die imdbid habe, dann kann ich auch die Serie direkt aufrufen
                            // Aufbau: http://www.imdb.com/title/tt3006802/
                            //  bzw.: http://www.imdb.com/title/tt1358522/episodes?season=3
                            arForIMDB[showArName].ImdbURL = "http://www.imdb.com/title/"
                                + rows[0].imdbid.trim() + "/episodes?season=" + showToLookForSeason;
                            // und jetzt versuche ich noch den Link zur Episode zu bekommen
                            sucheEpisodeInImdb(showArName, showToLookForEpisode);
                        }
                    } // function...
                     // function...
                    ); //query
                }
                if (playlist[i].imgSrc) {
                    // Dateinamen des Images holen
                    imgFilename = playlist[i].imgSrc.split(path.sep).reverse()[0];
                    // 1) Prüfen, ob das Bild im Image-Verzeichnis ist
                    //    JA: ==> fertig
                    try {
                        status = fs.statSync(path.join(imagePath, imgFilename));
                        // 3) playlist[i].imgSrcNode auf das Bild verweisen
                        playlist[i].imgSrcNode = "images" + path.sep + imgFilename;
                        ImagesFertig += 1;
                        sendIfFertig(ImagesGesamt, ImagesFertig, body);
                    }
                    catch (e) {
                        // 2) Bild aus dem Original in das Image-Verzeichnis kopieren
                        copyFile(playlist[i].imgSrc, path.join(imagePath, imgFilename), i, imgFilename, function (err, iLocal, imgName) {
                            if (err) {
                                debug("Error in copying image file...");
                                playlist[i].imgSrcNode = "images" + path.sep + "dummy.jpg";
                                ImagesFertig += 1;
                                sendIfFertig(ImagesGesamt, ImagesFertig, body);
                            }
                            else {
                                // 3) playlist[i].imgSrcNode auf das Bild verweisen
                                playlist[i].imgSrcNode = "images" + path.sep + imgName;
                                ImagesFertig += 1;
                                sendIfFertig(ImagesGesamt, ImagesFertig, body);
                            } // if (err)  ...
                        } // function in copyFile
                         // function in copyFile
                        ); // copyFiile
                    } // try...catch
                } // if playlist[i].imgSrc
                else {
                    // wenn kein Pfad angegeben wurde, dann wird ein ein dummy-Bild verwendet...
                    console.log("### #### #### #### ### ##### Length of Playlist: " + playlist.length + " ### #### #### #### ### ##### ");
                    playlist[i].imgSrcNode = "images" + path.sep + "dummy.jpg";
                    ImagesFertig += 1;
                    sendIfFertig(ImagesGesamt, ImagesFertig, body);
                } // ...Bildbearbeitung
            };
            var qstr, imgFilename, status;
            for (var i = 0; i < playlist.length; i++) {
                _loop_1(i);
            } // ...for playlist durchgehen
        } // ...request-Callback
    }); // request
    function sendIfFertig(gesamt, schonFertig, body) {
        if (gesamt == schonFertig) {
            debug("ende: ", body.playListForWebServer);
            res.send(body);
        }
        else {
            debug("#### sendIfFertig sammelt noch: (%d/%d)", schonFertig, gesamt);
        }
    } // function sendIfFertig
}
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//                  copyFile
//  ---------------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------------   
function copyFile(source, target, i, imgFileName, cb) {
    debug("Copy: ", source, " to: ", target);
    var cbCalled = false;
    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err, i);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err, i);
    });
    wr.on("close", function (ex) {
        done(null, i);
    });
    rd.pipe(wr);
    function done(err, i) {
        debug("done of copyFile");
        if (!cbCalled) {
            debug("cb called in copyFile + i:", i);
            cb(err, i, imgFileName);
            cbCalled = true;
        }
    }
}
function getOwnIpAdresses() {
    var ifaces = os.networkInterfaces();
    var myOwnAddress;
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
            }
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
                if (/192.168.178./i.test(iface.address)) {
                    // Successful match
                    console.log("Meine echte Addr: " + iface.address);
                    myOwnAddress = iface.address;
                }
                else {
                }
            }
            else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
                if (/192.168.178./i.test(iface.address)) {
                    // Successful match
                    console.log("Meine echte Addr: " + iface.address);
                    myOwnAddress = iface.address;
                }
                else {
                }
            }
            ++alias;
        });
    });
    return myOwnAddress;
}
function seekTimeSenden(seekTime) {
    sendStrToVLC("get_time", function (antwort) {
        var zeilen = antwort.split(/\r?\n/);
        // letzte, nichtleere Zeile
        var letzteNichtLeereZeile = -1;
        for (var i = 0; i < zeilen.length; i++) {
            if (zeilen[i].trim().length > 0) {
                letzteNichtLeereZeile = i;
            }
        }
        debug("#### letzte Zeile: ", zeilen[letzteNichtLeereZeile]);
        var neueZeit = Math.max(0, parseInt(zeilen[letzteNichtLeereZeile]) + seekTime);
        if (!isNaN(neueZeit)) {
            sendStrToVLC("seek " + neueZeit, function (Antwort) { });
            sendStrToVLC("key key-position", function (Antwort) { });
        }
        else {
            seekTimeSenden(seekTime);
        }
    });
}
// Aufruf um die Zeit neu zu setzen 
//var xxx: Object = { "seekTime": num }
//$http.post( "http://" + ServerAddress + ":6001/sendSeek", xxx )
router.post("/sendSeek", function (req, res) {
    var seekTime = parseInt(req.body.seekTime);
    debug("angekommene Seektime: " + seekTime);
    if (seekTime == 0) {
        sendStrToVLC("pause", function (msg) { });
    }
    else {
        seekTimeSenden(seekTime);
    }
    res.send("OK");
});
// TESTSZENARIO DATAGRAM - VERBINDUNG ZU VLC
var net = require("net");
//var srv = net.createServer( function ( socket ) {
//    socket.write( "von meinem Socket" )
//    socket.pipe(socket)
//})
//srv.listen( 44321, "127.0.0.1" )
//var client = new net.Socket()
//client.connect( 3333, "localhost", function () {
//    debug( "########## Connected" )
//    debug( "########## %s:%d", client.remoteAddress, client.remotePort )
////    client.write("status\r\n")
//   // client.write("seek +500\r\n")
//      client.write("get_time\r\n")
//})
//debug ("nach client connect")
//client.on( "data", function ( data ) {
//    debug( "########## DATA received: %s", data )
//    client.destroy()
//})
//client.on( "close", function () {
//    debug( "########## CLOSED")
//})
//client.on( "end", function () {
//    debug("########## END")
//})
function sendStrToVLC(msg, cb) {
    var client = new net.Socket();
    // socket.setTimeout(timeout[, callback])
    // SOURCE: https://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback
    // Sets the socket to timeout after timeout milliseconds of inactivity on the socket. 
    // By default net.Socket do not have a timeout.
    // When an idle timeout is triggered the socket will receive a 'timeout' event 
    // but the connection will not be severed.The user must manually end() or destroy() the socket.
    //
    // If timeout is 0, then the existing idle timeout is disabled.
    // 
    // The optional callback parameter will be added as a one time listener for the 'timeout' event.
    client.setTimeout(250);
    debug("#### Socket sends: " + msg);
    client.connect(3333, "localhost", function () {
        client.write(msg + "\r\n");
    });
    client.on("data", function (data) {
        //debug( "########## DATA received: %s", data )
        cb(data.toString("utf8"));
        client.destroy();
    });
    client.on("error", function (err) {
        debug("###### Fehler im Client: " + err);
    });
    client.on("close", function () {
        debug("##### Socket Connection has been closed!");
    });
    // Emitted if the socket times out from inactivity. 
    // This is only to notify that the socket has been idle. 
    // The user must manually close the connection.
    // See also: .setTimout
    client.on("timeout", function () {
        debug("#### Socket timeout!!!");
        client.destroy();
    });
}
//if ( client.write( "status\r\n" ) ) {
//    debug( "########## data successfully sent" )
//} else {
//    debug("########## Couldn't send data!")
//}
//var dgram  = require("dgram")
//var sock = dgram.createSocket( "udp4", function ( err ) {
//    if ( err ) console.log("########## Err in CREATE SOCKET: %s", err)
//    console.log("########## Socket created!")
//})
//sock.bind( 44432, "192.168.178.18", function () {
//    var address = sock.address()
//    console.log( "########## Socket is listening on %s:%d", address.address, address.port )
//})
//sock.on( 'message', function ( msg, rinfo ) {
//    console.log( "########## Received %d bytes from %s: %d\n", msg.length, rinfo.address, rinfo.port )
//    console.log("########## MSG: %s",msg)
//})
//sock.on( 'listening', function ( err ) {
//    var address = sock.address()
//    console.log("########## Socket is listening on %s:%d",address.address, address.port)
//})
//sock.on( 'close', function ( err ) {
//    if ( err ) console.log( "Error: %s", err )
//    console.log("########## Socket closed")
//})
//sock.on( 'error', function ( err ) {
//    if ( err ) console.log( "########## Error in Error: %s", err )
//    console.log( "########## Error function called" )
//    sock.close()
//})
//var myMsg: string = "status"
//sock.send( myMsg, 0, myMsg.length, 3333, "localhost", function (  error: Error, bytes: number )  {
//    if ( error ) ( "Error in send: %s", error )
//    console.log("########## Message sent! Bytes im Msg: %s - Bytes in function: %s",myMsg.length , bytes)
//})
debug("HBE Routes ended ****** HBE Routes ended ***** HBE Routes ended ***** HBE Routes ended ***** HBE Routes ended ***** HBE Routes ended ***** ");
module.exports = router;
//# sourceMappingURL=hbeRoutes.js.map