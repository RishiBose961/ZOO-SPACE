import { useState, type ChangeEvent, type FormEvent } from "react"
import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { HandHelping, Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import UseHookTaken from "@/components/hook/TakenHook/UseHookTaken"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"



type TakenForm = {
    name: string
    contact: string
}

type TakenPayload = TakenForm & {
    dscid: string
}

type ApiResponse<T> = {
    success: boolean
    message: string
    data: T
}

type TakenCreateProps = {
    dscid: string | undefined
}


const TakenCreate = ({ dscid }: TakenCreateProps) => {
    const queryClient = useQueryClient()

    const { isPending, getTakenData } = UseHookTaken(dscid) as {
        isPending: boolean
        getTakenData: Array<{
            _id: string
            name: string
            contact: string
            createdAt: Date
        }>
    }



    const { user } = useSelector(
        (state: {
            auth: {
                user: { token: string }
            }
        }) => state.auth
    )
    const [open, setOpen] = useState<boolean>(false)
    const [form, setForm] = useState<TakenForm>({
        name: "",
        contact: "",
    })
    const { base_url } = CheckEnvironment();

    const mutation = useMutation<
        ApiResponse<TakenPayload>,
        AxiosError<{ message: string }>,
        TakenPayload
    >({
        mutationFn: async (payload) => {
            const res = await axios.post<ApiResponse<TakenPayload>>(
                ` ${base_url}/api/taken/create`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    }
                }
            )
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getTakenDatas"] })
            setForm({ name: "", contact: "" })
            setOpen(false)
        },
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!dscid) {
            // dscid must be present to create a Taken record
            return
        }

        mutation.mutate({
            ...form,
            dscid,
        })
    }
    const hasTaken = Array.isArray(getTakenData) && getTakenData.length > 0

    console.log(hasTaken);
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    !hasTaken ?<Button variant="outline" className="cursor-pointer">
                    <HandHelping className="mr-2 h-4 w-4" />
                    Take
                </Button>: <Button variant="default" className="cursor-pointer">
                    <HandHelping className="mr-2 h-4 w-4" />
                    Taken
                </Button>
                }
               
            </DialogTrigger>


            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Information of Taken Person</DialogTitle>
                    <DialogDescription>
                        Fill the information of the person who is taking the item.
                    </DialogDescription>
                </DialogHeader>
                {isPending ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <>
                        {getTakenData?.map((taken: { _id: string; name: string; contact: string; createdAt: Date }) => (
                            <div key={taken._id} className="mb-4 p-4 border rounded">
                                <h3 className="text-lg font-semibold mb-2">
                                    Name: {taken.name}
                                </h3>
                                <p className="mb-2">Contact: {taken.contact}</p>
                                <p className="text-sm text-gray-500">
                                    Taken At: {new Date(taken.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}

                        {!hasTaken && (
                            <form onSubmit={handleSubmit}>


                                <div className="space-y-3 mt-4">
                                    <Input
                                        name="name"
                                        placeholder="Name of Taken Person"
                                        autoComplete="new-password"
                                        spellCheck={false}
                                        autoCorrect="off"
                                        className="capitalize"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Input
                                        name="contact"
                                        placeholder="Contact Number of Taken Person"
                                        type="text"
                                        value={form.contact}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {mutation.isError && (
                                    <p className="text-sm text-red-500 mt-2">
                                        {mutation.error.response?.data?.message ||
                                            "Something went wrong"}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    className="mt-4 w-full"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </form>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default TakenCreate
