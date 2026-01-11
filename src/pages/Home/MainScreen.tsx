import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Eye } from "lucide-react"
import { Link } from "react-router"

const cardData = [
  {
    id: 1,
    name: "DSC Dashboard",
    link: "/dsc-dashboard",
    description: "View analytics and stats",
  },
  {
    id: 2,
    name: "File Finder",
    link: "/projects",
    description: "Search and manage files",
    madeNot:false
  },
  {
    id: 3,
    name: "Settings",
    link: "/settings",
    description: "Update preferences",
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

          <CardContent>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default MainScreen
