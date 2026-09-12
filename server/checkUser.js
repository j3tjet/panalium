const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./.secrets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function check(uid) {
  if (!uid) {
    console.error('Usage: node checkUser.js <uid>');
    process.exit(1);
  }
  const doc = await db.collection('users').doc(uid).get();
  if (!doc.exists) {
    console.log('No user document found for', uid);
  } else {
    console.log('User doc:', doc.data());
  }
}

check(process.argv[2]).catch(err => { console.error(err); process.exit(1); });
