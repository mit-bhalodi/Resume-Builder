import React from "react"
import { Logo } from "../assets"
import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div className="w-full flex items-center justify-between border-t border-grey-300">
            <div className="flex flex-row justify-start items-center gap-3 py-3">
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-8 h-auto object-contain"
                />
                <div>Resume builder</div>
            </div>
            <div className="flex items-center justify-between gap-6">
                <Link to={"/"} className="text-blue-700 text-sm">
                    Home
                </Link>
                <Link to={"/"} className="text-blue-700 text-sm">
                    Contact
                </Link>
                <Link
                    to={"/"}
                    className="text-blue-700 text-sm whitespace-nowrap"
                >
                    Privacy policy
                </Link>
            </div>
        </div>
    )
}

export default Footer
