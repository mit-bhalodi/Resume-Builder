import React, { useEffect, useState } from 'react'
import useUser from '../hooks/useUser'
import { AnimatePresence } from 'framer-motion';
import { MainSpinner, TemplateDesignPin } from '../components';
import useTemplates from '../hooks/useTemplates';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getSavedResumes } from '../api';

const UserProfile = () => {
    const { data: user, isLoading: userLoading } = useUser();
    const { data: templates, isLoading: temp_loading } = useTemplates();

    const { data: resumes } = useQuery(
        ["savedResumes"],
        () => {
            if (user?.uid) {
                return getSavedResumes(user.uid);
            } else {
                return null;
            }
        }
    )
    const [activeTab, setActiveTab] = useState("collections")

    const navigate = useNavigate()


    useEffect(() => {
        if (!user && !userLoading) {
            navigate('/auth', { replace: true })
            return;
        }
    }, [user, userLoading, navigate])

    if (temp_loading || userLoading) {
        return (
            <MainSpinner />
        )
    }

    return (
        <div className='w-full flex flex-col items-center justify-start py-12'>
            <div className='w-full h-72'>
                <img src="https://images.unsplash.com/photo-1520583457224-aee11bad5112?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="placeholder" className='w-full h-full object-cover' />
                <div className='flex items-center justify-center flex-col gap-4'>
                    {
                        user?.photoURL ?
                            <React.Fragment>
                                <div className="w-20 h-20 rounded-md relative -my-10 flex flex-col items-center justify-center"><img src={user.photoURL} alt="user" className="w-full h-full object-cover rounded-full" /></div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div className="w-20 h-20 rounded-full relative -my-10 flex flex-col items-center justify-center bg-blue-500 shadow-md cursor-pointer text-3xl text-white capitalize">{user?.email[0]}</div>
                            </React.Fragment>
                    }
                    <div className='text-2xl mt-12'>{user?.displayName}</div>
                </div>

                {/* Tabs */}
                <div className='flex items-center justify-center mt-6'>
                    <div className={`px-2 py-2 rounded-md flex items-center justify-center group cursor-pointer`} onClick={() => setActiveTab('collections')}>
                        <div className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === 'collections' && 'bg-white sadow-md text-blue-600'}`}>Collections</div>
                    </div>
                    <div className={`px-2 py-2 rounded-md flex items-center justify-center group cursor-pointer`} onClick={() => setActiveTab('resumes')}>
                        <div className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === 'resumes' && 'bg-white sadow-md text-blue-600'}`}>My Resumes</div>
                    </div>
                </div>

                {/* Collections */}
                <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-6'>
                    {
                        activeTab === 'collections' && (<React.Fragment>
                            {
                                user?.collection && user?.collection?.length > 0 ?
                                    <RenderTemplate templates={templates?.filter((template) => user?.collection?.includes(template?._id))} /> :
                                    <React.Fragment>
                                        <p>No data found</p>
                                    </React.Fragment>
                            }
                        </React.Fragment>)
                    }
                    {
                        activeTab === 'resumes' && (<React.Fragment>
                            {
                                resumes && resumes?.length > 0 ?
                                    <RenderTemplate templates={resumes} /> :
                                    <React.Fragment>
                                        <p>No data found</p>
                                    </React.Fragment>
                            }
                        </React.Fragment>)
                    }
                </div>
            </div>

        </div>
    )
}

const RenderTemplate = ({ templates }) => {
    return (<React.Fragment>
        {
            templates && templates.length > 0 &&
            <React.Fragment>
                <AnimatePresence>
                    {templates.map((template, index) => (
                        <TemplateDesignPin key={index} template={template} />
                    ))}
                </AnimatePresence>
            </React.Fragment>
        }
    </React.Fragment>)
}

export default UserProfile