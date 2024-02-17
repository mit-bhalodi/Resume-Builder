import React from 'react'
import { MdLayersClear } from "react-icons/md"
import { Tooltip } from 'react-tooltip'
import { FiltersData } from '../utils/Helpers'
import useFilters from '../hooks/useFilters'
import { useQueryClient } from 'react-query'

const Filters = () => {
    const { data: filterData } = useFilters()

    const queryClient = useQueryClient()

    const handleFilterValue = (value) => {
        queryClient.setQueryData("globalFilter", { ...queryClient.getQueryData("globalFilter"), searchTerm: value })
    }

    return (
        <div className='w-full flex items-center justify-start py-4'>
            <div onClick={() => handleFilterValue('')} className='border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative' data-tooltip-id="my-tooltip" data-tooltip-content="Clear all">
                <MdLayersClear className='text-xl' />
            </div>
            <Tooltip id="my-tooltip" style={{ fontSize: '0.8rem' }} />

            <div className='w-full flex flex-row items-center justify-start overflow-x-scroll gap-2 scrollbar-none'>
                {FiltersData && FiltersData.map((item) => (
                    <div onClick={() => handleFilterValue(item.value)} key={item.id} className={`border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 ${filterData?.searchTerm === item.value && "bg-gray-300"}`}><p className='text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap'>{item.label}</p></div>
                ))}
            </div>
        </div>
    )
}

export default Filters