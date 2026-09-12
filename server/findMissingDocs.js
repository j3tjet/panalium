const admin = require('firebase-admin');
const serviceAccount = require('./.secrets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function main() {
  let result = [];
  try {
    let pageToken;
    do {
      const list = await admin.auth().listUsers(1000, pageToken);
      for (const user of list.users) {
        const uid = user.uid;
        const email = user.email || '';
        const doc = await db.collection('users').doc(uid).get();
        result.push({ uid, email, hasDoc: doc.exists });
      }
      pageToken = list.pageToken;
    } while (pageToken);
    // print summary of users without docs
    const missing = result.filter(r => !r.hasDoc);
    console.log(`Total users: ${result.length}`);
    console.log(`Users without users/{uid} doc: ${missing.length}`);
    for (const m of missing.slice(0, 50)) {
      console.log(`- ${m.email || '<no-email>'} (${m.uid})`);
    }
    if (missing.length > 50) console.log(`...and ${missing.length - 50} more`);
  } catch (err) {
    console.error('Error scanning users:', err);
    process.exit(1);
  }
}

main();
