/* eslint-disable react-hooks/exhaustive-deps */
import { endSession, startSession } from "@/auth/session";
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
import { useEffect } from "react";
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
    endSession()
    dispatch(logoutUserAction());
    window.location.replace("/auth");
  };

  const onLoginSuccess = (token: string) => {
  startSession(token, () => {
    dispatch(logoutUserAction())
    window.location.replace("/auth")
  })
}

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      onLoginSuccess(user.token)
    }
  }, [user?.token]);

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
      name: "File Finder",
      link: "/projects",
      madeNot: false,
    },
    {
      id: 4,
      name: "Auth View & Manage",
      link: "/auth-manage",
      madeNot: true,
      authRequired: "admin",
    },
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
        <Badge variant="secondary">v1</Badge>
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
                  <Button>
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
