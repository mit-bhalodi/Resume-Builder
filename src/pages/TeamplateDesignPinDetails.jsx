
import React from 'react'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { getTemplateDetail, saveToCollections, saveToFavourites } from '../api'
import { FaHouse } from 'react-icons/fa6'
import { BiFolderPlus, BiHeart, BiSolidFolder, BiSolidHeart } from 'react-icons/bi'
import useUser from '../hooks/useUser'
import useTemplates from '../hooks/useTemplates'
import { AnimatePresence } from 'framer-motion'
import { TemplateDesignPin } from '../components'

const TeamplateDesignPinDetails = () => {
    const { templateId } = useParams()

    const { data, isError, refetch: templateRefetch } = useQuery(
        ["template", templateId],
        () => getTemplateDetail(templateId)
    )

    const { data: userData, refetch: userRefetch } = useUser()
    const { data: templates, refetch: temp_refetch } = useTemplates()

    const addToCollection = async (e) => {
        e.stopPropagation()
        await saveToCollections(userData, data)
        userRefetch();
    }

    const addToFavs = async (e) => {
        e.stopPropagation()
        await saveToFavourites(userData, data)
        temp_refetch();
        templateRefetch()
    }

    if (isError) {
        return (<div className='w-full h-[60vh] flex flex-col items-center justify-center'>Error while fetching data... Please try again later</div>)
    }

    return (
        <div className='w-full flex flex-col px-4 py-12 items-center justify-start'>
            {/* Bread crumb */}
            <div className='w-full flex items-center pb-8 gap-2'>
                <Link to={"/"} className='flex items-center justify-center gap-2 text-txtPrimary'>
                    <FaHouse /> Home
                </Link>
                <p>/</p>
                <p>{data?.name}</p>
            </div>

            {/* Main section */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-12 gap-4'>
                {/* Left section */}
                <div className='col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4'>
                    {/* Image */}
                    <img className='w-full h-auto object-contain rounded-md' src={data?.imageUrl} alt="Template" />
                    <div className='w-full flex flex-col items-start justify-start gap-2'>
                        <div className='w-full flex items-start justify-between'>
                            <p className='text-base text-txtPrimary font-semibold'>{data?.title}</p>
                            <div className='flex items-center justify-center gap-1'><BiSolidHeart className='text-red-500' /> <p className='text-base text-txtPrimary font-semibold'>{data?.favourites?.length} likes</p></div>
                        </div>

                        {userData && <div className='flex items-center justify-center gap-3'>
                            {
                                userData?.collection?.includes(data?._id) ?
                                    <React.Fragment>
                                        <div className='flex items-center justify-center px-4 py-2 broder border-gray-300 gap-3 rounded-md hover:bg-gray-200 cursor-pointer' onClick={addToCollection}>
                                            <BiSolidFolder className='text-base text-txtPrimary' />
                                            <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove from collections</p>
                                        </div>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <div className='flex items-center justify-center px-4 py-2 broder border-gray-300 gap-3 rounded-md hover:bg-gray-200 cursor-pointer' onClick={addToCollection}>
                                            <BiFolderPlus className='text-base text-txtPrimary' />
                                            <p className='text-sm text-txtPrimary whitespace-nowrap'>Add to collections</p>
                                        </div>
                                    </React.Fragment>
                            }
                            {
                                data?.favourites?.includes(userData?.uid) ?
                                    <React.Fragment>
                                        <div className='flex items-center justify-center px-4 py-2 broder border-gray-300 gap-3 rounded-md hover:bg-gray-200 cursor-pointer' onClick={addToFavs}>
                                            <BiSolidHeart className='text-base text-txtPrimary' />
                                            <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove from favourites</p>
                                        </div>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <div className='flex items-center justify-center px-4 py-2 broder border-gray-300 gap-3 rounded-md hover:bg-gray-200 cursor-pointer' onClick={addToFavs}>
                                            <BiHeart className='text-base text-txtPrimary' />
                                            <p className='text-sm text-txtPrimary whitespace-nowrap'>Add to favourites</p>
                                        </div>
                                    </React.Fragment>
                            }
                        </div>}
                    </div>
                </div>
                {/* right section */}
                <div className='col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start gap-4'>
                    {/* Discover more */}
                    <div className='w-full h-72  bg-blue-200 rounded-md overflow-hidden relative' style={{ background: "url('https://images.pexels.com/photos/1037994/pexels-photo-1037994.jpeg')", backgroundPosition: "center", backgroundSize: "cover" }}>
                        <div className='absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-center px-4 py-3'>
                            <Link to={"/"} className='px-4 py-2 rounded-md border border-gray-200 cursor-pointer text-white' >Discover more</Link>
                        </div>
                    </div>
                    {/* Edit */}
                    {
                        userData && <Link className='w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer' to={`/resume/${data?.name}?templateId=${templateId}`}>
                            <p className='text-white font-semibold text-lg'>Edit this template</p>
                        </Link>
                    }
                    {/* Tags */}
                    <div className='w-full flex items-center justify-start flex-wrap gap-2'>
                        {
                            data?.tags?.map((tag, index) => (
                                <div className='px-4 py-2 rounded-md whitespace-nowrap border border-gray-300 text-sm' key={index}>{tag}</div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Similar templates */}
            {
                templates && templates.length > 0 &&
                <div className='w-full py-8 flex-col items-start justify-start'>
                    <div className='text-lg font-semibold text-txtDark py-4'>You might also like</div>
                    <div className='w-full grid grid-col grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                        <React.Fragment>
                            <AnimatePresence>
                                {templates?.filter((template) => template?._id !== templateId)?.map((template, index) => (
                                    <TemplateDesignPin key={index} template={template} />
                                ))}
                            </AnimatePresence>
                        </React.Fragment>
                    </div>
                </div>
            }

        </div >
    )
}

export default TeamplateDesignPinDetails