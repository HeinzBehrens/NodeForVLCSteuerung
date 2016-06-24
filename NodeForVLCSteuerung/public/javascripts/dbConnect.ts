//var mysql = require( "mysql" )
import * as mysql from "mysql"

console.log( "mySql importiert" )

var config = require( "../config.json" )

var sqlHost: string = config.mySqlHost
console.log ("SQL-Host:" + sqlHost )

var connection = mysql.createConnection( {
   // host: "localhost",
   // host: "192.168.178.160",
    host: sqlHost ,
    user: "root",
    password: "HeinzHeinz",
    database: "dbshow"
})

connection.connect( function ( err: mysql.IError ) {
    if ( err ) {
        console.error( "error connection : " + err.stack )
        return
    }
    console.log( "connected as id: " + connection.threadId )

    // Anzahl der Einträge in tbshows
    connection.query( "SELECT COUNT(*) FROM tbshows", function ( err: mysql.IError, rows: any, fields: any ) {
        if ( err ) {
            console.error( "error counting entries" )
            return
        } //if..
        console.log( "number of entries: " + rows[0]["COUNT(*)"] )

    } // function...
    ) //query

    // oder mit einem Namen
    connection.query( "SELECT COUNT(*) as anzahl FROM tbshows", function ( err: mysql.IError, rows: any, fields: any ) {
        if ( err ) {
            console.error( "error counting entries" )
            return
        } //if..
        console.log( "number of entries: " + rows[0].anzahl )

    } // function...
    ) //query


    // oder mit einem Namen und Filter
    connection.query( "SELECT COUNT(*) as anzahl FROM tbshows where seasons = 3", function ( err: mysql.IError, rows: any, fields: any ) {
        if ( err ) {
            console.error( "error counting season entries" )
            return
        } //if..
        console.log( "number of entries with season = 3: " + rows[0].anzahl )

    } // function...
    ) //query

    // oder mit einem Namen und Filter und Variablen
    var AnzSeason: number = 4
    connection.query( "SELECT COUNT(*) as anzahl FROM tbshows where seasons = ?", [AnzSeason], function ( err: mysql.IError, rows: any, fields: any ) {
        if ( err ) {
            console.error( "error counting season entries" )
            return
        } //if..
        console.log( "number of entries with season = 4: " + rows[0].anzahl )

    } // function...
    ) //query
})

module.exports = connection 