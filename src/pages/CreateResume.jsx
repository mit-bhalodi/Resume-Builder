import React from 'react'
import { Routes, Route } from "react-router-dom"
import { TemplatesData } from "../utils/Helpers"

const CreateResume = () => {
    return (
        <div className='w-full flex flex-col items-center justify-start py-4'>
            <Routes>
                {
                    TemplatesData?.map((template) => (
                        <Route path={`/${template?.name}`} Component={template.component} key={template?.id}></Route>
                    ))
                }
            </Routes>
        </div>
    )
}

export default CreateResume