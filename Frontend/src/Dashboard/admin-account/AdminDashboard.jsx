import React, { useEffect, useState } from 'react';
import Tabs from './Tabs';
import Users from './Users';
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Doctors from './Doctors';
import Notifications from './Notifications';



const AdminDashboard = () => {

    const [tab, setTab] = useState("users")

    // const {data:users, loading:usersLoading, error:usersError} = useFetchData(`${BASE_URL}/users`);
    // const {data:doctors, loading:doctorsLoading, error:doctorsError} = useFetchData(`${BASE_URL}/doctors/all-doctors/admin`);
    // const {data:notifications, loading, error} = useFetchData(`${BASE_URL}/notifications`);

  return (
    <section className='p-0 lg:pt-6'>
        <div className='max-w-[1300px] px-2 lg:ml-[5em]'>
            <div className='grid lg:grid-cols-4 gap-[50px]'>
                <Tabs tab={tab} setTab={setTab}  />
                <div className='lg:col-span-3'>
                    <div className='lg:mt-8 '>
                        {tab === "users" && <Users />}
                        {tab === "doctors" && <Doctors />}
                        {tab === "awaitingApproval" && <Notifications  />}
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AdminDashboard