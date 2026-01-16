import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const UseHookTaken = (value:string) => {
 const { user, isAuthenticated } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        user: { token: string; _id: string };
      };
    }) => state.auth
  );
  const {
    isPending,
    error,
    isError,
    data: getTakenData,
  } = useQuery({
    queryKey: ["getTakenDatas",value],
    queryFn: async () => {
      return await fetch(
        `http://localhost:5000/api/taken/${value}`,
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

  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return { isPending, getTakenData };
}

export default UseHookTaken