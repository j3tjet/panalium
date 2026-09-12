const admin = require('firebase-admin');

const serviceAccount = require('./.secrets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdmin(uid) {
  if (!uid) {
    console.error('Usage: node setAdmin.js <uid>');
    process.exit(1);
  }
  await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
  console.log('Set admin role for', uid);
}

setAdmin(process.argv[2]).catch(err => { console.error(err); process.exit(1); });
