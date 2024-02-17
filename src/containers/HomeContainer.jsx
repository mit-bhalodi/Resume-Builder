import React from "react"
import { Filters, MainSpinner, TemplateDesignPin } from "../components"
import useTemplates from "../hooks/useTemplates"
import { AnimatePresence } from "framer-motion"
const HomeContainer = () => {
    const { data: templates, isLoading: templatesLoading, isError: templatesError } = useTemplates()

    if (templatesLoading) {
        return <MainSpinner />
    }

    return (
        <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
            {/* Filter */}
            <Filters />

            {/* Templates */}
            {/* Error */}
            {
                templatesError ?
                    <React.Fragment>
                        <p className="text-base lg:text-lg text-txtDark font-semibold">Something went wrong</p>
                    </React.Fragment> :

                    <React.Fragment>
                        {
                            templates && templates.length > 0 && <div className="w-full grid grid-col-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                <RenderTemplate templates={templates} />
                            </div>
                        }
                    </React.Fragment>
            }
        </div>
    )
}

const RenderTemplate = ({ templates }) => {
    return (<React.Fragment>
        {
            templates && templates.length > 0 ?
                <React.Fragment>
                    <AnimatePresence>
                        {templates.map((template, index) => (
                            <TemplateDesignPin key={index} template={template} />
                        ))}
                    </AnimatePresence>
                </React.Fragment> :
                <React.Fragment>
                    <p>No data found</p>
                </React.Fragment>
        }
    </React.Fragment>)
}

export default HomeContainer
