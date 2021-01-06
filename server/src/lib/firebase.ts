import * as admin from "firebase-admin";

const serviceAccount = require("../../serviceAccountKey.json") as admin.ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
