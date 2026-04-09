"use client";

import {
  Image as ImageIcon,
  Mail,
  Maximize2,
  Mic,
  Minimize2,
  Monitor,
  PanelLeft,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MagazinePage() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPreview, setShowPreview] = useState(false);



  return (

    // Main Container
    <div className="flex h-screen ">

        {/* Write Prototyping */}
        <div className={`flex-1 w-1/2 sm:w-full xl:w-1/2 md:w-full lg:w-full ${showPreview ? 'hidden' : 'block'} overflow-hidden`}>

            {/* Writing Section */}
            <div className="flex-1 border-r border-gray-300 flex flex-col h-full overflow-hidden">
                
                {/* Article Input Section */}
                <div className="p-5 border-b border-gray-300 relative">
                    <button 
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100"
                    >
                        {isMinimized ? (
                            <Maximize2 className="w-4 h-4 text-gray-600" />
                        ) : (
                            <Minimize2 className="w-4 h-4 text-gray-600" />
                        )}
                    </button>
                    <div className={`flex flex-col md:flex-row gap-6 transition-all duration-300 ${isMinimized ? 'h-0 overflow-hidden' : ''}`}>
                        {/* Left side - Heading and Description */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-1">
                                    Article Heading
                                </label>
                                <input
                                    type="text"
                                    id="heading"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your article heading"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={1}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your article description"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <textarea
                                    id="description"
                                    rows={1}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search article category"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subcategories
                                </label>
                                <textarea
                                    id="description"
                                    rows={1}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search article subcategories"
                                />
                            </div>
                        </div>

                        {/* Right side - Image Upload */}
                        <div className="w-full md:w-1/3">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Article Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 hover:border-secondary rounded-md p-1.5 h-49 flex flex-col items-center justify-center mb-1">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image"
                                    className="cursor-pointer text-center"
                                >
                                    <div className="flex flex-col items-center">
                                        <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500">
                                            Click to upload image
                                        </span>
                                        <span className="text-[10px] text-gray-400 mt-0.5">
                                            PNG, JPG, GIF up to 10MB
                                        </span>
                                    </div>
                                </label>
                            </div>
                            <div>
                                <label htmlFor="audio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Article Audio
                                </label>
                                <div className="border-2 border-dashed border-gray-300 hover:border-secondary rounded-md p-1.5 flex flex-col items-center justify-center">
                                    <input
                                        type="file"
                                        id="audio"
                                        accept="audio/*"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="audio"
                                        className="cursor-pointer text-center w-full"
                                    >
                                        <div className="flex flex-col items-center">
                                            <Mic className="w-6 h-6 text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">
                                                Click to upload audio
                                            </span>
                                            <span className="text-[10px] text-gray-400 mt-0.5">
                                                MP3, WAV, OGG up to 50MB
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/*  Prototyping Container */}
        <div className={`${showPreview ? 'block' : 'hidden'} w-full xl:w-1/2 xl:flex xl:flex-col`}>
            {/* Prototyping Section */}
            <div className="h-full flex flex-col overflow-hidden">


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
                    <TabsList className="w-[70%] mx-auto flex flex-row gap-3 justify-start mb-2 rounded-lg bg-background shadow-lg bg-card">
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

                    <TabsContent value="mobile" className="flex-1 p-5 overflow-auto">
                        
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
    </div>
  );
}

