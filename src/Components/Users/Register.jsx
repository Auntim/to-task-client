import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import logoutlotti from '../../assets/lotti/logout.json'
import Lottie from "lottie-react";
const img_hosting_key = import.meta.env.VITE_image_api_key;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const Register = () => {
  const { createNewUser, setUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log(data);

    // Image upload to imgbb and get the URL
    const imageFile = { image: data.image[0] };
    const res = await axios.post(img_hosting_api, imageFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      const photo = res.data.data.display_url;
      const { name, email, password } = data;

      // Password validation
      const regex = /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
      if (!regex.test(password)) {
        toast.error(
          "Password should have at least one uppercase and one lowercase letter and must be 6 characters long"
        );
        return;
      }

      // Create user
      createNewUser(email, password)
        .then((result) => {
          const user = result.user;

          setUser(user);

          updateUserProfile({
            displayName: name,
            photoURL: photo,
          })
            .then(() => {
              setUser({
                ...user,
                displayName: name,
                photoURL: photo,
              });

              // Save user info to the database
              const userInfo = {
                name,
                email,
                photo,
                role: "User",
              };

              axios
                .post("https://task-tracker-servers.vercel.app/users", userInfo)
                .then((res) => {
                  if (res.data.insertedId) {
                    toast.success("Registration Successful!");
                  }
                });

              navigate(location?.state?.from || "/");
            })
            .catch((err) => console.error(err));
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      toast.error("Failed to upload image.");
    }
  };

  return (
    <div className="w-4/5 mx-auto mt-10 flex justify-center">
      <div className="hidden md:flex w-2/5 rounded-lg">
        <Lottie animationData={logoutlotti} />
      </div>

      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-black card-body border-2 my-10 bg-gradient-to-r from-fuchsia-500 via-fuchsia-400 to-fuchsia-300 rounded-lg max-w-sm"
        >
          <h1 className=" text-center text-white font-bold text-xl md:text-2xl  mb-4">
            Register your account
          </h1>
          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text rounded-none">Name</span>
            </label>
            <input
              type="text"
              placeholder="name"
              className="input input-bordered rounded-lg"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text rounded-none ">Select Image</span>
            </label>
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input "
            />
          </div>


          {/* Email Field */}
          <div className="form-control">
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

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered rounded-lg"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button className="btn bg-black rounded-lg text-white">
              Register
            </button>
          </div>


          <div>
            <h1>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </h1>
          </div>
        </form>
      </div>


    </div>
  );
};

export default Register;
