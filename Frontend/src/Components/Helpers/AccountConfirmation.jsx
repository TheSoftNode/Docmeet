
const ConfirmationDialog = ({ 
    message, 
    onConfirm, 
    onCancel, 
    title, 
    style = "bg-white p-10 rounded-lg shadow-lg fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
}) => {
    return (
        <div className={style}>
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-5">{title}</h2>
                <p className="text-sm mb-5">{message}</p>
                <div className="flex justify-end">
                    <button className="mr-5 px-5 py-2  bg-red-600 text-white rounded-lg" onClick={onCancel}>Cancel</button>
                    <button className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;