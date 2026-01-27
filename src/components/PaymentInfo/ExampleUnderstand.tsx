import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
const ExampleUnderstand = () => {
    return (
        <div className="flex justify-end "><Tooltip>
            <TooltipTrigger className="text-xs italic cursor-pointer">Example (i)</TooltipTrigger>
            <TooltipContent>
                <p className="font-semibold">Example (Half-Yearly)</p>
                <div>
                    <p>paymentDate = Jan 1</p>
                    <p>dueDate = July 1</p>
                    <p>today = July 6</p>
                    <p>fineAmount = 50</p>

                    <p className="mt-3">daysLate = 5</p>
                    <p>fine = 5 × 50 = 250</p>
                    <p>finalAmount = Amount + 250</p>
                </div>
            </TooltipContent>
        </Tooltip></div>
    )
}

export default ExampleUnderstand