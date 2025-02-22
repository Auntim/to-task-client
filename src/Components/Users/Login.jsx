import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import loginlotti from '../../assets/lotti/login.json'
import Lottie from "lottie-react";

const Login = () => {
  const { setUser, userSignIn } = useContext(AuthContext);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const userInfo = {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          role: "User",
        };

        // Store the user in the database
        axios
          .post("https://task-tracker-servers.vercel.app/users", userInfo)
          .then((res) => {
            if (res.data.insertedId) {

            }
          })
          .catch((error) => {
            console.error("Error saving user to database:", error);
          });

        setUser(user);
        toast.success("Login Successful!");
        navigate(location?.state ? location.state : "/");
      })
      .catch((err) => {
        console.error("Google Sign-In Error:", err);
        setUser(null);
        toast.error("Google Sign-In failed. Please try again.");
      });
  };

  const onSubmit = (data) => {
    const { email, password } = data;

    userSignIn(email, password)
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success("Login Successful!");
        navigate(location?.state ? location.state : "/");
      })
      .catch(() => {
        toast.error("Login failed. Please check your email and password.");
      });
  };

  return (
    <div className=" mx-auto w-4/5 mt-10 flex justify-center">
      <div className="hidden md:flex w-2/5 rounded-lg">
        <Lottie animationData={loginlotti} />
      </div>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-black card-body border-2 my-10 bg-gradient-to-r from-fuchsia-500 via-fuchsia-400 to-fuchsia-300 rounded-lg "
        >
          <div className="form-control">
            <h1 className="text-center text-white font-bold text-xl md:text-2xl  mb-12">
              Please Login to continue!
            </h1>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered rounded-lg"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered rounded-lg"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
            <label className="label">
              <p className="label-text-alt link link-hover">Forgot password?</p>
            </label>
          </div>
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn rounded-lg bg-black text-white"
            >
              Login
            </button>
          </div>
          <div>
            <h1 className="text-center  mt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600">
                Register
              </Link>
            </h1>
          </div>
          <div className="flex w-full flex-col">
            <div className="divider">Or</div>
          </div>
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full btn rounded-lg btn-outline"
            >
              Login With Google <FaGoogle />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Login;
