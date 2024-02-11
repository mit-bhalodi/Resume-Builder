import { useQuery } from "react-query"
import { toast } from "react-toastify"

const useUser = () => {
    const { data, isLoading, isError, refetch } = useQuery("user", async () => {
        try {
        } catch (err) {
            const userDetail = await getUserDetail()
            return userDetail
            if (!err.message.includes("not authenticated")) {
                toast.error("Something went wrong")
            }
        }
    })
}
