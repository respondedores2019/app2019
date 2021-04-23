//import { initializeApp, auth } from 'firebase-admin';
import { firestore } from 'firebase-tools';
import { https, runWith, config } from 'firebase-functions';

import * as admin from 'firebase-admin';

//initializeApp();
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://primeros-respondedores-5f3ac.firebaseio.com'
});

export const mintAdminToken = https.onCall((data, context) => {
  const uid = data.uid;

  return auth()
    .createCustomToken(uid, { admin: true })
    .then(function(token) {
      return { token: token };
    });
});

export const recursiveDelete = runWith({
    timeoutSeconds: 1200,
    memory: '2GB'
  })
  .https.onCall((data, context) => {
    // Only allow admin users to execute this function.
    if (!(context.auth && context.auth.token && context.auth.token.admin)) {
      throw new https.HttpsError(
        'permission-denied',
        'Must be an administrative user to initiate delete.'
      );
    }

    const path = data.path;
    console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`
    );

    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    return firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: config().fb.token
      })
      .then(() => {
        return {
          path: path 
        };
      });
  });
  // [END recursive_delete_function]