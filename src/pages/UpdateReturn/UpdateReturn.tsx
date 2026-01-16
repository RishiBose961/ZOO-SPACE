import { Button } from "@/components/ui/button"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


import Return from "./Return"
import UpdateDsc from "./UpdateDsc"
const UpdateReturn = ({ dscid }: { dscid: string }) => {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Return | Update</Button></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Return | Update</SheetTitle>
                    <SheetDescription>
                        Return | Update {dscid}
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4 space-y-3">
                   <Return/>
                   <UpdateDsc/>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default UpdateReturn