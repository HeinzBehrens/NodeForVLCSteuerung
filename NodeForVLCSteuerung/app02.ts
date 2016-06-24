// folgende Zeilen sind gleichwertig, wobei die import * die neue Version ist
// import express = require('express')
// import * as express from 'express'

import * as express from "express";
import * as path from "path";

// typically this middleware will come very early in your stack ( maybe even first) to avoid processing
//
// any other middleware if we already know the request is for /favicon.ico.
// example for EXPRESS
//      var express = require( 'express' );
//      var favicon = require( 'serve-favicon' );
// 
//      var app = express();
//      app.use( favicon( __dirname + '/public/favicon.ico' ) );
//
//    The favicon is supposed to be a set of 16x16, 32x32 and 48x48 pictures in ICO format.
//    An ICO file can contain several pictures and Microsoft recommends to put 
//    16x16, 32x32 and 48x48 versions of the icon in favicon.ico

import * as favicon from "serve-favicon";


// *************** MORGAN --> https://www.npmjs.com/package/morgan
// **************************************************************************************
// HTTP request logger middleware for node.js
// Write log line on request instead of response. 
// This means that a requests will be logged even if the server crashes, 
// but data from the response ( like the response code, content length, etc.) cannot be logged.
import * as logger  from "morgan"

// *************** COOKIE-PARSER --> https://www.npmjs.com/package/cookie-parser
// **************************************************************************************
// 
// Parse Cookie header and populate req.cookies with an object 
// keyed by the cookie names. Optionally you may enable signed cookie support 
// by passing a secret string, which assigns req.secret so it may be used by other middleware.
//
import * as cookieParser from 'cookie-parser'


// ************** BODY-PARSER --> https://www.npmjs.com/package/body-parser
// **************************************************************************************
//
// The bodyParser object exposes various factories to create middlewares. 
// All middlewares will populate the req.body property with the parsed body, 
// or an empty object ( {}) if there was no body to parse ( or an error was returned).
//
// The various errors returned by this module are described in the errors section.
import * as bodyParser from 'body-parser'


// ************** CORS --> https://www.npmjs.com/package/cors
// **************************************************************************************
//
// middleware for dynamically or statically enabling CORS in express/connect applications
import * as cors from 'cors'



// nun wird die Hauptvariable für den EXPRESS-Zugang definiert
// -----------------------------------------------------------
// 
var app: express.Express = express();

// uncomment after placing your favicon in /public
app.use( favicon( __dirname + '/public/favicon.ico' ) );

// Cross Origin - also Zugriffe aus einer anderen Domaine erlauben
app.use( cors() )

// USE OF... morgan
// dev: Concise output colored by response status for development use.
// The: status token will be colored 
//      red for server error codes, 
//      yellow for client error codes, 
//      cyan for redirection codes, and 
//      uncolored for all other codes.
// 
// Format: :method :url :status :response-time ms - :res[content-length]
app.use( logger( 'dev' ) );

// USE OF... bodyParser.json( options )
// Returns middleware that only parses json. 
// This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.
// 
// A new body object containing the parsed data is populated on the request object after the middleware ( i.e.req.body ).
app.use( bodyParser.json() );

// USE OF...bodyParser.urlencoded (options)
//
// bodyParser.urlencoded(options)
// Returns middleware that only parses urlencoded bodies. 
// This parser accepts only UTF- 8 encoding of the body and supports automatic inflation of gzip and deflate encodings.
//
// A new body object containing the parsed data is populated 
// on the request object after the middleware ( i.e.req.body ). 
// This object will contain key- value pairs, where the value can be a string or 
// array( when extended is false), or any type ( when extended is true).
// 
//  Options
// 
// The urlencoded function takes an option options object that may contain any of the following keys:
//
// extended
// The extended option allows to choose between parsing the URL- encoded data 
// with the querystring library ( when false) or the qs library ( when true). 
// The "extended" syntax allows for rich objects and arrays to be encoded 
// into the URL- encoded format, allowing for a JSON- like experience with URL- encoded.
// For more information, please see the qs library.
//
// Defaults to true, but using the default has been deprecated.
// Please research into the difference between qs and querystring and choose the appropriate setting.
app.use( bodyParser.urlencoded( { extended: false }) );


// USE OF... cookieParser
// 
// cookieParser(secret, options)
//
//  - secret a string or array used for signing cookies.
//    This is optional and if not specified, will not parse signed cookies.
//    If a string is provided, this is used as the secret. 
//    If an array is provided, an attempt will be made to unsign the cookie with each secret in order.
//
// - options an object that is passed to cookie.parse as the second option. 
//   See cookie for more information.
//   decode a function to decode the value of the cookie
app.use( cookieParser() );


// ----------------------------------------------------------------------------------------------------------------
// für statische Dateianfragen muss noch der Pfad gesetzt werden
// z.B. wird ein Stylesheet in layout.jade erwartet
// href='/stylesheets/style.css')
// Damit dies aufgelöst werden kann, wird das public-Verzeichnis auf statisch gesetzt
// Es düfren auch mehrere statische Verzeichnisse aufgeführt werden. Sie werden dann in der 
// Reihenfolge der Deklaration durchgegangen
// Beispiel: die Datei bild.jpg befindet sich in dem Verzeichnis: /public/pictures
//           Festlegung der Static-Zuweisung: app.use(express.static (path.join(__dirname, 'public/pictures')
//           Aufruf: http://localhost/bild.jpg
//
//           Festlegung: app.use(express.static(path.join(__dirname, 'public')))
//           Aufruf: http://localhost/pictures/bild.jpg
//
//           Es sind auch virtuelle Verzeichnisse erlaubt, die dann auf das physikalische Verzeichnis verweisen
//           Festlegung: app.use('/hbeBilder', express.static (path.join(__dirname, 'public/pictures')
//           Aufruf: http://localhost/hbeBilder/bild.jpg
// ----------------------------------------------------------------------------------------------------------------

// USE OF... serveStatic( root, options )
// 
// Create a new middleware function to serve files from within a given root directory.
// The file to serve will be determined by combining req.url with the provided root directory.
// When a file is not found, instead of sending a 404 response, 
// this module will instead call next() to move on to the next middleware, allowing for stacking and fall- backs.
// 
var serveStatic = require( 'serve-static' )
app.use( serveStatic( path.join( __dirname, 'public' ) ) );
app.use( '/hbeBilder', serveStatic( path.join( __dirname, 'public/images' ) ) )



// ----------------------------------------------------------------------------------------------------------------
// ein paar Routen laden, um darauf verweisen zu können
// ----------------------------------------------------------------------------------------------------------------
var routes = require( './routes/index' );
var users = require( './routes/user' );


// ----------------------------------------------------------------------------------------------------------------
// ein paar Routen laden, um darauf verweisen zu können
// ----------------------------------------------------------------------------------------------------------------
var routes = require( './public/javascripts/hbeRoutes' );


// ----------------------------------------------------------------------------------------------------------------
// Die Verzweigungen, je nach Aufruf
// ----------------------------------------------------------------------------------------------------------------
app.use( '/', routes )
//app.use( '/getfullinfo', routes )
//app.use( '/test2', routes )
//app.use( '/test1', routes )


// ----------------------------------------------------------------------------------------------------------------
// catch 404 and forward to error handler
// wenn keine Route zum Ziel führt, d.h. Request hat einen ungültigen Pfad, dann wird ein 404 Fehler erzeugt,
// und danach der Fehler an den Errorhandler übergeben
// ----------------------------------------------------------------------------------------------------------------
app.use( function ( req, res, next ) {
    var err = new Error( 'Page not Found' );
    err.status = 404;
    next( err );
});

// ----------------------------------------------------------------------------------------------------------------
// error handlers
// ----------------------------------------------------------------------------------------------------------------
if ( app.get( 'env' ) === 'development' ) {
    app.use( function ( err: any, req: express.Request, res: express.Response, next: Function ) {
        res.status( err.status || 500 )
        res.render( 'error', {
            message: err.message,
            error: err
        })
    })
}

// ----------------------------------------------------------------------------------------------------------------
// production error handler
// no stacktraces leaked to user
// ----------------------------------------------------------------------------------------------------------------
app.use( function ( err: any, req: express.Request, res: express.Response, next: Function ) {
    res.status( err.status || 500 );
    res.render( 'error', {
        message: err.message,
        error: {}
    });
});


var dbConn = require ("./public/javascripts/dbConnect")



module.exports = app;
