import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

// a timeout function that will show an error if the Promise is not resolved
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// instead of two very similar functions for getting JSON we use one
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// OLD functions
/////////////////////////////////////////////////////////////////////////////////
// This function returns the 'data' we need in 'loadRecipe' function in 'model.js'
// the 'url' parameter is passed in via 'loadRecipe' function that takes in
// an API URL from 'config.js'
// export const getJSON = async function (url) {
//   try {
//     // whichever 'Promise' is resolved first
//     // 1. if 'fetch(url)' is resolved before the timeout function is resolved, the function
//     //continues normally
//     // 2. if 'timeout' is resolved first, there will be a timeout error
//     const fetchPromise = fetch(url);
//     const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();
//     if (!response.ok)
//       throw new Error(
//         `${data.message} (${response.status}) ${response.statusText}`
//       );
//     return data;
//   } catch (error) {
//     // in order to show the error in the model.js where the 'getJSON' function is called
//     // we have to manually 'throw' the error after catching it
//     throw error;
//   }
// };

// // This function returns the 'data' we need in 'uploadRecipe' function in 'model.js'
// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPromise = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData)
//     });

//     const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();
//     if (!response.ok)
//       throw new Error(
//         `${data.message} (${response.status}) ${response.statusText}`
//       );
//     return data;
//   } catch (error) {
//     // in order to show the error in the model.js where the 'getJSON' function is called
//     // we have to manually 'throw' the error after catching it
//     throw error;
//   }
// };
