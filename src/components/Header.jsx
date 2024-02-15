import React from "react"
import useUser from "../hooks/useUser"
import { Link } from "react-router-dom"
import { Logo } from "../assets"
import { AnimatePresence, motion } from "framer-motion"
import { HashLoader } from "react-spinners"

const Header = () => {
    const { data, isLoading, isError } = useUser()
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
                />
            </div>
            <AnimatePresence>
                {isLoading ? (
                    <HashLoader color="#36d7b7" size={40}></HashLoader>
                ) : (
                    <React.Fragment>
                        {data ? (
                            <motion.div></motion.div>
                        ) : (
                            <Link to={"/auth"}>
                                <motion.button>Login</motion.button>
                            </Link>
                        )}
                    </React.Fragment>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
