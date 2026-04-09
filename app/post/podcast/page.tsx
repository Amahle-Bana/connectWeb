"use client";

import {
  ChevronUp,
  Eye,
  FileStack,
  Info,
  Mail,
  Mic,
  Monitor,
  PanelLeft,
  Settings,
  Smartphone,
  Tablet,
  Upload,
  UserPlus,
  UserRoundPlus,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScreenSize } from "@/hooks/useScreenSize";

export default function PodcastPost() {
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [styleOpen, setStyleOpen] = useState(false);

    useEffect(() => {
        // Initialize date and time on client side
        const now = new Date();
        setScheduleDate(now.toISOString().split('T')[0]);
        setScheduleTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, []);

    const { isMobile } = useScreenSize();

    return (
      // Main Container
    <main className="flex h-screen font-playfair-display">


    {/* Write Prototyping */}
    <div className={`flex-1 w-1/2 sm:w-full xl:w-1/2 md:w-full lg:w-full ${showPreview ? 'hidden' : 'block'} overflow-hidden`}>

        {/* Article Input Section */}
        <div className="flex-1 border-r border-gray-300 flex flex-col h-full overflow-hidden">

            {/* Podcast Post Content */}
            <div className="flex-1 p-5 overflow-auto space-y-6">

                {/* Drag and Drop Upload Box */}
                <h1 className="block text-sm font-medium text-gray-700">Podcast Audio File <span className="text-red-500">*</span></h1>
                <div className="border-2 border-dashed hover:border-secondary border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <Mic className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">Upload Audio File</p>
                        <p className="text-sm text-gray-400 mt-2">Supported formats: MP3, File Size Limit: 1GB</p>
                    </div>
                </div>

                {/* Drag and Drop Upload Box */}
                <h1 className="block text-sm font-medium text-gray-700">Podcast Audio Preview</h1>
                <div className="border-2 border-dashed hover:border-secondary border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <Mic className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">Upload Preview Audio File</p>
                        <p className="text-sm text-gray-400 mt-2">Supported formats: MP3, File Size Limit: 1GB</p>
                    </div>
                </div>

                {/* Drag and Drop Upload Box */}
                <h1 className="block text-sm font-medium text-gray-700">Podcast Video File <span className="text-red-500">*</span></h1>
                <div className="border-2 border-dashed hover:border-secondary border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <Video className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">Upload Video File</p>
                        <p className="text-sm text-gray-400 mt-2">Supported formats: MP4, File Size Limit: 3GB</p>
                    </div>
                </div>

                {/* Image Upload Box */}
                <h1 className="block text-sm font-medium text-gray-700">Podcast Image <span className="text-red-500">*</span></h1>
                <div className="border-2 border-dashed hover:border-secondary border-gray-300 rounded-lg p-8 text-center w-[50%] h-[50%]">
                    <div className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-8 w-[98%] h-[98%]">
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">Upload Episode Cover</p>
                        <p className="text-sm text-gray-400 mt-2">Supported formats: PNG, JPG, File Size Limit: 50MB</p>
                    </div>
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter podcast title"
                    />
                </div>

                {/* Description Text Field */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                    <textarea
                        id="description"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter podcast description"
                    />
                </div>

                {/* Season and Episode Numbers */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="season" className="block text-sm font-medium text-gray-700">Season Number <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            id="season"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Season #"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="episode" className="block text-sm font-medium text-gray-700">Episode Number <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            id="episode"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Episode #"
                        />
                    </div>
                </div>

                {/* Episode Type Radio Buttons */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Episode Type <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="episodeType" value="full" className="text-blue-500" />
                            <span>Full Episode</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="episodeType" value="trailer" className="text-blue-500" />
                            <span>Trailer</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="episodeType" value="bonus" className="text-blue-500" />
                            <span>Bonus</span>
                        </label>
                    </div>
                </div>

                {/* Explicit Content Checkbox */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">This episode includes explicit content</span>
                    </label>
                </div>

                <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="category"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter category"
                        />
                  </div>
                  <div className="space-y-2">
                        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="subcategory"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter subcategory"
                        />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Schedule</label>
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    id="scheduleDate"
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700">Time</label>
                                <input
                                    type="time"
                                    id="scheduleTime"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Footer Section */}
            <div className="p-5 border-t border-gray-300 flex justify-between items-center">

                {isMobile ? ( 

                <div className="flex gap-2">

                    {/* Style Dropdown */}
                    <DropdownMenu open={styleOpen} onOpenChange={setStyleOpen}>
                                <DropdownMenuTrigger className="p-1 rounded-md bg-background text-primary text-center w-40 flex items-center justify-center gap-1">
                                    Options
                                    <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${styleOpen ? 'rotate-180' : ''}`} />
                                </DropdownMenuTrigger>

                                {/* Style Dropdown Content */}
                                <DropdownMenuContent className="w-40 font-playfair-display">
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Info className="w-4 h-4 mr-2" />
                                            Post Info
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="w-40 font-playfair-display ml-5 p-3">
                                            <h3 className="text-base font-semibold mb-3 text-primary">Post Info</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-primary text-sm">Characters</span>
                                                    <span className="text-primary text-sm">0</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-primary text-sm">Words</span>
                                                    <span className="text-primary text-sm">0</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-primary text-sm">Sentences</span>
                                                    <span className="text-primary text-sm">0</span>
                                                </div>
                                                <div className="border-t border-primary my-2"></div>
                                                <div className="flex justify-between">
                                                    <span className="text-primary text-sm">Reading time</span>
                                                    <span className="text-primary text-sm">0 min</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-primary text-sm">Speaking time</span>
                                                    <span className="text-primary text-sm">0 min</span>
                                                </div>
                                            </div>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem>
                                        <FileStack className="w-4 h-4 mr-2" />
                                        Draft History
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Collaborator
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => setShowPreview(true)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                </div>

                ) : (

                <div className="flex gap-2">

                    {/* Post Info Tooltip */}
                    <TooltipProvider>
                        <Tooltip>

                            {/* Post Info Tooltip Button */}
                            <TooltipTrigger asChild>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-500/30 hover:bg-gray-500/50">
                                    <Info className="w-4 h-6" />
                                </button>
                            </TooltipTrigger>

                            {/* Post Info Tooltip Content */}
                            <TooltipContent className="h-full w-74 h-70 p-4 bg-background border border-secondary mb-7 ml-3 font-playfair-display">
                                <h3 className="text-2xl font-semibold mb-3 text-secondary">Post Info</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-secondary text-lg">Characters</span>
                                        <span className="text-secondary text-lg">0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-secondary text-lg">Words</span>
                                        <span className="text-secondary text-lg">0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-secondary text-lg">Sentences</span>
                                        <span className="text-secondary text-lg">0</span>
                                    </div>
                                    <div className="border-t border-secondary my-2"></div>
                                    <div className="flex justify-between">
                                        <span className="text-secondary text-lg">Reading time</span>
                                        <span className="text-secondary text-lg">0 min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-secondary text-lg">Speaking time</span>
                                        <span className="text-secondary text-lg">0 min</span>
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Settings Tooltip */}
                    <TooltipProvider>
                        <Tooltip>
                            {/* Settings Tooltip Button */}
                            <TooltipTrigger asChild>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-500/30 hover:bg-gray-500/50">
                                    <Settings className="w-4 h-6" />
                                </button>
                            </TooltipTrigger>
                            {/* Settings Tooltip Content */}
                            <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 font-playfair-display">
                                <p className="text-primary text-secondary text-center font-playfair-display">Settings</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Add Collaborator Tooltip */}
                    <TooltipProvider>
                            <Tooltip>
                                {/* Add Collaborator Tooltip Button */}
                                <TooltipTrigger asChild>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-500/30 hover:bg-gray-500/50">
                                        <UserRoundPlus className="w-4 h-6" />
                                    </button>
                                </TooltipTrigger>
                                {/* Add Collaborator Tooltip Content */}
                                <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 font-playfair-display">
                                    <p className="text-primary text-secondary text-center font-playfair-display">Add Collaborator</p>
                                </TooltipContent>
                            </Tooltip>
                    </TooltipProvider>

                    {/* Preview Tooltip */}
                    <TooltipProvider>
                            <Tooltip>
                                {/* Preview Tooltip Button */}
                                <TooltipTrigger asChild>
                                    <button 
                                        onClick={() => setShowPreview(true)}
                                        className="block lg:block md:block sm:block xl:hidden flex items-center gap-2 px-4 py-2 rounded-md bg-gray-500/30 hover:bg-gray-500/50"
                                    >
                                        <Eye className="w-4 h-6" />
                                    </button>
                                </TooltipTrigger>
                                {/* Preview Tooltip Content */}
                                <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 font-playfair-display">
                                    <p className="text-lg text-secondary text-center">Preview</p>
                                </TooltipContent>
                            </Tooltip>
                    </TooltipProvider>
                </div>

                )}


                {/* Send To Everyone Tooltip */}
                <TooltipProvider>
                    <Tooltip>
                        {/* Send To Everyone Tooltip Button */}
                        <TooltipTrigger asChild>
                            <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 font-playfair-display">
                                Send To Everyone
                            </button>
                        </TooltipTrigger>
                        {/* Send To Everyone Tooltip Content */}
                        <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 font-playfair-display">
                            <p className="text-secondary text-center">Publish and share with all subscribers</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    </div>

    {/*  Prototyping Container */}
    <div className={`${showPreview ? 'block' : 'hidden'} w-full xl:w-1/2 xl:flex xl:flex-col`}>
            {/* Prototyping Section */}
            <div className="h-full flex flex-col">

                {/* Main Content */}
                <div className="p-5">
                        <button 
                            onClick={() => setShowPreview(false)}
                            className="p-2 rounded-md hover:bg-gray-500/30 xl:hidden"
                        >
                            <PanelLeft className="w-4 h-4" />
                        </button>
                    <div className="flex justify-center items-center mb-1">
                        <h1 className="text-xl font-bold text-center">Articles Previews</h1>
                    </div>
                    <p className="text-gray-500 text-center text-sm text-balance">This is a preview of the Article, this helps you as a creator to see how your articles will look like to your consumers before publishing it.</p>
                </div>

                <Tabs defaultValue="mobile" className="flex-1 w-full h-full flex flex-col">
                    <TabsList className="w-[70%] mx-auto flex flex-row gap-3 justify-start mb-2 rounded-lg shadow-lg">
                        <TabsTrigger 
                            value="mobile" 
                            className="cursor-pointer py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50"
                        >
                            <div className="flex items-center justify-center gap-2 w-full h-full">
                                <Smartphone className="w-5 h-5" />
                                <span className="hidden md:block">Mobile</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="tablet" 
                            className="cursor-pointer py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Tablet className="w-5 h-5" />
                                <span className="hidden md:block">Tablet</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="desktop" 
                            className="cursor-pointer py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Monitor className="w-5 h-5" />
                                <span className="hidden md:block">Desktop</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="email" 
                            className="cursor-pointer py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Mail className="w-5 h-5" />
                                <span className="hidden md:block">Email</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="mobile" className=" flex-1 p-5 over">
                        
                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[500px] w-[250px]">
                            <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                            <div className="rounded-[2rem] overflow-hidden w-[222px] h-[472px] bg-white dark:bg-gray-800">
                                <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mockup-1-light.png" className="dark:hidden w-[222px] h-[472px]" alt="" />
                                <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mockup-1-dark.png" className="hidden dark:block w-[222px] h-[472px]" alt="" />
                            </div>
                        </div>

                    </TabsContent>
                    <TabsContent value="tablet" className="flex-1 p-5">
                        
                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[350px] max-w-[260px] md:h-[500px] md:max-w-[380px]">
                            <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                            <div className="rounded-[2rem] overflow-hidden h-[322px] md:h-[472px] bg-white dark:bg-gray-800">
                                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/tablet-mockup-image.png" className="dark:hidden h-[322px] md:h-[472px]" alt="" />
                                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/tablet-mockup-image-dark.png" className="hidden dark:block h-[322px] md:h-[472px]" alt="" />
                            </div>
                        </div>

                    </TabsContent>
                    <TabsContent value="desktop" className=" flex-1 p-5 ml-10">

                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                            <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
                                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen.png" className="dark:hidden h-[156px] md:h-[278px] w-full rounded-lg" alt="" />
                                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen-dark.png" className="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg" alt="" />
                            </div>
                        </div>
                        <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[557px]">
                            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
                        </div>

                    </TabsContent>
                    <TabsContent value="email" className=" flex-1 p-5">
                        
                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[16px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                            <div className="rounded-xl overflow-hidden h-[140px] md:h-[262px]">
                                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/screen-image-imac.png" className="dark:hidden h-[140px] md:h-[262px] w-full rounded-xl" alt="" />
                                <img src="https://flowbite.s3.amazonaws.com/docs/device-mockups/screen-image-imac-dark.png" className="hidden dark:block h-[140px] md:h-[262px] w-full rounded-xl" alt="" />
                            </div>
                        </div>
                        <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl h-[24px] max-w-[301px] md:h-[42px] md:max-w-[512px]"></div>
                        <div className="relative mx-auto bg-gray-800 rounded-b-xl h-[55px] max-w-[83px] md:h-[95px] md:max-w-[142px]"></div>
                        
                    </TabsContent>
                </Tabs>
            </div>   
        </div> 
    
    </main>
    );
  } 