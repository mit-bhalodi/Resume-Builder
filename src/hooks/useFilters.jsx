import { useQuery } from "react-query"

const useFilters = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "globalFilter",
        () => ({ searchTerm: '' }), // trying to return initial data
        { refetchOnWindowFocus: false }
    )
    return { data, isLoading, isError, refetch }
}
export default useFilters