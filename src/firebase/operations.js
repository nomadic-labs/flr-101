import firebase, { stagingFirebase } from "./init";


export const uploadImage = image => {
  return new Promise(resolve => {
    const storage = firebase.storage().ref();
    const fileRef = storage.child(`images/${image.name}`);

    fileRef.put(image).then(snapshot => {
      console.log("snapshot.downloadURL", snapshot.downloadURL)
      resolve(snapshot.downloadURL)
    });
  })
}

export const uploadFile = file => {
  return new Promise(resolve => {
    const storage = firebase.storage().ref();
    const fileRef = storage.child(`files/${file.name}`);

    fileRef.put(file).then(snapshot => {
      console.log("snapshot.downloadURL", snapshot.downloadURL)
      resolve(snapshot.downloadURL)
    });
  })
}

export const copyContentFromStaging = () => {
  return new Promise((resolve, reject) => {
    if (!stagingFirebase) {
      reject("The staging database is not available.")
    }
    const stagingDB = stagingFirebase.database();
    const currentDB = firebase.database();

    stagingDB
      .ref(`pages`)
      .once("value")
      .then(snapshot => {
        const stagingPages = snapshot.val();

        currentDB
          .ref(`pages`)
          .set(stagingPages)
          .then(err => {
            if (err) {
              return reject(err)
            }

            resolve()
          })
      });
  })
}


