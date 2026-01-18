import UseAdminHook from "@/components/hook/AdminHook/UseAdminHook";
import Example from "@/components/spinner-inline-4";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { JSX } from "react/jsx-runtime";
import UpdateAuth from "./UpdateAuth";


const AuthManage = () => {
  const { isPending, getAdminData } = UseAdminHook() as {
    isPending: boolean;
    getAdminData: {
      map(arg0: (user: { name: string; email: string; roles: string; blocked: boolean; }) => JSX.Element): import("react").ReactNode;
      name: string;
      email: string;
      roles: string;
      blocked: boolean;
    }
  }

  if (isPending) {
    return <div className="flex justify-center mt-5"><Example data="Auth User Information"/></div>;
  }



  return (
     <div className="w-full  rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getAdminData?.map((user : { name: string; email: string; roles: string; blocked: boolean; }) => (
              <TableRow key={user.email}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles}</TableCell>
                <TableCell>{user.blocked ? "Blocked" : "Active"}</TableCell>
                <TableCell>
                  <UpdateAuth users={user}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  )
}

export default AuthManage