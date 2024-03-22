import React, {useContext} from 'react';
import {Navigate} from "react-router-dom";
import { authContext } from '../context/AuthContext';

const ProtectedRoute = ({children, allowedRoles}) => {

    const {user, token} = useContext(authContext);
    let isAllowed = false;

    if (user){
        isAllowed = allowedRoles.some((role) => user.role.includes(role));
    }


    const accessibleRoute = token && isAllowed 
    ? children 
    : (<Navigate to="/login" replace={true} />)

    return accessibleRoute
}

export default ProtectedRoute