import { useContext, useState } from "react";
import { formatDate } from "../../utils/formatDate"
import {AiFillStar} from "react-icons/ai";
import FeedbackForm from "./FeedbackForm";
import { authContext } from "../../context/AuthContext";

const Feedback = ({reviews, totalRating, refreshProfile}) => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    // const [profileKey, setProfileKey] = useState(Date.now()); 

    const {user} = useContext(authContext);

    // const refreshProfile = () => {
    //     setProfileKey(prevKey => prevKey + 1); // Update the key to force a refresh
    // }; 

    const handleDuplicate = () => {
        return reviews.map((rev) => rev.user._id === user._id);
        
    }

    const handleReviewSelf = () => {
        return reviews.map(rev => rev.doctor === user._id);
    }


  return (
    <div>
        <div className='mb-[50px]'>
            <h4 className='text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]'>
                All reviews ({totalRating})
            </h4>

            {reviews?.map((review, index) => (
                <div key={index} className="flex justify-between gap-10 mb-[30px]">
                    <div className="flex gap-3">
                        <figure className="w-10 h-10 rounded-full">
                            <img className="w-10 h-10 rounded-full" src={review?.user?.photo} alt="" />
                        </figure>

                        <div>
                            <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                                {review?.user?.name}
                            </h5>
                            <p className="text-[14px] leading-6 text-textColor">
                                {formatDate(review?.createdAt)}
                            </p>
                            <p className="text_para mt-3 font-medium text-[15px]">
                            {review.reviewText}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-1">
                        {[...Array(review?.rating).keys()].map((_, index) => (
                            <AiFillStar key={index} color="#0067FF" />
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {!showFeedbackForm && !handleReviewSelf()[0] && (
            <div className="text-center">
                <div 
                    className={`${handleDuplicate()[0] ? 'disabled !cursor-not-allowed bg-gray-300 text-[#f18fdc]' : ''} btn cursor-pointer `} 
                    // className={`btn cursor-pointer`} 
                    onClick={() => setShowFeedbackForm(true)}
                >
                    Give Feedback
                </div>
            </div>
        )}

        {showFeedbackForm && <FeedbackForm refreshProfile={refreshProfile} />}
    </div>
  )
}

export default Feedback