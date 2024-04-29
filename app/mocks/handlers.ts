// import { http, HttpResponse } from "msw";

// export const handlers = [
//   http.post(
//     "https://res<TEST>.cloudinary.com/:account/image/upload/:version/:userId/:filename",
//     async ({ request, params }) => {
//       const { account, version, userId, filename } = params;
//       console.log(
//         `Account: ${account}\nVersion: ${version}\nUserId: ${userId}\nFilename: ${filename}\n`,
//       );
//       console.log(`Request: ${JSON.stringify(request, null, 2)}`);

//       const file = {
//         public_id: filename,
//         version: version,
//         width: 250,
//         height: 250,
//         format: `jpg`,
//         createdAt: new Date().toISOString(),
//         resource_type: "image",
//         tags: [],
//         bytes: 9_000,
//         type: "upload",
//         etag: "",
//         placeholder: false,
//         url:
//           `http://res.cloudinary.com/${account}/image/upload/v${version}/${userId}/${filename}`,
//         secure_url:
//           `https://res.cloudinary.com/${account}/image/upload/v${version}/${userId}/${filename}`,
//         signature: "abcdef0123456789",
//         original_filename: filename,
//       };
//       return HttpResponse.json({
//         file,
//       });
//     },
//   ),
// ];
