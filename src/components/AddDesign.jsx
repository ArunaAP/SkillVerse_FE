import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { jwtDecode } from "jwt-decode";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
const apiUrl = import.meta.env.VITE_API_URL;

const AddDesignForm = () => {
  const { briefId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle image drop
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    const cloudName = "dmr1wvwz3"; // Replace with your Cloudinary cloud name
    const uploadPreset = "MyPrest"; // Replace with your Cloudinary upload preset

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      const uploadedImageUrl = data.secure_url; // Get the original image URL (without transformations)

      // Return the original image URL (no transformations)
      return uploadedImageUrl;
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      throw err;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (image) {
        // Get the original image URL (no transformations)
        imageUrl = await uploadImageToCloudinary(image);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const decodedToken = jwtDecode(token);
      const designer = decodedToken.id;

      const requestData = {
        title,
        description,
        brief: briefId,
        designer,
        image: imageUrl, // Pass the original image URL (without transformations)
      };

      // Send the data to your backend
      const response = await fetch(`${apiUrl}/api/design/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to add design");
      }

      const result = await response.json();
      console.log("Design added:", result);
      // Redirect or show success message
    } catch (err) {
      console.error("Error adding design:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Submit Design</h1>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Drop Area */}

        <div
          {...getRootProps()}
          className="w-full md:w-1/2 p-6 border-2 border-dashed border-gray-300 rounded-md  h-80 flex justify-center items-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-full object-cover"
            />
          ) : (
            <p className="text-gray-500 text-center">
              Drag and drop an image here, or click to select one
            </p>
          )}
        </div>

        {/* Right Side: Form Inputs */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Design Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="7"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`py-2 px-4 text-white bg-blue rounded-full focus:outline-none hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Design"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default AddDesignForm;
