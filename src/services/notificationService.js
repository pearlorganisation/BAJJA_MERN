// import { getAccessToken } from "../configs/firebaseConfig.js";
// import axios from "axios";

// // Function to send notification
// export async function sendNotificationToSelectedDevice(
//   deviceToken,
//   notiTitle,
//   notiBody,
//   customData = null
// ) {
//   const serverAccessKey = await getAccessToken(); // get access token
// //   console.log("--------------", serverAccessKey);

//   const apiUrl =
//     "https://fcm.googleapis.com/v1/projects/gogoa-4d569/messages:send";

//   const messageBody = {
//     message: {
//       token: deviceToken,
//       notification: {
//         title: notiTitle,
//         body: notiBody,
//       },
//       ...(customData && { data: customData }), // Conditional data field
//     },
//   };

//   try {
//     const response = await axios.post(apiUrl, messageBody, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${serverAccessKey}`,
//       },
//     });
//     console.log(
//       `Status code: ${response.status} >> Response: ${response.data}`
//     );
//   } catch (error) {
//     if (error.response) {
//       console.error("Error status:", error.response.status);
//       console.error("Error data:", error.response.data);
//     } else {
//       console.error("Error message:", error.message);
//     }
//   }
// }
