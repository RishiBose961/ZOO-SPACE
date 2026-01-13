import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Eye } from "lucide-react"
import { Link } from "react-router"

const cardData = [
  {
    id: 1,
    name: "DSC Registration",
    link: "/dsc-register",
    madeNot:true
  },
  
  {
    id: 2,
    name: "DSC View & Manage",
    link: "/dsc-manage",
    madeNot:true
  },
  {
    id: 3,
    name: "File Finder",
    link: "/projects",
    madeNot:false
  },
]

const MainScreen = () => {
  return (
    <div className="space-y-4 p-4">
      {cardData.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{item.name}</CardTitle>

          {
            item.madeNot === false ? (
              <span className="text-sm text-red-500"> Not Available</span>
            ) : <CardAction className=" space-x-2">
              <Link to={item.link}>
                <Button>
                  <Eye/>View</Button>
              </Link>

            </CardAction>
          }
            
          </CardHeader>

        </Card>
      ))}
    </div>
  )
}

export default MainScreen
