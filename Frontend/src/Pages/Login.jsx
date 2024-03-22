import React, { useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import * as Yup from 'yup';
import RotateLoader from "react-spinners/RotateLoader";
import { BASE_URL } from "../config";
import {toast} from "react-toastify";
import { authContext } from "../context/AuthContext.jsx";

const Login = () => {

    const [formErrors, setFormErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate();
    const {dispatch} = useContext(authContext);

    const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email!")
          .required("Please enter your email!"),
        password: Yup.string().required("Please enter your password!").min(6)
      });

    const handleInputChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const submitHandler = async e => {

        e.preventDefault()
        setLoading(true);

        try{
            await schema.validate(formData, { abortEarly: false });

            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'post',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(formData)
            })

            const result = await res.json();

            if(res.ok){
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: {
                        user: result.user,
                        token: result.accessToken,
                    }
                })
                setLoading(false);

                toast.success("Log in successful")
                navigate("/");  
            }
             else{
                // throw new Error(result.Error)
                toast.error(result.message, {className: "toast-message"});
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
                // toast.error(err.data.message);
                console.log(err);
            }
            setLoading(false)
        }

    }

  return (
    <section className="px-5 lg:px-0">

        <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 p-5">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-8">
                Hello! 
                <span className="text-primaryColor px-3">Welcome</span>
                Back
            </h3>

            <form className="py-4 md:py-0" onSubmit={submitHandler}>
                <div className="mb-5">
                    <input 
                    type="email" 
                    placeholder="Enter Your Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className=" w-full  py-3 border-b border-solid border-[#0066ff61] 
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
                    className=" w-full  py-3 border-b border-solid border-[#0066ff61] 
                    focus:outline-none focus:border-b-primaryColor text-[16px] leading-7
                    text-headingColor placeholder:text-textColor cursor-pointer"
                    />
                </div>
                {formErrors && formErrors.password && (
                    <span className="text-red-500 pt-2 block">{formErrors.password}</span>
                )}

                <div className="mt-7">
                    <button
                    type="submit"
                    className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                    >
                        { loading ? <RotateLoader size={35} color="#ffffff" /> :  "Login"}
                    </button>
                </div>

                <p className="mt-5 text-textColor text-center">
                    Don&apos;t have an account?
                    <Link 
                    to="/register"
                    className="text-primaryColor font-medium ml-1"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </div>

    </section>
  )
};

export default Login;