var admin = require("firebase-admin");

var serviceAccount = require("./../angular-ecommerce-ac49d-firebase-adminsdk-aq5m7-5bfc1dba98.json")


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "angular-ecommerce-ac49d.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket};

