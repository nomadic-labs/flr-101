import aws from './init';


export const uploadFile = file => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "flr-101",
      Key: file.name,
      Body: file,
      ACL: "public-read"
    }

    aws.upload(params, (err, data) => {
      if (err) {
        console.log("AWS error", err)
        reject(`Error uploading file: ${err}`)
      }

      console.log("AWS data", data)
      resolve(data["Location"])
    })
  });
}



