
const PouchDB = require('pouchdb') ;
PouchDB.plugin(require('pouchdb-find'));
module.exports.userdb = new PouchDB('users');
module.exports.refreshTokendb = new PouchDB('refreshtokens');
