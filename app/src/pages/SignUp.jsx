import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import signupSchema from "../schema/signup";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const {setUser} = useContext(UserContext)

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      avtar: null,
    },
    resolver: yupResolver(signupSchema),
  });

  // const handleAvatarChange = async (e) => {
  //   const file = e.target.files[0];

  //   if (!file) return;

  //   if (!validTypes.includes(file.type)) {
  //   toast.error("Unsupported file type");
  //   return;
  // }

  // if (file.size > maxSize) {
  //   toast.error("File too large. Max size is 5MB");
  //   return;
  // }

  //  const reader = new FileReader();
  //  reader.onload = () => {
  //    setAvtarPreview(reader.result);
  //   };
  //   reader.readAsDataURL(file);

  //   try {
  //     setIsUploading(true)
  //     const data = new FormData()
  //     data.append('file', file)
  //     data.append("upload_preset", "upload")

  //     const res = await axios.post('https://api.cloudinary.com/v1_1/dzd7eycft/image/upload',
  //     data
  //     );

  //     if (res.data.secure_url){
  //       setCloudinaryUrl(res.data.secure_url);
  //       setValue('file', res.data.secure_url)
  //     }else{
  //       throw new Error('No URL returned from Cloudinary');
  //     }

  //   } catch (error) {
    //     toast.error('Failed to upload avatar');
    //     console.error(error);
    //   }finally{
      //     setIsUploading(false)
      //   }
      // };

      const onsubmit = async (data) => {
        setLoading(true);
        
        try {
          const file = data.avtar[0]
          
          if(!file){
            toast.error('Avtar is required!')
          }
          
          const formData = new FormData();
          formData.append("username", data.username);
          formData.append("email", data.email);
          formData.append("password", data.password);
          formData.append("confirmPassword", data.confirmPassword);
          formData.append("avtar", file);

      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/register",
        formData,
        { withCredentials: true }
      );
      
      const userData = response.data.data;
      setUser(userData);
      toast.success("Signup Successfull");
      setTimeout(() => navigate("/"), 1500);
      
    } catch (error) {
      const errorMessage = error?.response?.data.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-md m-auto" onSubmit={handleSubmit(onsubmit)}>
      <fieldset className="fieldset rounded-lg shadow-md w-sm border bg-white dark:bg-black rounded-box py-5 p-4 m-auto">
        <legend className="fieldset-legend text-black dark:text-white text-2xl font-semibold">
          Signup
        </legend>

        <label className="block text-gray-700 dark:text-white mb-2 text-sm">Username</label>
        <input
          {...register("username")}
          type="username"
          className="input bg-white dark:bg-black outline-1"
          placeholder="username"
        />
        {errors.username && (
          <p className="text-red-500 text-xs">{errors.username.message}</p>
        )}

        <label className="label dark:text-white text-sm">Email</label>
        <input
          {...register("email")}
          type="email"
          className="input bg-white dark:bg-black outline-1"
          placeholder="email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <label className="label dark:text-white text-sm">Password</label>
        <input
          {...register("password")}
          type="password"
          className="input bg-white dark:bg-black outline-1"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}

        <label className="label dark:text-white text-sm">Confirm password</label>
        <input
          {...register("confirmPassword")}
          type="password"
          className="input bg-white dark:bg-black outline-1"
          placeholder="Confirm password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </p>
        )}

        <input
          type="file"
          id="avtar"
          accept="image/*"
          {...register('avtar')}
          className="file-input file-input-ghost"
        />
        {errors.avtar && (
          <p className="text-red-500 text-xs">{errors.avtar.message}</p>
        )}

        <button
          disabled={loading}
          type="submit"
          className="btn mt-4 mr-7 bg-blue-500 border-none text-white hover:opacity-95"
        >
        {
          loading ? (
          <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : ("Signup")
        }
        </button>

        <div>
        <p>Already a member ? <Link to={'/signin'}><span className="text-blue-700 font-bold">Login</span></Link> </p>
        </div>
      </fieldset>
    </form>
  );
};

export default SignUp;
