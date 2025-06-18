import signInSchema from "../schema/signin";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {setUser} = useContext(UserContext);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signInSchema),
  });

  const onsubmit = async (data) => {
    setLoading(true);

    try {

      const payload = {
        email: data.email,
        password: data.password
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        payload,
        { withCredentials: true }
      );
    const userData = response.data.data;
      setUser(userData);

      toast.success("Signin Successfull");
      navigate("/")

    } catch (error) {
      const errorMessage = error?.response?.data.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <fieldset className="fieldset m-auto bg-white dark:bg-black rounded-box w-sm border py-5 p-4">
        <legend className="fieldset-legend text-black dark:text-white text-2xl font-semibold">
          Signin
        </legend>
        <label className="label dark:text-white text-sm">Email</label>
        <input
          {...register("email")}
          type="email"
          className="input bg-white dark:bg-black outline-1"
          placeholder="Email"
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
        <button
          disabled={loading}
          type="submit"
          className="btn mt-4 mr-7 bg-blue-500 border-none text-white  hover:opacity-95"
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
          ) : ("Login")
        }
        </button>
        <div>
          <p className="text-sm">
            new member ?{" "}
             <button
      type="button"
      className="text-blue-600 font-semibold cursor-pointer"
      onClick={() => navigate("/signup")}
    >
      Signup
    </button>
          </p>
        </div>
      </fieldset>
    </form>
  );
};

export default SignIn;
