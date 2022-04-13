import Swal from 'sweetalert2';
import { initializeApp } from "firebase/app";
import 'firebase/compat/auth';
import { getStorage } from "firebase/storage";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

export function checkFileSize(files, size, length) {

  return new Promise((resolve, reject) => {
    if (length && files.length > length) {
      Swal.fire({
        icon: 'warning',
        allowOutsideClick: false,
        title: `Please pick less than ${length} files`,
      });
      resolve(false);
    }
    files?.map((item, index) => {
      if ((item?.size / 1024 / 1024).toFixed(2) > size) {
        Swal.fire({
          icon: 'warning',
          allowOutsideClick: false,
          title: `File size cannot exceed more than ${size}MB!`,
        });
        resolve(false);
      }
    });
    resolve(true);
  })
}

export async function uploadFile(files) {
  return new Promise((resolve, reject) => {
    if (files.length === 0) return resolve(false);
    const firebaseConfig = {
      apiKey: "AIzaSyDI1YZ4gaQi1QCk1Fk5WzTHFq7dQbC1IPI",
      authDomain: "mdmb-store.firebaseapp.com",
      projectId: "mdmb-store",
      storageBucket: "mdmb-store.appspot.com",
      messagingSenderId: "901157899102",
      appId: "1:901157899102:web:9b345d69352d6714e39dcf",
      measurementId: "G-V0XJ9RQDNM"
    };

    const firebaseApp = initializeApp(firebaseConfig);
    const storage = getStorage(firebaseApp);
    var progress = 0;

    files.map((file, item) => {
      const sotrageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(sotrageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (snapshot.bytesTransferred === snapshot.totalBytes)
            progress += 1;

        },
        (error) => {
          console.log(error);
          return resolve(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
            file.downloadURL = downloadURL;
            if (progress === files.length)
              return resolve(files);
          });
        }
      )
    })
  })
}
