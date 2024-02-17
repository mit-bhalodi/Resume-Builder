import React, { useState } from "react"
import useUser from "../hooks/useUser"
import { Link } from "react-router-dom"
import { Logo } from "../assets"
import { AnimatePresence, motion } from "framer-motion"
import { HashLoader } from "react-spinners"
import { HiLogout } from 'react-icons/hi'
import { SlideUpAnimationMenu, FadeInOutWithOpacity } from "../animations/index"
import { useQueryClient } from "react-query"
import { auth } from "../config/firebase.config"
import { adminIds } from "../utils/Helpers"
import useFilters from "../hooks/useFilters"

const Header = () => {
    const { data, isLoading } = useUser()
    const [isMenu, setIsMenu] = useState(false)
    const queryClient = useQueryClient()

    const { data: filterData } = useFilters()

    const signOutUser = async () => {
        await auth.signOut().then(() => {
            queryClient.setQueryData("user", null)
        })
    }

    const handleSearchTerm = (value) => {
        queryClient.setQueryData("globalFilter", { ...queryClient.getQueryData("globalFilter"), searchTerm: value })
    }

    return (
        <header className="w-screen flex items-center justify-center px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0">
            {/* Logo */}
            <Link to={"/"}>
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-12 h-auto object-container"
                />
            </Link>
            {/* Input */}
            <div className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
                    onChange={(e) => handleSearchTerm(e.target.value)}
                    value={filterData?.searchTerm || ''}
                />
                {filterData?.searchTerm && <div className="w-8 h-8 flex items-center justify-center cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md" onClick={() => handleSearchTerm('')}>
                    <p className="text-2xl text-black">x</p>
                </div>}
            </div>
            <AnimatePresence>
                {isLoading ? (
                    <HashLoader color="#36d7b7" size={40}></HashLoader>
                ) : (
                    <React.Fragment>
                        {data ? (
                            <motion.div className="relative" onClick={() => setIsMenu(!isMenu)}>
                                {data?.photoURL ? <div className="w-12 h-12 rounded-md relative flex items-center justify-center"><img src={data.photoURL} alt="user" className="w-full h-full object-cover rounded-md" /></div> : <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer text-lg text-white">{data?.email[0]}</div>}
                                {/* Dropdown */}
                                <AnimatePresence>
                                    {isMenu && <motion.div {...SlideUpAnimationMenu} onMouseLeave={() => setIsMenu(false)} className="absolute px-4 py-3 flex flex-col bg-white rounded-md right-0 items-center justify-start gap-3 w-64 h-auto pt-12">
                                        {data?.photoURL ? <div className="w-20 h-20 rounded-md relative flex flex-col items-center justify-center"><img src={data.photoURL} alt="user" className="w-full h-full object-cover rounded-full" /></div> : <div className="w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer text-3xl text-white">{data?.email[0]}</div>}
                                        {data?.displayName && <p className="txt-txtDark txt-lg">{data?.displayName}</p>}
                                        <div className="w-full flex-col flex items-start gap-8 pt-6">
                                            <Link className="text-txtLight hover:text-txtDark whitespace-nowrap" to={"/profile"}>My Account</Link>

                                            {/* Add template / only admins */}
                                            {adminIds.includes(data?.uid) && <Link className="text-txtLight hover:text-txtDark whitespace-nowrap" to={"/template/create"}>Add New Template</Link>}

                                            {/* Sign out part */}
                                            <div className="w-full flex items-center justify-between gap-4 border-t border-gray-300 pt-4 group">
                                                <p className="text-txtLight group-hover:text-txtDark cursor-pointer" onClick={signOutUser}>Sign Out</p>
                                                <HiLogout className="text-txtLight group-hover:text-txtDark cursor-pointer" />
                                            </div>
                                        </div>
                                    </motion.div>}
                                </AnimatePresence>

                            </motion.div>
                        ) : (
                            <Link to={"/auth"}>
                                <motion.button {...FadeInOutWithOpacity} className="btn btn-primary px-4 py-2 rounded-md border border-gray-200 hover:shadow-md active:scale-95 duration-150">Login</motion.button>
                            </Link>
                        )}
                    </React.Fragment>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
