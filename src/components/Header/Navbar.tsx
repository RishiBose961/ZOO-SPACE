import { Link } from "react-router";
import { ModeToggle } from "../mode-toggle";
import GhostIcon from "../ui/ghost-icon";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        isLoading: boolean;
        user: { name: string; id: number, roles: string };
      };
    }) => state.auth
  );
  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
        <Link to="/" className="flex space-x-2 items-center">
          <GhostIcon className="size-8" /><h1 className="text-lg font-semibold">ZOO SPACE</h1>
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated &&
            <div>
              <p className="text-sm">{user?.name} </p> <p className="text-xs">{user?.roles}</p>
            </div>}

          <ModeToggle />
        </div>

      </div>
      <div className="h-0.5 dark:bg-white bg-black  rounded-full w-full mb-4"></div>
    </header>
  );
};

export default Navbar;
