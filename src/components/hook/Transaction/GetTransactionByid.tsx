import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const GetTransactionByid = ({ id }: { id: string }) => {
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
        data: getTransactionByid,
    } = useQuery({
        queryKey: ["getTransactionByids"],
        queryFn: async () => {
            return await fetch(
                `${base_url}/api/transaction/${id}`,
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

    return { isPending, getTransactionByid };
}

export default GetTransactionByid