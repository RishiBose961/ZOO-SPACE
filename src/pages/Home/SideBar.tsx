
import { useQuery } from "@tanstack/react-query";
import { differenceInCalendarDays, format } from "date-fns";
import { useState } from "react";

import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment";
import Example from "@/components/spinner-inline-4";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

type Taken = {
  _id: string;
  companyname: string;
  name: string;
  group: string;
  expirydate: string;
};

const { base_url } = CheckEnvironment();


const fetchExpiring = async (days: number, token: string) => {
  const res = await fetch(
    `${base_url}/api/dsc/expired?days=${days}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
export default function SideBar() {
  const [days, setDays] = useState(2);
  const [date, setDate] = useState<Date | undefined>();

  const { user } = useSelector(
    (state: {
      auth: {
        user: { token: string }
      }
    }) => state.auth
  )


  const { data, isLoading, isError } = useQuery({
    queryKey: ["expiring", days],
    queryFn: () => fetchExpiring(days, user.token),
    enabled: !!user?.token,
    staleTime: 10000,
  });

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    setDate(selected);

    const diff = differenceInCalendarDays(
      selected,
      new Date()
    );

    const safeDays = diff <= 0 ? 1 : diff;
    setDays(safeDays);

  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <h2 className="text-xl font-semibold">
          Expiring DSC Records
        </h2>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={days === 2 ? "default" : "outline"}
            onClick={() => setDays(2)}
          >
            2 Days
          </Button>

          <Button
            variant={days === 5 ? "default" : "outline"}
            onClick={() => setDays(5)}
          >
            5 Days
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </div>

      </div>


      {isError && (
        <div className="text-red-500">
          Failed to load data
        </div>
      )}
      {isLoading ? (
        <div className="text-muted-foreground">
          <Example data="Expiring DSC Records" />
        </div>
      ) : <>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.data?.map((item: Taken) => (
                <TableRow key={item._id}>
                  <TableCell><Link to={`/dsc/${item._id}`}>{item.companyname.slice(0, 15)}.. </Link></TableCell>
                  <TableCell>{item.group}</TableCell>
                  <TableCell>{item.expirydate}</TableCell>

                </TableRow>
              ))}

              {data?.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No records expiring in {days} days
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </>}
    

    </div>
  );
}
