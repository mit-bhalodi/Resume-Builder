import React, { useEffect } from "react"
import { Logo } from "../assets"
import { Footer } from "../containers"
import { AuthButtonWithProvider, MainSpinner } from "../components"
import { FaGoogle, FaGithub } from "react-icons/fa6"
import useUser from "../hooks/useUser"
import { useNavigate } from "react-router-dom"

const Authentication = () => {
    const { data, isLoading, isError } = useUser()
    const navigate = useNavigate()
    useEffect(() => {
        if (!isLoading && data) {
            navigate("/", { replace: true })
        }
    }, [isLoading, isError, data, navigate])

    // Is screen is loading / data fetching
    if (isLoading) {
        return <MainSpinner />
    }

    return (
        <div className="auth-section">
            <img src={Logo} alt="Logo" className="w-12 h-auto object-contain" />
            <div className="w-full flex flex-1 flex-col justify-center items-center gap-6">
                <h1 className="text3-xl lg:text-4xl text-blue-700">
                    Welcome to resume builder
                </h1>
                <h2 className="text-2-xl text-grey-600">Authenticate</h2>
                <div className="w-full lg:w-96 flex flex-col p-2 items-center justify-start gap-6">
                    <AuthButtonWithProvider
                        Icon={FaGoogle}
                        label={"Sign in with Google"}
                        provider={"GoogleAuthProvider"}
                    />
                    <AuthButtonWithProvider
                        Icon={FaGithub}
                        label={"Sign in with Github"}
                        provider={"GithubAuthProvider"}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Authentication
