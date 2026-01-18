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
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import axios from "axios"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"

type User = {
    _id?: string
    name?: string
    roles?: string
    blocked?: boolean
}

type UpdateAuthProps = {
    users: User
}

const UpdateAuth = ({ users }: UpdateAuthProps) => {
    const queryClient = useQueryClient()
    const { base_url } = CheckEnvironment();

    const { user } = useSelector(
        (state: {
            auth: {
                isAuthenticated: boolean;
                user: { token: string; _id: string };
            };
        }) => state.auth
    );

    const [name, setName] = useState(users?.name || "")
    const [roles, setRoles] = useState(users?.roles || "")
    const [blocked, setBlocked] = useState(users?.blocked ?? false)

    const updateUserMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.patch(
                `${base_url}/api/users/update/${users._id}`,
                {
                    name,
                    roles,
                    blocked,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            )
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAdminDatas"] })
        },
    })

    const handleSubmit = () => {
        updateUserMutation.mutate()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Edit</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update User Auth</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to update this user?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="space-y-3">
                        <Label>Name</Label>
                        <Input
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    {
                        users.roles !== "admin" && (
                            <>
                                <div className="space-y-3">
                                    <Label>Roles</Label>
                                    <Select value={roles} onValueChange={setRoles}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="employee">Employee</SelectItem>
                                            <SelectItem value="incharge">Incharge</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label>Status</Label>
                                    <Select
                                        value={blocked ? "blocked" : "active"}
                                        onValueChange={(value) => setBlocked(value === "blocked")}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="blocked">Blocked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div></>
                        )
                    }


                    <Button
                        onClick={handleSubmit}
                        disabled={updateUserMutation.isPending}
                        className="w-full"
                    >
                        {updateUserMutation.isPending ? "Updating..." : "Confirm"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateAuth
