import React, { Suspense } from "react"
import { Header, MainSpinner } from "../components"
import { Route, Routes } from "react-router-dom"
import { HomeContainer } from "../containers"
import { CreateResume, CreateTemplate, TeamplateDesignPinDetails, UserProfile } from "../pages"

const HomeScreen = () => {
    return (
        <div className="w-screen flex flex-col items-center justify-center">
            {/* Header component */}
            <Header />
            <main className="w-full h-full">
                <Suspense fallback={<MainSpinner />}>
                    <Routes>
                        <Route path="/" element={<HomeContainer />} />
                        <Route path="/template/create" element={<CreateTemplate />} />
                        <Route path="/profile/:uid" element={<UserProfile />} />
                        <Route path="/resume/*" element={<CreateResume />} />
                        <Route path="/resume-detail/:templateId" element={<TeamplateDesignPinDetails />} />
                    </Routes>
                </Suspense>
            </main>
            <footer>
            </footer>
        </div>
    )
}

export default HomeScreen
