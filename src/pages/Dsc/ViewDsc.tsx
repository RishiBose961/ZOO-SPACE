import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import Example from "@/components/spinner-inline-4";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

type Post = {
  _id: string;
  companyname: string;
  group: string;
  name: string;
  expirydate: string;
};

type SearchResponse = {
  results: Post[];
  count: number;
};

const ViewDsc = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const { base_url } = CheckEnvironment();

  const { user } = useSelector(
    (state: {
      auth: {
        user: {
          roles: string; token: string
        }
      }
    }) => state.auth
  )


  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchPosts = async (): Promise<SearchResponse> => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.append("q", debouncedSearch);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const res = await fetch(`${base_url}/api/dsc/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch posts");

    const data = await res.json();
    return data as SearchResponse;
  };

  const { data, isLoading, isFetching } = useQuery<SearchResponse>({
    queryKey: ["posts", debouncedSearch, page],
    queryFn: fetchPosts,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });


  return (
    <div className=" mx-auto p-4">
      <div className="max-w-md mx-auto">
        <input
          type="search"
          placeholder="🔎 Search DSC by Company Name, Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-full border-3 ps-5 pe-5"
        />
      </div>



      {isLoading && <div className="flex justify-center mt-4"><Example data="View DSC" /></div>}
      {isFetching && !isLoading && <p className="mt-2">Updating...</p>}

      <div className="mt-4">
        {data?.results?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
            <p>No results found</p>
          </div>
        ) : (
          <div className="mt-4">
            {data?.results?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed 
      bg-gray-50 border-gray-300 text-gray-500
      dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400">
                <p>No results found</p>
              </div>
            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.results?.map((post: Post) => (
                  <div
                    key={post._id}
                    className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-2
            bg-white border border-gray-200
            dark:bg-gray-900/50 dark:border-gray-700 dark:shadow-gray-900/30"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold truncate pr-2 text-lg
              text-gray-900 
              dark:text-gray-100">
                        {post.companyname}
                      </h3>
                    


                    </div>
                    <p className="text-sm font-medium
            text-gray-600 
            dark:text-gray-300">
                      {post.name}
                    </p>
                    <div className="mt-auto pt-3 text-xs ">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-semibold mr-1">Expires:</span>
                          <span className="font-mono">{post.expirydate}</span>
                        </div>

                        <div>
                          <span className="font-semibold mr-1">Box:</span>
                          <span className="font-bold">{post.group}</span>
                        </div>
                      </div>

                    </div>
                    <div className="mt-auto pt-3 border-t flex justify-between items-center space-x-2 text-xs
            border-gray-100 
            dark:border-gray-700 ">
                      <div className="flex space-x-2">
                        <Link to={`/dsc/${post._id}`} className="flex space-x-2 items-center p-2 rounded-full hover:bg-amber-200/60"><Eye /> <span>View</span></Link>
                      

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? null : <>
        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button
            disabled={(data?.count ?? 0) < limit}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </>}

    </div>
  );
};

export default ViewDsc;
