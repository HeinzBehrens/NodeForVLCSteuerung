/*
 * GET users listing.
 */
import express = require('express');

export function list(req: express.Request, res: express.Response) {
    res.send( "<html> <h1> halloU </h1> </html>" )
};