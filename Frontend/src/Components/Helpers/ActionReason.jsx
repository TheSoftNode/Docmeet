import { useState } from "react";

const ActionReason = ({
    reasonText,
    onSendReason, 
    onConfirm, 
    onCancel, 
    title, 
    style = "bg-white p-10 rounded-lg shadow-lg fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
}) => {

    const [reason, setReason] = useState("");

    // const handleClick = (e) => {
    //     e.preventDefault();
    //     // Invoke the callback function defined in the parent component
    //     onSendReason(reason);

    //     onConfirm();
    // };

    return (
        <div className={style}>
            <div className="flex flex-col items-center justify-center">
                {/* <form onSubmit={(e) => handleClick(e)}> */}
                    <h2 className="text-lg font-semibold mb-5">{title}</h2>
                    <textarea 
                        className='border border-solid border-[#0066ff34] focus:outline outline-primaryColor w-full px-4 py-3 mb-5 rounded-md'
                        rows="5"
                        placeholder="What's your reason?"
                        value={reason}
                        onChange={(e) => {setReason(e.target.value); onSendReason(e.target.value);}}
                        required
                    ></textarea>
                    <div className="flex justify-end">
                        <button type="button" className="mr-5 px-5 py-2  bg-red-600 text-white rounded-lg" onClick={onCancel}>Cancel</button>
                        <button type="submit"  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg" onClick={onConfirm} >Confirm</button>
                    </div>
                {/* </form> */}

            </div>
        </div>
    );
};

export default ActionReason;