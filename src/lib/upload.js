export const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "First_Time_Using");
  
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dymfpsqiz/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
  
    const result = await res.json();
    return result.secure_url;
  };
  