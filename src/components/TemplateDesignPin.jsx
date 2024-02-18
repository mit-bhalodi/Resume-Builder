import React from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { FadeInOutWithOpacity, ScaleInOut } from '../animations';
import { BiFolder, BiHeart, BiSolidFolderPlus, BiSolidHeartCircle } from "react-icons/bi"
import { Tooltip } from 'react-tooltip';
import useUser from '../hooks/useUser';
import { saveToCollections, saveToFavourites } from '../api';
import useTemplates from '../hooks/useTemplates';
import { useNavigate } from 'react-router-dom';

const TemplateDesignPin = ({ template, index }) => {

    const { data: user, refetch: userRefetch } = useUser()
    const { refetch: temp_refetch } = useTemplates()
    const navigate = useNavigate()

    const addToCollection = async (e) => {
        e.stopPropagation()
        await saveToCollections(user, template)
        userRefetch();
    }

    const addToFavs = async (e) => {
        e.stopPropagation()
        await saveToFavourites(user, template)
        userRefetch();
        temp_refetch();
    }

    const handleRouteNavigation = () => {
        navigate(`/resume-detail/${template._id}`, { replace: true })
    }

    return (
        <motion.div key={template?._id} {...ScaleInOut(index)} >
            <div className='w-full h-[500px] 2xl:h-[740px] bg-gray-200 overflow-hidden relative flex justify-center items-center rounded-md group' onClick={handleRouteNavigation}>
                <img src={template?.imageUrl} alt="Sample" className='f-full h-full object-cover hover:' />
                <AnimatePresence>
                    <motion.div {...FadeInOutWithOpacity} className='absolute inset-0 bg-[rgba(0,0,0,0.4)] justify-start items-center px-4 py-3 z-50 cursor-pointer hidden group-hover:flex group-hover:flex-col'>
                        <div className='flex flex-col items-end justify-start w-full gap-6'>
                            <InnerBoxCard label={user?.collection?.includes(template?._id) ? "Remove from colleation" : "Add to collection"} Icon={user?.collection?.includes(template?._id) ? BiSolidFolderPlus : BiFolder} onHandle={addToCollection} />
                            <InnerBoxCard label={template?.favourites?.includes(user?.uid) ? "Remove from favourites" : "Add to favourites"} Icon={template?.favourites?.includes(user?.uid) ? BiSolidHeartCircle : BiHeart} onHandle={addToFavs} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

const InnerBoxCard = ({ label, Icon, onHandle }) => {
    const iconId = `${Math.random(10)}-icons`;
    return (
        <div onClick={onHandle} className='bg-gray-100 rounded-md flex justify-start items-center p-2 hover:shadow-md' data-tooltip-id={iconId} data-tooltip-content={label}>
            <Icon id={iconId} className="text-txtLight text-base" />
            <Tooltip id={iconId} style={{ fontSize: '0.8rem' }} />
        </div>
    )
}

export default TemplateDesignPin;