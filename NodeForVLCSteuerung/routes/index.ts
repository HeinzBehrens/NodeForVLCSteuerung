/*
 * GET home page.
 */
import express = require('express');

export function users( req: express.Request, res: express.Response ) {
    res.send("<html> <h1> halloX </h1> </html>")
};