import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Bell, Mail } from "lucide-react";
import Link from "next/link";
import { Dialog3, DialogContent3, DialogHeader3, DialogTitle3 } from "@/components/ui/dialog3";


const notificationCategories = [
  "All",
  "Notifications",
  "Messages",
  "Requests",
  "Comments",
  "Likes",
]


export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const [ mounted, setMounted ] = useState(false);

  // Notifications useState()
  const [ notificationsModal, setNotificationsModal ] = useState(false);
  const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");

  const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

  // useEffect()
		useEffect(() => {
			setMounted(true);
		}, []);

    // scroll function
  const scroll = (direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        ref.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Soma Studio</h1>
        <div className="ml-auto flex items-center gap-2">

          {/* Bell Button */}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-200 rounded-sm"
                onClick={() => setNotificationsModal(true)}
              >
                <Bell className="h-6 w-6" />
            </Button>

          {/* Mail Button */}
          <Link href="/home/chat">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-200 rounded-sm"
              >
                <Mail className="h-6 w-6" />
              </Button>
            </Link>

          {/* Theme Toggle */}
          {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

        {/* Notifications Modal */}
            <Dialog3
              open={notificationsModal}
              onOpenChange={(open: boolean) => !open && setNotificationsModal(false)}
              >
                <DialogContent3 className="sm:max-w-[500px] max-w-[380px] rounded-lg font-playfair-display h-[600px] flex flex-col">

                {/* Create Content Modal Header */}
                <DialogHeader3>
                  <DialogTitle3 className="text-2xl font-bold">Notifications</DialogTitle3>
                </DialogHeader3>

                {/* Categories Container */}
                <div
                  ref={notificationCategoriesScrollRef}
                  className="flex items-center justify-start space-x-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {notificationCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveNotificationCategory(category)}
                      className={`cursor-grab whitespace-nowrap text-sm font-medium transition-colors ${
                        activeNotificationCategory === category
                          ? "text-blue-600 bg-blue-50 px-4 py-2 rounded-sm"
                          : "text-primary bg-muted hover:text-blue-600 hover:bg-muted px-4 py-2 rounded-sm"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Results Section */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Sample result items - replace with actual data */}
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium">Result Item 1</h4>
                      <p className="text-sm text-gray-600">Description of result item 1</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium">Result Item 2</h4>
                      <p className="text-sm text-gray-600">Description of result item 2</p>
                    </div>
                  </div>
                </div>
              </DialogContent3>
            </Dialog3>
        </div>
      </div>
    </header>
  )
}
