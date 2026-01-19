import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import CheckEnvironment from "@/CheckEnvironment/CheckEnvironment"

const Return = ({ dscid }: { dscid: string | undefined }) => {
  const queryClient = useQueryClient()

    const { user } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        user: { token: string; _id: string };
      };
    }) => state.auth
  );

  const { base_url } = CheckEnvironment();
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")

  const returnMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${base_url}/api/return/create`,
        {
          name,
          contact,
          dscid,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTakenDatas"] })
      setName("")
      setContact("")
    },
  })

  const handleReturn = () => {
    returnMutation.mutate()
  }

  return (
    <div className="space-y-3 bg-card p-3 rounded-2xl">
      <p className="font-bold">Return DSC</p>
      <hr/>
      <div className="space-y-3">
        <Label>Name</Label>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-3">
        <Label>Contact Number</Label>
        <Input
          placeholder="Enter your contact number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>

      <Button
        className="rounded-full w-full"
        onClick={handleReturn}
        disabled={returnMutation.isPending}
      >
        {returnMutation.isPending ? "Submitting..." : "Return"}
      </Button>
    </div>
  )
}

export default Return
