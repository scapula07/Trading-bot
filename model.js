const Datastore = require('nedb')

module.exports.userDB = new Datastore({ filename: "database/user.db",autoload: true });
module.exports.refreshTokensDB =new Datastore({ filename: "database/refreshtoken.db",autoload: true });