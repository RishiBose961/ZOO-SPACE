import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
    return (
        <header className="w-full">
            <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold">ZOO SPACE</h1>
                <ModeToggle/>
            </div>
            <div className="h-0.5 dark:bg-white bg-black  rounded-full w-full mb-4"></div>
        </header>
    );
};

export default Navbar;
