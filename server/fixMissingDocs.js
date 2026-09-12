const admin = require('firebase-admin');
const serviceAccount = require('./.secrets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function main() {
  try {
    const list = await admin.auth().listUsers(1000);
    for (const user of list.users) {
      const uid = user.uid;
      const docRef = db.collection('users').doc(uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        console.log('Creating doc for', user.email, uid);
        await docRef.set({
          email: user.email || null,
          displayName: user.displayName || null,
          role: 'buyer',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
    console.log('Done')
  } catch (err) {
    console.error('Error fixing docs:', err)
    process.exit(1)
  }
}

main()
