import { styles } from "../styles/style.js";
import React, {useRef, useContext, useState } from "react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import {toast} from "react-toastify";
import RotateLoader from "react-spinners/RotateLoader";
import {Link, useNavigate} from "react-router-dom";
import { authContext } from "../context/AuthContext";
import { BASE_URL } from "../config";

const Verification = () => {
  const [InvalidError, setInvalidError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyNumber, setVerifyNumber] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const navigate = useNavigate();
  const {activationToken, activationCode} = useContext(authContext);
  

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }

    try{
        setLoading(true)

        const res = await fetch(`${BASE_URL}/auth/activateUser`, {
            method: 'post',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                activation_token: activationToken,
                activation_code: activationCode
              })
        })

        const result = await res.json();

        if(res.ok){
            setLoading(false);

            toast.success("Verification Successful")
            navigate("/login");  
        }
         else{
            // throw new Error(result.Error)
            toast.error(result.message);
            setLoading(false);
            console.log(result);
        }  
        
    }
    catch(err){
       console.log(err);
        setLoading(false)
    }

};

  const handleInputChange = (index, value) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 pb-6">
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black
             dark:text-white justify-center text-[18px] font-Poppins outline-none text-center ${
               InvalidError
                 ? "shake border-red-500"
                 : "dark:border-white border-[#0000004a]"
             }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <button 
            disabled={loading && true}
            className={`${styles.button}`} 
            onClick={verificationHandler}
        >
            { loading ? <RotateLoader size={35} color="#ffffff" /> :  "Verify OTp"}
        </button>
      </div>
      <br />
      <p className="mt-5 text-textColor text-center">
        Go back to sign up?
        <Link
          to={"/register"}
          className="text-primaryColor font-medium ml-1"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Verification;
