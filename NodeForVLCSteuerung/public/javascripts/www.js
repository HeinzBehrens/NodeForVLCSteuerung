// ************************************* STARTDATEI **************************************************
//
// ***************************************************************************************************
// Debug einschalten für DEBUG-Variable:  MongoExpressAngularNode01
// Diese Variable muss als Konstante im Aufruf gesetzt werden 
// Also: Project Properties --> Eigenschaften
// Environment Variables: DEBUG=MongoExpressAngularNode01
//
var debug = require('debug')('www.ts');
var app = require('../../app02');
debug("Port im Env auf: " + process.env.PORT);
// lege hier bewusst den PORT auf 6001, da er sonst wieder 1337 nimmt, und ich mehrere Node-Instanzen starten möchte
// ==> Einstellungen für QanaAServer-Eigenschaften ändern, da jetzt auch dieser PORT aufgerufen werden muss
//app.set( 'port', process.env.PORT || 6001 );
app.set('port', 6001);
var server = app.listen(app.get('port'), function () {
    debug("noch ein debug-test");
    debug('Express server listening on new port ' + server.address().port);
    console.log('Express server listening on new port ' + server.address().port);
});
//# sourceMappingURL=www.js.map