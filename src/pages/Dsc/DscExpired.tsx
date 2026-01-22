import UseGetExpired from "@/components/hook/DscHook/UseGetExpired";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Link } from "react-router";
const DscExpired = () => {
    const { isPending, getExpired } = UseGetExpired() as {
        isPending: boolean;
        getExpired: {
            data: { companyname: string; name: string; expirydate: string; group: string; _id: string; }[];
        };
    }

    return (
        <Table>
            <TableCaption>A list of your recent dsc expired.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>

                {
                    isPending ? (
                        <TableCell colSpan={4} className="text-center">
                            Loading...
                        </TableCell>
                    ) : getExpired?.data?.map((dsc:{ companyname: string; name: string; expirydate: string; group: string; _id: string; }, index : number) => (
                        <TableRow>
                            <TableCell key={index} className="font-medium">
                                {dsc.companyname}
                            </TableCell>
                            <TableCell className="font-medium">
                                {dsc.name}
                            </TableCell>
                            <TableCell  className="font-medium">
                                {dsc.expirydate}
                            </TableCell>
                            <TableCell  className="font-medium">
                                {dsc.group}
                            </TableCell>
                             <TableCell  className="font-medium">
                               <Link className=" hover:bg-amber-700 p-2 rounded-full" to={`/dsc/${dsc._id}`}>View Details</Link>
                            </TableCell>
                        </TableRow>
                    ))}



            </TableBody>
        </Table>
    )
}

export default DscExpired