const cloudinary = import('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'dqdv64tfy', // ← replace this if needed
  api_key: '846377132685511', // ← replace this if needed
  api_secret: 'd4ELIcJDF5YRdnzuTMquOvDW0V0' // ← replace this if needed
});

async function runTest() {
  try {
    // 2. Upload a sample image
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { public_id: 'sample_upload' }
    );

    console.log("--- Upload Successful ---");
    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);

    // 3. Get image details
    console.log("\n--- Image Metadata ---");
    console.log(`Width: ${uploadResult.width}px, Height: ${uploadResult.height}px`);
    console.log(`Format: ${uploadResult.format}, Size: ${uploadResult.bytes} bytes`);

    // 4. Transform the image
    // f_auto: Automatically selects the best format (e.g., WebP) for the user's browser
    // q_auto: Automatically adjusts quality to balance visual clarity and file size
    const optimizedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log("\n--- Transformation Complete ---");
    console.log("Done! Click the link below to see the optimized version of the image.");
    console.log("Check the browser developer tools to see the format and size efficiency.");
    console.log("Optimized URL:", optimizedUrl);

  } catch (error) {
    console.error("Error during Cloudinary integration:", error);
  }
}

runTest();