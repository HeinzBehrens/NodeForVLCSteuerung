"use strict";
/// <reference path="dbConnect.ts" />
/// <reference path="../../Scripts/typings/mysql.d.ts" />
// da ich auf Funktionen von express zugreifen möchte
var express = require("express");
//var app = require( '../../app' );
var debug = require('debug')('hbeRoutes');
var dbConn = require("./dbConnect");
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
    debug("in / angekommen...");
    res.send("hello heinz01");
};
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
    dbConn.query("SELECT * FROM tbshows limit 4", function (err, rows, fields) {
        if (err) {
            console.error("error getting 4 entries");
            return;
        }
        res.send(rows);
    });
};
// GET Aufrufe werden an GET umgelenkt und gibt alle Filme aus 
// zur Zeit beschränkt auf 10 Filme
//
router.get("/", test);
router.get("/test1", function (req, res) { test1(req, res, 22); });
router.get("/test2", test2);
module.exports = router;
//# sourceMappingURL=hbeRoutes.js.map