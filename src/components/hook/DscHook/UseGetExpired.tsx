import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const UseGetExpired = () => {
    const { user, isAuthenticated } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const { base_url } = CheckEnvironment();


    const {
        isPending,
        error,
        isError,
        data: getExpired,
    } = useQuery({
        queryKey: ["getExpireds"],
        queryFn: async () => {
            return await fetch(
                `${base_url}/api/dsc/exp/date`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            ).then((res) => res.json());
        },
        enabled: isAuthenticated,
        staleTime: 10000,

    });

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    return { isPending, getExpired };
}

export default UseGetExpired