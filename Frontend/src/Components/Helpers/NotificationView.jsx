import React from 'react'

const NotificationView = ({title, value}) => {
    return (
        <div 
            style={{borderRadius: "90px 10px 90px 10px"}}
            className='absolute flex items-center justify-center bottom-[60px] left-[48px] w-[200px] p-5 bg-white border border-green-400' 
        >
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-[16px] text-green-600 font-bold mb-5 ml-2">{title}</h2>
                <p className="text-[14px] font-semibold text-pretty  mb-2 text-center">{value}</p>
            </div>
        </div>
    );
}

export default NotificationView