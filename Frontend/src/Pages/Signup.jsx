import React, { useContext, useState } from "react";
import {useNavigate} from "react-router-dom";
import signupImg from "../assets/images/signup.gif";
import { Link } from "react-router-dom";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { BASE_URL } from "../config";
import {toast} from "react-toastify";
import HashLoader from "react-spinners/HashLoader"
import * as Yup from 'yup';
import { authContext } from "../context/AuthContext";

const Signup = () => {

    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState("")
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState(null);

    const navigate = useNavigate()
    const {dispatch} = useContext(authContext);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        photo: "",
        gender: "",
        role: "patient"
    })


    const schema = Yup.object().shape({
        name: Yup.string().required("Please enter your name"),
        email: Yup.string()
          .email("Invalid email!")
          .required("Please enter your email!"),
        password: Yup.string().required("Please enter your password!").min(6),
        confirmPassword: Yup.string()
          .required("Please confirm Your password")
          .oneOf([Yup.ref("password")], "Passwords must match"),
        gender: Yup.string().required("Select your gender")
      });

    const handleInputChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleFileInputChange = async (e) => {
        const file = e.target.files[0];

        const data = await uploadImageToCloudinary(file);
        
        setPreviewUrl(data.url);
        setSelectedFile(data.url)
        setFormData({...formData, photo:data.url})
    } 

    const submitHandler = async e => {

        e.preventDefault()
        setLoading(true);


        try{
            await schema.validate(formData, { abortEarly: false });

            const res = await fetch(`${BASE_URL}/auth/signUp`, {
                method: 'post',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(formData)
            })

            const result = await res.json();

            if(res.ok){
                dispatch({
                    type: "ACTIVATE_USER",
                    payload: {
                        activationToken: result.activationToken,
                        activationCode: result.activationCode,
                    }
                })

                setLoading(false);
                toast.success(result.message)
                navigate("/verify");
            }
            else {
                toast.error(result.message);
                setLoading(false);
                console.log(result);
            }
        }
        catch(err){
            if (err instanceof Yup.ValidationError) {
                const errors = {};
                err.inner.forEach(e => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors);
            }
            else {
                toast.error(err.message);
            }
            setLoading(false)
        }

    }


  return (
    <section className="px-5 xl:px-0 py-0">

        <div className="max-w-[1170px] mx-auto">
            <div className="grid grid-cols-1 md:place-items-center lg:grid-cols-2">
                {/* ====== img box ======= */}
                <div className="hidden lg:block bg-primaryColor rounded-l-lg">
                    <figure className="rounded-l-lg">
                        <img 
                        src={signupImg} 
                        alt="" 
                        className="w-full rounded-l-lg"
                        />
                    </figure>
                </div>

                {/* ======== sign up form ======= */}
                <div className="rounded-l-lg lg:pl-16 py-8 shadow-md lg:shadow-none lg:px-5 md:w-[80%] px-7 lg:w-full">
                    <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-8">
                        Create an
                        <span className="text-primaryColor px-2">
                            account
                        </span>
                    </h3>

                    <form onSubmit={submitHandler}>
                        <div className="mb-5">
                            <input 
                                type="text" 
                                placeholder="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className=" w-full pr-4 py-3 border-b border-solid border-[#0066ff61] 
                                focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                                text-headingColor placeholder:text-textColor  cursor-pointer"
                            />
                        </div>
                        {formErrors && formErrors.name && (
                            <span className="text-red-500 pt-2 block">{formErrors.name}</span>
                        )}

                        <div className="mb-5">
                            <input 
                                type="email" 
                                placeholder="Enter Your Email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className=" w-full pr-4 py-3 border-b border-solid border-[#0066ff61] 
                                focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                                text-headingColor placeholder:text-textColor  cursor-pointer"
                            />
                        </div>
                        {formErrors && formErrors.email && (
                            <span className="text-red-500 pt-2 block">{formErrors.email}</span>
                        )}

                        <div className="mb-5">
                            <input 
                                type="password" 
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className=" w-full pr-4 py-3 border-b border-solid border-[#0066ff61] 
                                focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                                text-headingColor placeholder:text-textColor  cursor-pointer"
                            />
                        </div>
                        {formErrors && formErrors.password  && (
                            <span className="text-red-500 pt-2 block">{formErrors.password}</span>
                        )}

                        <div className="mb-5">
                            <input 
                                type="password" 
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className=" w-full pr-4 py-3 border-b border-solid border-[#0066ff61] 
                                focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                                text-headingColor placeholder:text-textColor  cursor-pointer"
                            />
                        </div>
                        {formErrors && formErrors.confirmPassword && (
                            <span className="text-red-500 pt-2 block">{formErrors.confirmPassword}</span>
                        )}

                        <div className="mb-5 flex items-center justify-between">
                            <label 
                                htmlFor="role"
                                className="text-headingColor font-bold text-[16px] leading-7"
                            >
                                Are you a:
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="text-textColor font-semibold text-[15px] leading-7 px-4
                                        py-3 focus:outline-none"
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>

                                </select>
                            </label>

                            <label 
                                htmlFor="gender"
                                className="text-headingColor font-bold text-[16px] leading-7"
                            >
                                Gender:
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="text-textColor font-semibold text-[15px] leading-7 px-4
                                        py-3 focus:outline-none"
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>

                                </select>
                                {formErrors && formErrors.gender && (
                                    <span className="text-red-500 pt-2 block">{formErrors.gender}</span>
                                )}
                            </label>

                        </div>

                        <div className="mb-5 flex items-center gap-3">
                            { selectedFile && (<figure 
                                className="w-[70px] h-[70px] rounded-full border-2 border-solid
                                border-primaryColor flex items-center justify-center"
                            >
                                <img 
                                    src={previewUrl} 
                                    className="w-[70px] h-[70px] rounded-full"
                                    alt="" 
                                />
                            </figure>)}

                            <div className="relative w-[130px] h-[50px]">
                                <input 
                                    type="file"
                                    name="photo"
                                    id="customFile"
                                    onChange={handleFileInputChange}
                                    accept=".jpg, .png" 
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                />

                                <label 
                                    htmlFor="customFile"
                                    className="absolute top-0 left-0 w-full h-full flex items-center 
                                        px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden
                                        bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate
                                        cursor-pointer"
                                >
                                    Upload Photo
                                </label>
                            </div>
                        </div>

                        <div className="mt-7">
                            <button
                                disabled={loading && true}
                                type="submit"
                                className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                            >
                                { loading ? <HashLoader size={35} color="#ffffff" /> :  "Sign Up"}
                            </button>
                        </div>

                        <p className="mt-5 text-textColor text-center">
                            Already have an account?
                            <Link 
                                to="/login"
                                className="text-primaryColor font-medium ml-1"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        
    </section>
  )
};

export default Signup;