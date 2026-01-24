import { Helmet } from "react-helmet";
import MainScreen from "./MainScreen";
import SideBar from "./SideBar";
const Home = () => {

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>ZOO SPACE | Home</title>
            </Helmet>
            <div className="grid grid-cols-1 lg:grid-cols-3  mb-4 gap-2">
                <div className="lg:col-span-2 lg:h-[calc(100vh-80px)] rounded-xl">
                    <MainScreen />
                </div>
                <div className="lg:h-[calc(100vh-80px)]">
                    <SideBar />
                </div>

            </div>
        </>
    )
}

export default Home