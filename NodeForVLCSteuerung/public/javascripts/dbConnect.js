"use strict";
//var mysql = require( "mysql" )
var mysql = require("mysql");
console.log("mySql importiert");
var config = require("../config.json");
var sqlHost = config.mySqlHost;
console.log("SQL-Host:" + sqlHost);
var connection = mysql.createConnection({
    // host: "localhost",
    // host: "192.168.178.160",
    host: sqlHost,
    user: "root",
    password: "HeinzHeinz",
    database: "dbshow"
});
connection.connect(function (err) {
    if (err) {
        console.error("error connection : " + err.stack);
        return;
    }
    console.log("connected as id: " + connection.threadId);
    // Anzahl der Einträge in tbshows
    connection.query("SELECT COUNT(*) FROM tbshows", function (err, rows, fields) {
        if (err) {
            console.error("error counting entries");
            return;
        } //if..
        console.log("number of entries: " + rows[0]["COUNT(*)"]);
    } // function...
     // function...
    ); //query
    // oder mit einem Namen
    connection.query("SELECT COUNT(*) as anzahl FROM tbshows", function (err, rows, fields) {
        if (err) {
            console.error("error counting entries");
            return;
        } //if..
        console.log("number of entries: " + rows[0].anzahl);
    } // function...
     // function...
    ); //query
    // oder mit einem Namen und Filter
    connection.query("SELECT COUNT(*) as anzahl FROM tbshows where seasons = 3", function (err, rows, fields) {
        if (err) {
            console.error("error counting season entries");
            return;
        } //if..
        console.log("number of entries with season = 3: " + rows[0].anzahl);
    } // function...
     // function...
    ); //query
    // oder mit einem Namen und Filter und Variablen
    var AnzSeason = 4;
    connection.query("SELECT COUNT(*) as anzahl FROM tbshows where seasons = ?", [AnzSeason], function (err, rows, fields) {
        if (err) {
            console.error("error counting season entries");
            return;
        } //if..
        console.log("number of entries with season = 4: " + rows[0].anzahl);
    } // function...
     // function...
    ); //query
});
module.exports = connection;
//# sourceMappingURL=dbConnect.js.map