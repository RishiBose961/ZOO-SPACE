import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Return = () => {
    return (
        <div className="space-y-3 bg-card p-2 rounded-2xl">
             <p className=" font-bold">Return</p>

            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input placeholder="Enter your name" />
            <Label htmlFor="sheet-demo-name">Contact Number</Label>
            <Input placeholder="Enter your contact number" />

            <Button className="rounded-full">Return</Button>
            
        </div>
    )
}

export default Return