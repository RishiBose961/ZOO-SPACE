
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logoutUserAction } from "@/slice/authSlice";
import { Eye, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

interface CardItem {
  id: number;
  name: string;
  link: string;
  madeNot: boolean;
  authRequired?: string; // role name
}

const MainScreen = () => {
  const { user, isAuthenticated } = useSelector(
    (state: {
      auth: {
        user: { token: string; roles: string } | null;
        isAuthenticated: boolean;
      };
    }) => state.auth
  );

  const dispatch = useDispatch();


  const handleLogout = () => {

    dispatch(logoutUserAction());
    window.location.replace("/auth");
  };



  const cardData: CardItem[] = [
    {
      id: 1,
      name: "DSC Registration",
      link: "/dsc-register",
      madeNot: true,
    },
    {
      id: 2,
      name: "DSC View & Manage",
      link: "/dsc-manage",
      madeNot: true,
    },
    {
      id: 3,
      name: "DSC Expiry",
      link: "/dsc-expiry",
      madeNot: true,
    },
    {
      id: 5,
      name: "Auth View & Manage",
      link: "/auth-manage",
      madeNot: true,
      authRequired: "admin",
    },
    {
      id: 6,
      name: "DSC Download",
      link: "/dsc-download",
      madeNot: true,
    }
  ];

  const visibleCards = cardData.filter((item) => {
    if (!item.authRequired) return true;
    if (
      item.authRequired &&
      isAuthenticated &&
      user?.roles === item.authRequired
    ) {
      return true;
    }

    return false;
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <Badge variant="secondary">v5</Badge>
        <Button onClick={handleLogout} variant="ghost" className="mr-2 rounded-3xl cursor-pointer"><LogOut /> Logout</Button>

      </div>

      {visibleCards.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{item.name}</CardTitle>

            {item.madeNot === false ? (
              <span className="text-sm text-red-500">Not Available</span>
            ) : (
              <CardAction className="space-x-2">
                <Link to={item.link}>
                  <Button className=" cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
              </CardAction>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default MainScreen;
