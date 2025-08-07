import { Ghost, Menu } from "lucide-react"
import { Button } from "./ui/button"

import {
        Sheet,
        SheetContent,
        SheetTrigger
} from "@/components/ui/sheet"
import { NavigationSideBar } from "./navigation/navigation-sidebar"
import { ServerSideBar } from "./server/server-sidebar"

export const MobileToggle = ({
        serverId
}:{
        serverId:string
})=>{
        return (
                <div>
                       <Sheet>
                        <SheetTrigger>
                               <Button variant = "ghost" size="icon" className="md:hidden" >
                                  <Menu/>
                                </Button> 
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 flex gap-0" >
                                <div className="w-[72px]" >
                                        <NavigationSideBar/>
                                </div>
                                <ServerSideBar serverId={serverId} />
                        </SheetContent>
                       </Sheet>
                </div>
        )
}