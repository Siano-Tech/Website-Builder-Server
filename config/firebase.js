const admin = require('firebase-admin');
const serviceAccount = require('./digiclinik-live-firebase-adminsdk-hgwzl-aced720db4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://digiclinik-live-default-rtdb.firebaseio.com"
});

const db = admin.database();
module.exports = { admin, db };
