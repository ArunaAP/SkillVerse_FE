import React, { useState } from 'react';
import backgroundImage from '../assets/Rectangle 18.png';
import googleIcon from '../assets/google.png'; 
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const SignUp = () => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Client'); // Default role as Client
  const [job, setJob] = useState('');
  const [region, setRegion] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Track form step
   const [imagePreview, setImagePreview] = useState(null);
   const [image, setImage] = useState(null);

  const navigate = useNavigate();

    // Handle image drop
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      };

  const handleNext = () => {
    if (role === 'Client') {
      handleSignUp(); // Directly submit if Client role
    } else {
      setCurrentStep(2); // Proceed to next step for other roles
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    const cloudName = 'dmr1wvwz3'; // Replace with your Cloudinary cloud name
    const uploadPreset = 'MyPrest'; // Replace with your Cloudinary upload preset
  
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }
  
      const data = await response.json();
      const uploadedImageUrl = data.secure_url; // Get the original image URL (without transformations)
  
      // Return the original image URL (no transformations)
      return uploadedImageUrl;
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
      throw err;
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    let imageUrl = null;
      if (image) {
        // Get the original image URL (no transformations)
        imageUrl = await uploadImageToCloudinary(image);
      }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname,
          username,
          email,
          password,
          role,
          job: role === 'Client' ? '' : job,
          region: role === 'Client' ? '' : region,
          profileImage: role === 'Client' ? '' : imageUrl,
        }),
      });



  

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Sign-up successful:', data);
      navigate('/login'); // Redirect to Login after successful sign up
    } catch (err) {
      console.error('Sign-up error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: 'image/*',
      multiple: false,
    });

  return (
    <div
      className="flex items-center justify-between h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Left Section: LOGO */}
      <div className="flex flex-col justify-center items-center w-1/2 h-full text-white">
        <div className="text-6xl font-bold text-black">Skill<span className="text-primary">Verse</span></div>
      </div>

      {/* Right Section: Sign Up Form */}
      <div className="flex justify-center items-center w-1/2 h-full">
        <div className="bg-white w-full max-w-[500px] p-12 rounded-lg shadow-lg h-auto">
          {currentStep === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up</h2>
              <p className="text-gray-600 mb-6">
                Already have an account?{' '}
                <a href="/login" className="text-blue hover:underline">
                  Log in
                </a>
              </p>

              <form className="space-y-4">
              <div className="space-y-4">
  {/* Full Name */}
  <div>
    <label htmlFor="fullname" className="block text-sm text-gray-700">
      Full Name
    </label>
    <input
      type="text"
      id="fullname"
      value={fullname}
      onChange={(e) => setFullname(e.target.value)}
      className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
      placeholder="Enter your full name"
      required
    />
  </div>

  {/* Username */}
  <div>
    <label htmlFor="username" className="block text-sm text-gray-700">
      Username
    </label>
    <input
      type="text"
      id="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
      placeholder="Choose a username"
      required
    />
  </div>

  {/* Email */}
  <div>
    <label htmlFor="email" className="block text-sm text-gray-700">
      Email address
    </label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
      placeholder="Enter your email"
      required
    />
  </div>

  {/* Password */}
  <div>
    <label htmlFor="password" className="block text-sm text-gray-700">
      Password
    </label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
      placeholder="Create a password"
      required
    />
  </div>

  {/* Role */}
  <div>
    <label htmlFor="role" className="block text-sm text-gray-700">
      Are you?
    </label>
    <select
      id="role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
    >
      <option value="Client">Client</option>
      <option value="Designer">Designer</option>
    </select>
  </div>

  {/* Button */}
  <div className='flex justify-end'>
  <button
    type={role === 'Client' ? 'submit' : 'button'}
    onClick={role === 'Client' ? handleSignUp : handleNext}
    className=" bg-blue text-white py-1 px-4 border border-blue rounded-full hover:bg-blue hover:border-blue transition"
    disabled={loading}
  >
    {loading ? 'Processing...' : role === 'Client' ? 'Sign Up' : 'Continue'}
  </button>
  </div>
</div>

              </form>
            </>
          )}

          {currentStep === 2 && role !== 'Client' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Additional Details</h2>

              <form className="space-y-4" onSubmit={handleSignUp}>
                <div>
                  <label htmlFor="job" className="block text-sm text-gray-700">
                    Job (optional)
                  </label>
                  <input
                    type="text"
                    id="job"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
                    placeholder="Enter your job (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="region" className="block text-sm text-gray-700">
                    Region (optional)
                  </label>
                  <input
                    type="text"
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full mt-1 p-2 border rounded focus:outline-blue-500"
                    placeholder="Enter your region (optional)"
                  />
                </div>

                <div>
          <label htmlFor="image" className="block text-gray font-medium mb-2">
            Upload Image
          </label>
          <div
            {...getRootProps()}
            className="w-full p-6 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <div className="w-full flex justify-center">
                <img src={imagePreview} alt="Preview" className="max-w-full max-h-60 object-cover" />
              </div>
            ) : (
              <p className="text-gray-500">Drag and drop or click to select one</p>
            )}
          </div>
        </div>
        <div className='flex justify-end'>
                <button
                  type="submit"
                  className="bg-blue w-auto text-white py-2 px-4 border border-blue rounded-full hover:bg-blue hover:border-blue transition"
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
                </div>
              </form>
            </>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-4">
              {error}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default SignUp;
