import {useState, useEffect, useContext} from 'react';
import {AiOutlineDelete} from "react-icons/ai";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL} from '../../config';
import { authContext } from '../../context/AuthContext';
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify";
import HashLoader from "react-spinners/HashLoader"

const Profile = ({doctor}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        gender: "",
        specialization: "",
        ticketPrice: 0,
        qualifications: [],
        experiences: [],
        timeSlots: [],
        about: "",
        photo: null
    });

    const {token} = useContext(authContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null)

    useEffect(() => {
        setFormData({
            name: doctor?.data?.data?.name,
            email: doctor?.data?.data?.email,
            phone: doctor?.data?.data?.phone,
            bio: doctor?.data?.data?.bio,
            photo: doctor?.data?.data?.photo,
            gender: doctor?.data?.data?.gender,
            specialization: doctor?.data?.data?.specialization,
            ticketPrice: doctor?.data?.data?.ticketPrice,
            qualifications: doctor?.data?.data?.qualifications,
            experiences: doctor?.data?.data?.experiences,
            timeSlots: doctor?.data?.data?.timeSlots,
            about: doctor?.data?.data?.about,
        })
    }, [doctor])

    const handleInputChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleFileInputChange = async (e) => {
        const file = e.target.files[0];

        const data = await uploadImageToCloudinary(file);
        
        setSelectedFile(data.url)
        setFormData({...formData, photo:data.url})
    } 

    const updateProfileHandler = async e => {
        e.preventDefault()
        setLoading(true);

        try{

            // const res = await fetch(`${BASE_URL}/doctors/${doctorData._id}`, {
            const res = await fetch(`${BASE_URL}/doctors/update-me`, {
                method: 'PATCH',
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const result = await res.json();

            if(res.ok){
                setLoading(false);
                toast.success("Profile updated successfully")
                navigate("/doctors/profile/me");
            }
            else {
                setLoading(false)
                toast.error(result.message);
            }
        }
        catch(err){
           
            setLoading(false);
            toast.error(err.message);
        }

    }

    // reusable function for adding item
    const addItem = (key, item) => {
        setFormData(prevFormData => ({...prevFormData, [key]:[...prevFormData[key], item]}))
    }

    // reusable input change function
    const handleReusableInputChangeFunc = (key, index, e) => {
        const {name, value} = e.target;

        setFormData(prevFormData=> {
            const updateItems = [...prevFormData[key]]

            updateItems[index][name] = value;

            return {
                ...prevFormData,
                [key]: updateItems
            }
        })
    }

    const addQualification = e => {
        e.preventDefault()

        addItem("qualifications", {
            startingDate: "", 
            endingDate: "", 
            degree: "", 
            university: ""
        })
    }

    // reusable function for deleting item
    const deleteItem = (key, index) => {
        setFormData(prevFormData => ({...prevFormData, 
                [key]:prevFormData[key].filter((_, i) => i !== index)
            })
    )}

    const handleQualificationChange = (e, index) => {
        handleReusableInputChangeFunc("qualifications", index, e)
    }

    const deleteQualification = (e, index) => {
        e.preventDefault();
        deleteItem("qualifications", index)
    }


    // for Experiences
    const addExperience = e => {
        e.preventDefault()

        addItem("experiences", {
            startingDate: "", 
            endingDate: "", 
            position: "Senior Surgeon", 
            hospital: "Dhaka Medical"
        })
    }

    const handleExperienceChange = (e, index) => {
        handleReusableInputChangeFunc("experiences", index, e)
    }

    const deleteExperience = (e, index) => {
        e.preventDefault();
        deleteItem("experiences", index)
    }

    // for Time slots
    const addTimeSlot = e => {
        e.preventDefault()

        addItem("timeSlots", {
            day: "Sunday", 
            startingTime: "10:00", 
            endingTime: "04:30"
        })
    }

    const handleTimeSlotChange = (e, index) => {
        handleReusableInputChangeFunc("timeSlots", index, e)
    }

    const deleteTimeSlot = (e, index) => {
        e.preventDefault();
        deleteItem("timeSlots", index)
    }


  return (
    <div className=''>
        <h2 className='text-headingColor font-bold text-[24px] leading-9 mb-8 text-center'>
            Profile Information
        </h2>

        <form action="">
            <div className="mb-5">
                <p className="form_label">Name*</p>
                <input 
                    type="text" 
                    name='name' 
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder='Full name'
                    className='form_input'
                />
            </div>
            <div className="mb-5">
                <p className="form_label">Email*</p>
                <input 
                    type="email" 
                    name='email' 
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder='Email'
                    className='form_input'
                    readOnly
                    aria-readonly
                    disabled={true}
                />
            </div>
            <div className="mb-5">
                <p className="form_label">Phone*</p>
                <input 
                    type="number" 
                    name='phone' 
                    value={formData.phone} 
                    onChange={handleInputChange}
                    placeholder='Phone number'
                    className='form_input'
                />
            </div>
            <div className="mb-5">
                <p className="form_label">Bio*</p>
                <input 
                    type="text" 
                    name='bio' 
                    value={formData.bio} 
                    onChange={handleInputChange}
                    placeholder='Bio'
                    className='form_input'
                    maxLength={100}
                />
            </div>

            <div className="mb-5">
                <div className="grid grid-cols-3 gap-5 mb-[30px]">
                    <div>
                        <p className='form_label'>Gender*</p>
                        <select 
                            name="gender" 
                            value={formData.gender}
                            onChange={handleInputChange}
                            className='form_input py-3.5'
                        >
                            <option value="">Select</option>
                            <option value="male">male</option>
                            <option value="female">Female</option>
                            <option value="other">other</option>
                        </select>
                    </div>

                    <div>
                        <p className='form_label'>Specialization*</p>
                        <select 
                            name="specialization" 
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className='form_input py-3.5'
                        >
                            <option value="">Select</option>
                            <option value="surgeon">Surgeon</option>
                            <option value="neurologist">neurologist</option>
                            <option value="dermatologist">Dermatologist</option>
                        </select>
                    </div>

                    <div className="mb-5">
                        <p className="form_label">Ticket Price*</p>
                        <input 
                            type="number" 
                            name='ticketPrice' 
                            value={formData.ticketPrice} 
                            onChange={handleInputChange}
                            placeholder='100'
                            className='form_input'
                        />
                    </div>
                </div>
            </div>

            <div className="mb-5">
                <p className='form_label'>Qualifications*</p>
                {
                    formData?.qualifications?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className='form_label'>Starting Date*</p>
                                        <input 
                                            type="date"
                                            name='startingDate'
                                            value={item.startingDate}
                                            className='form_input' 
                                            onChange={e => handleQualificationChange(e, index)}
                                        />
                                    </div>
                                    <div>
                                        <p className='form_label'>Ending Date*</p>
                                        <input 
                                            type="date"
                                            name='endingDate'
                                            value={item.endingDate}
                                            className='form_input' 
                                            onChange={e => handleQualificationChange(e, index)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className='form_label'>Degree*</p>
                                        <input 
                                            type="text"
                                            name='degree'
                                            value={item.degree}
                                            className='form_input' 
                                            onChange={e => handleQualificationChange(e, index)}
                                        />
                                    </div>
                                    <div>
                                        <p className='form_label'>University*</p>
                                        <input 
                                            type="text"
                                            name='university'
                                            value={item.university}
                                            className='form_input' 
                                            onChange={e => handleQualificationChange(e, index)}
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={e => deleteQualification(e, index)}
                                    className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'
                                >
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        </div>
                    ))
                }

                <button 
                    onClick={addQualification}
                    className="bg-[#000] py-2 px-5 rounded text-white 
                    h-fit cursor-pointer"
                >
                    Add Qualification
                </button>
            </div>

            <div className="mb-5">
                <p className='form_label'>Experiences*</p>
                {
                    formData.experiences?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className='form_label'>Starting Date*</p>
                                        <input 
                                            type="date"
                                            name='startingDate'
                                            value={item.startingDate}
                                            className='form_input' 
                                            onChange={e => handleExperienceChange(e, index)}
                                        />
                                    </div>
                                    <div>
                                        <p className='form_label'>Ending Date*</p>
                                        <input 
                                            type="date"
                                            name='endingDate'
                                            value={item.endingDate}
                                            className='form_input' 
                                            onChange={e => handleExperienceChange(e, index)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className='form_label'>Position*</p>
                                        <input 
                                            type="text"
                                            name='position'
                                            value={item.position}
                                            className='form_input' 
                                            onChange={e => handleExperienceChange(e, index)}
                                        />
                                    </div>
                                    <div>
                                        <p className='form_label'>Hospital*</p>
                                        <input 
                                            type="text"
                                            name='hospital'
                                            value={item.hospital}
                                            className='form_input' 
                                            onChange={e => handleExperienceChange(e, index)}
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={e =>deleteExperience(e, index)}
                                    className='bg-red-600 p-2 rounded-full
                                     text-white text-[18px] mt-2 mb-[30px] 
                                     cursor-pointer'
                                >
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        </div>
                    ))
                }

                <button 
                    onClick={addExperience}
                    className="bg-[#000] py-2 px-5 rounded text-white 
                    h-fit cursor-pointer"
                >
                    Add Experience
                </button>
            </div>

            <div className="mb-5">
                <p className='form_label'>Time Slots*</p>
                {
                    formData.timeSlots?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5">
                                    <div>
                                        <p className='form_label'>Day*</p>
                                        <select 
                                            name="day" 
                                            value={item.day}
                                            className='form_input py-3.5'
                                            onChange={e => handleTimeSlotChange(e, index)}
                                        >
                                            <option value="">Select</option>
                                            <option value="saturday">Saturday</option>
                                            <option value="sunday">Sunday</option>
                                            <option value="monday">Monday</option>
                                            <option value="tuesday">Tuesday</option>
                                            <option value="wednesday">Wednesday</option>
                                            <option value="thursday">Thursday</option>
                                            <option value="friday">Friday</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className='form_label'>Starting Time*</p>
                                        <input 
                                            type="time"
                                            name='startingTime'
                                            value={item.startingTime}
                                            className='form_input' 
                                            onChange={e => handleTimeSlotChange(e, index)}
                                        />
                                    </div>
                                    <div>
                                        <p className='form_label'>Ending Time*</p>
                                        <input 
                                            type="time"
                                            name='endingTime'
                                            value={item.endingTime}
                                            className='form_input' 
                                            onChange={e => handleTimeSlotChange(e, index)}
                                        />
                                    </div>
                                    <div className='flex items-center'>
                                        <button 
                                            onClick={e => deleteTimeSlot(e, index)}
                                            className='bg-red-600 p-2 rounded-full
                                            text-white text-[18px] cursor-pointer mt-6'
                                        >
                                            <AiOutlineDelete />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                }

                <button 
                    onClick={addTimeSlot}
                    className="bg-[#000] py-2 px-5 rounded text-white h-fit 
                    cursor-pointer"
                >
                    Add TimeSlot
                </button>
            </div>

            <div className="mb-5">
                <p className='form_label'>About*</p>
                <textarea 
                    name="about"  
                    value={formData.about}
                    placeholder='write about you'
                    onChange={handleInputChange}
                    className='form_input'
                    rows={5}></textarea>
            </div>

            <div className="mb-5 flex item-center gap-3">
            { formData.photo && (<figure 
                    className="w-[60px] h-[60px] rounded-full border-2 border-solid
                    border-primaryColor flex items-center justify-center"
                >
                    <img 
                        src={formData.photo} 
                        className="w-[60px] h-[60px] rounded-full"
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
                    type='submit'
                    onClick={updateProfileHandler}
                    className='bg-primaryColor text-white text-[18px] 
                    leading-[30px] w-full py-3 px-4 rounded-lg'
                >
                   { loading ? <HashLoader size={25} color="#ffffff" /> :  "Update Profile"}
                </button>
            </div>
        </form>
    </div>
  )
}

export default Profile