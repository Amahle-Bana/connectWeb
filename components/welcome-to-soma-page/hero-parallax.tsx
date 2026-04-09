"use client";

import React from "react";
import {motion, useScroll, useTransform, useSpring, MotionValue} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd, ChevronDown, X, Copyright } from "lucide-react";
import { useState } from "react";
import { GetMobileApp } from "./getMobileApp";
import { InfiniteMovingCards } from "@/components/welcome-to-soma-page/infinite-moving-cards";
import { FlipWords } from "./flip-words";
import useWindowSize from "@/hooks/useWindow";

const testimonials = [
    {
        quote: "Soma has transformed how I manage my daily tasks. The mobile app is incredibly intuitive and keeps me organized wherever I go.",
        name: "Sarah Johnson",
        title: "Marketing Director"
    },
    {
        quote: "The seamless sync between my desktop and mobile app is a game-changer. I can pick up right where I left off, no matter which device I'm using.",
        name: "Michael Chen",
        title: "Software Engineer"
    },
    {
        quote: "As a busy entrepreneur, Soma helps me stay on top of everything. The mobile notifications are perfectly timed and never overwhelming.",
        name: "Emma Rodriguez",
        title: "Startup Founder"
    },
    {
        quote: "The offline capabilities of the Soma app are impressive. I can work productively even during my commute without internet access.",
        name: "David Thompson",
        title: "Business Consultant"
    },
    {
        quote: "I love how Soma integrates with my calendar and email. It's like having a personal assistant in my pocket.",
        name: "Lisa Patel",
        title: "Project Manager"
    },
    {
        quote: "The mobile app's interface is so clean and user-friendly. It's made task management feel effortless.",
        name: "James Wilson",
        title: "Digital Artist"
    }
];

const words = ["Faster", "Easier", "Better"];

// Hero Parallax Component
export const HeroParallax = ({
    products,
}: {
    products: {
        title: string;
        link: string;
        thumbnail: string;
    }[];
}) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Spring Config
    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    // Translate X
    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 1000]),
        springConfig
    );

    // Translate X Reverse
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1000]),
        springConfig
    );

    // Rotate X
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );

    // Opacity
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
        springConfig
    );

    // Rotate Z
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        springConfig
    );

    // Translate Y
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
        springConfig
    );

    const { width } = useWindowSize();



    return (
        <div
            ref={ref}
            className={` py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-[rgb(2,8,23)] font-playfair-display
                 ${
                    width <= 380 ? 'h-[520vh]' :
                    width <= 450 ? 'h-[340vh]' :
                    width <= 700 ? 'h-[400vh]' :
                    width <= 1024 ? 'h-[600vh]' :
                    width <= 1700 ? 'h-[600vh]' :
                    width <= 2304 ? 'h-[380vh]' :
                    'h-[400vh]'
                    }
                `}
        >
            <Header />
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className="mt-100"
            >
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
                    {firstRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row  mb-20 space-x-20 ">
                    {secondRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateXReverse}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
                    {thirdRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const Header = () => {
    // Router
    const router = useRouter();

    // Mobile Menu State
    const [MobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Dropdown States
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    // Desktop Navigation States
    const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);
    // Get Mobile App State
    const [showMobileAppModal, setShowMobileAppModal] = useState(false);
    // Get Started State

    // Dropdown Toggle
    const toggleDropdown = (dropdownName: string) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };
    // Desktop Dropdown Toggle
    const toggleDesktopDropdown = (dropdownName: string) => {
        setDesktopDropdown(desktopDropdown === dropdownName ? null : dropdownName);
    };

    // useWindowSize
    const { width } = useWindowSize();

    return (
        // Entire Landing Page
        <div className="bg-[rgb(2,8,23)] min-h-svh flex-1 flex-col">
            {/* Mobile Sidebar Overlay */}
            {MobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden bg-[rgb(2,8,23)]"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-[rgb(2,8,23)] shadow-lg transform transition-transform duration-300 ease-in-out z-200 lg:hidden ${MobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Mobile Sidebar Header */}
                <div className="p-4 bg-[rgb(2,8,23)]">
                    <div className="flex items-center justify-between bg-[rgb(2,8,23)]">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 hover:bg-muted rounded-md"
                        >
                            <X className="size-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Mobile Sidebar Content */}
                <div className="p-4 bg-[rgb(2,8,23)]">
                    <div className="space-y-4 bg-[rgb(2,8,23)]">
                        {/* Resources Tab Option*/}
                        <div>
                            <button
                                onClick={() => toggleDropdown("resources")}
                                className="flex items-center justify-between w-full text-sm font-bold text-white"
                            >
                                Resources
                                <ChevronDown
                                    className={`size-4 transition-transform duration-200 text-white ${openDropdown === "resources" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {openDropdown === "resources" && (
                                <div className="mt-2 pl-4 space-y-2">
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        How To Get Started With Soma
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        How To Get Monetized
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Help Center
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Discover Tab Option*/}
                        <div>
                            <button
                                onClick={() => toggleDropdown("discover")}
                                className="flex items-center justify-between w-full text-sm font-bold text-white"
                            >
                                Discover
                                <ChevronDown
                                    className={`size-4 transition-transform duration-200 text-white ${openDropdown === "discover" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {openDropdown === "discover" && (
                                <div className="mt-2 pl-4 space-y-2">
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Top Writers
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Featured
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Topics
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Creators Tab Option*/}
                        <div>
                            <button
                                onClick={() => toggleDropdown("creators")}
                                className="flex items-center justify-between w-full text-sm font-bold text-white"
                            >
                                Creators
                                <ChevronDown
                                    className={`size-4 transition-transform duration-200 text-white ${openDropdown === "creators" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {openDropdown === "creators" && (
                                <div className="mt-2 pl-4 space-y-2">
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Switch To Soma
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Import E-mail List
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Monetization Path
                                    </a>
                                </div>
                            )}
                        </div>


                        {/* Company Tab Option*/}
                        <div>
                            <button
                                onClick={() => toggleDropdown("company")}
                                className="flex items-center justify-between w-full text-sm font-bold text-white"
                            >
                                Company
                                <ChevronDown
                                    className={`size-4 transition-transform duration-200 text-white ${openDropdown === "company" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {openDropdown === "company" && (
                                <div className="mt-2 pl-4 space-y-2">
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Help
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        About
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Jobs
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Blogging Policies
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Contact
                                    </a>
                                </div>
                            )}
                        </div>


                        {/* Explore Tab Option*/}
                        <div>
                            <button
                                onClick={() => toggleDropdown("explore")}
                                className="flex items-center justify-between w-full text-sm font-bold text-white"
                            >
                                Explore
                                <ChevronDown
                                    className={`size-4 transition-transform duration-200 text-white ${openDropdown === "explore" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {openDropdown === "explore" && (
                                <div className="mt-2 pl-4 space-y-2">
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Substack Web
                                    </a>
                                    <a
                                        href="#"
                                        className="block py-2 text-sm text-white hover:text-white/80"
                                    >
                                        Substack Mobile App
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                

                {/* Mobile Sidebar Content (Empty Space) */}
                <div className="flex-1 h-full p-4 bg-[rgb(2,8,23)]"></div>
            </div>

            {/* Top Header Section */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[rgb(2,8,23)]">
                {/* Company Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                </div>

                {/* Top Header Navigation Bar */}
                <nav className="hidden lg:flex items-center gap-12">
                    {/* Resources Dropdown */}
                    <div className="relative group">
                        <motion.button
                            onClick={() => toggleDesktopDropdown("resources")}
                            className="flex items-center gap-1 text-sm font-bold text-white transition-colors cursor-pointer font-playfair-display"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Resources
                            <ChevronDown
                                className={`size-4 transition-transform duration-200 text-white ${desktopDropdown === "resources"
                                    ? "rotate-180"
                                    : "group-hover:rotate-180"
                                    }`}
                            />
                        </motion.button>

                        {/* Resources Dropdown Options */}
                        <div
                            className={`absolute top-full left-0 mt-2 w-64 bg-[rgb(2,8,23)] rounded-md shadow-lg transition-all duration-200 z-50 cursor-pointer font-playfair-display ${desktopDropdown === "resources"
                                ? "opacity-100 visible"
                                : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                                }`}
                        >
                            <div className="py-2">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    How To Get Started With Soma
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    How To Get Monetized
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Help Center
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Discover Dropdown */}
                    <div className="relative group">
                        <motion.button
                            onClick={() => toggleDesktopDropdown("discover")}
                            className="flex items-center gap-1 text-sm font-bold text-white transition-colors cursor-pointer font-playfair-display"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Discover
                            <ChevronDown
                                className={`size-4 transition-transform duration-200 text-white ${desktopDropdown === "discover"
                                    ? "rotate-180"
                                    : "group-hover:rotate-180"
                                    }`}
                            />
                        </motion.button>

                        {/* Discover Dropdown Options */}
                        <div
                            className={`absolute top-full left-0 mt-2 w-48 bg-[rgb(2,8,23)] rounded-md shadow-lg transition-all duration-200 z-50 cursor-pointer font-playfair-display ${desktopDropdown === "discover"
                                ? "opacity-100 visible"
                                : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                                }`}
                        >
                            <div className="py-2">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Top Writers
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Top Magazines
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Top Podcasts
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Featured
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Topics
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Creators Dropdown */}
                    <div className="relative group">
                        <motion.button
                            onClick={() => toggleDesktopDropdown("creators")}
                            className="flex items-center gap-1 text-sm font-bold text-white transition-colors cursor-pointer font-playfair-display"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Creators
                            <ChevronDown
                                className={`size-4 transition-transform duration-200 text-white ${desktopDropdown === "creators"
                                    ? "rotate-180"
                                    : "group-hover:rotate-180"
                                    }`}
                            />
                        </motion.button>

                        {/* Creators Dropdown Options */}
                        <div
                            className={`absolute top-full left-0 mt-2 w-48 bg-[rgb(2,8,23)] rounded-md shadow-lg transition-all duration-200 z-50 cursor-pointer font-playfair-display ${desktopDropdown === "creators"
                                ? "opacity-100 visible"
                                : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                                }`}
                        >
                            <div className="py-2">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Switch To Soma
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Import E-mail List
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Monetization Path
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Company Dropdown */}
                    <div className="relative group">
                        <motion.button
                            onClick={() => toggleDesktopDropdown("company")}
                            className="flex items-center gap-1 text-sm font-bold text-white transition-colors cursor-pointer font-playfair-display"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Company
                            <ChevronDown
                                className={`size-4 transition-transform duration-200 text-white ${desktopDropdown === "company"
                                    ? "rotate-180"
                                    : "group-hover:rotate-180"
                                    }`}
                            />
                        </motion.button>

                        {/* Company Dropdown Options */}
                        <div
                            className={`absolute top-full left-0 mt-2 w-48 bg-[rgb(2,8,23)] rounded-md shadow-lg transition-all duration-200 z-50 font-playfair-display ${desktopDropdown === "company"
                                ? "opacity-100 visible"
                                : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                                }`}
                        >
                            <div className="py-2">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Help
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    About
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Jobs
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Blogging Policies
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Explore Dropdown */}
                    <div className="relative group">
                        <motion.button
                            onClick={() => toggleDesktopDropdown("explore")}
                            className="flex items-center gap-1 text-sm font-bold text-white transition-colors cursor-pointer font-playfair-display"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Explore
                            <ChevronDown
                                className={`size-4 transition-transform duration-200 text-white ${desktopDropdown === "explore"
                                    ? "rotate-180"
                                    : "group-hover:rotate-180"
                                    }`}
                            />
                        </motion.button>

                        {/* Explore Dropdown Options */}
                        <div
                            className={`absolute top-full left-0 mt-2 w-48 bg-[rgb(2,8,23)] rounded-md shadow-lg transition-all duration-200 z-50 cursor-pointer font-playfair-display ${desktopDropdown === "explore"
                                ? "opacity-100 visible"
                                : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                                }`}
                        >
                            <div className="py-2">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Substack Web
                                </a>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Substack Mobile App
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Start Writing Button and Sign In Link */}
                <div className="flex items-center gap-4">
                    {width > 500 && (
                        <motion.button
                            onClick={() => router.push("/authentication/signup")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-sm bg-secondary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity cursor-pointer font-playfair-display"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Start Writing
                        </motion.button>
                    )}

                    <motion.a
                        onClick={() => router.push("/authentication")}
                        className="text-sm text-white hover:text-white/80 transition-colors cursor-pointer font-playfair-display"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Login
                    </motion.a>

                    {/* Mobile Menu (Open Sidebar) Button */}
                    <motion.button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-2 hover:bg-muted rounded-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-6"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </motion.button>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="flex-1 flex flex-col items-center justify-start gap-4 px-6 pb-24">

                {/* Company Slogan */}
                <motion.p
                    className="flex flex-col justify-center items-center gap-2 text-white text-center font-playfair-display"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={`${
                        width <= 380 ? 'text-lg' :
                        width <= 450 ? 'text-2xl' :
                        width <= 700 ? 'text-4xl' :
                        width <= 1024 ? 'text-5xl' :
                        width <= 1700 ? 'text-6xl' :
                        width <= 2300 ? 'text-6xl' :
                        'text-6xl'
                    }`}>Write, Record, And Publish Ideas</h1>
                    <div className="flex flex-row justify-center align-center ">
                        <FlipWords words={words} />
                        <img src="/sparkles2.png" alt="Sparkles" className="w-10 h-10" />
                    </div>
                </motion.p>

                <div className="flex flex-row justify-center items-center gap-4">
                    {/* Get Started Button */}
                    <motion.button
                        onClick={() => router.push("/authentication/signup")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`z-100 mt-8 bg-secondary text-secondary-foreground px-6 py-3 rounded-4xl font-medium hover:opacity-90 transition-opacity cursor-pointer font-playfair-display
                            ${
                                width <= 380 ? 'text-xs' :
                                width <= 450 ? 'text-md' :
                                width <= 700 ? 'text-lg' :
                                width <= 1024 ? 'text-2xl' :
                                width <= 1700 ? 'text-2xl' :
                                width <= 2300 ? 'text-2xl' :
                                'text-2xl'
                            }
                            `}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        
                    >
                        Get Started
                    </motion.button>

                    {/* Get Mobile App Button */}
                    <motion.button
                        onClick={() => setShowMobileAppModal(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`z-100 mt-8 bg-secondary text-secondary-foreground px-6 py-3 rounded-4xl font-medium hover:opacity-90 transition-opacity cursor-pointer font-playfair-display
                            ${
                                width <= 380 ? 'text-xs' :
                                width <= 450 ? 'text-md' :
                                width <= 700 ? 'text-lg' :
                                width <= 1024 ? 'text-2xl' :
                                width <= 1700 ? 'text-2xl' :
                                width <= 2300 ? 'text-2xl' :
                                'text-2xl'
                            }
                            `}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Get Mobile App
                    </motion.button>
                </div>

                {/* Company Slogan */}
                <motion.p
                    className="flex flex-col justify-center items-center gap-2 text-white text-center font-playfair-display"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={`z-10 flex justify-center items-center w-[95vw] max-w-[95vw] border border-red-500
                        ${
                            width <= 380 ? 'h-50' :
                            width <= 450 ? 'h-60' :
                            width <= 700 ? 'h-70' :
                            width <= 1024 ? 'h-110' :
                            width <= 1700 ? 'h-150' :
                            width <= 2300 ? 'h-220' :
                            'h-220'
                        }
                    `}>

                    </div>
                </motion.p>

                {/* Mobile App Modal */}
                <GetMobileApp 
                    isOpen={showMobileAppModal} 
                    onClose={() => setShowMobileAppModal(false)} 
                />

                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                    className="w-full"
                />

                {/* Feature Cards Grid */}
                <div className="w-full mt-12 flex flex-col justify-center items-center px-[5vw] gap-4">

                    {/* Articles Card */}
                    <motion.div
                        className="bg-[rgb(2,8,23)] gap-4 border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center w-[95vw] h-full"
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex-1 w-full flex flex-col justify-content align-center">
                            <div className="flex flex-row justify-center items-center gap-2">
                                <h3 className={`font-playfair-display text-white mb-2 self-center
                                    ${
                                        width <= 380 ? 'text-sm' :
                                        width <= 450 ? 'text-lg' :
                                        width <= 700 ? 'text-3xl' :
                                        width <= 1024 ? 'text-4xl' :
                                        width <= 1700 ? 'text-5xl' :
                                        width <= 2300 ? 'text-5xl' :
                                        'text-5xl'
                                    }
                                    `}>AI Powered Blog & Newsletter Writing</h3>
                                <img src="/sparkles.png" alt="Writing" className="w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                            <p className={`text-white/70 mb-6 font-playfair-display px-2 sm:px-4 md:px-6 w-[80%] self-center
                                ${
                                    width <= 380 ? 'text-xs' :
                                    width <= 450 ? 'text-sm' :
                                    width <= 700 ? 'text-md' :
                                    width <= 1024 ? 'text-xl' :
                                    width <= 1700 ? 'text-xl' :
                                    width <= 2300 ? 'text-xl' :
                                    'text-xl'
                                }
                                `}>
                                Write Quicker, Soma AI Helps Predict Your Next Word/Sentence, Writing Your Content Using Your Instructions With A Single Prompt,
                                 Generate Texts, Images, Videos, Newsletter Covers etc, With Keyword Tooling, Text Humanization, etc. 
                            </p>


                            <div className={`z-10 flex justify-center items-center w-full border border-red-500
                                ${
                                    width <= 380 ? 'h-40' :
                                    width <= 450 ? 'h-50' :
                                    width <= 700 ? 'h-70' :
                                    width <= 1024 ? 'h-110' :
                                    width <= 1700 ? 'h-150' :
                                    width <= 2300 ? 'h-220' :
                                    'h-220'
                                }
                                `}>


                            </div>
                        </div>
                        <motion.button
                            onClick={() => router.push("/authentication/signup/")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`bg-secondary text-secondary-foreground p-2 px-6 rounded-4xl font-medium hover:opacity-90 transition-opacity mt-auto cursor-pointer
                                ${
                                    width <= 380 ? 'text-md' :
                                    width <= 450 ? 'text-md' :
                                    width <= 700 ? 'text-lg' :
                                    width <= 1024 ? 'text-2xl' :
                                    width <= 1700 ? 'text-2xl' :
                                    width <= 2300 ? 'text-2xl' :
                                    'text-2xl'
                                }
                                `}
                        >
                            Start Writing
                        </motion.button>
                    </motion.div>

                    {/* Articles Card */}
                    <motion.div
                        className="bg-[rgb(2,8,23)] gap-4 border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center w-[95vw] h-full"
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex-1 w-full flex flex-col justify-content align-center">
                            <div className="flex flex-row justify-center items-center gap-2">
                                <h3 className={`font-playfair-display text-white mb-2 self-center
                                    ${
                                        width <= 380 ? 'text-lg' :
                                        width <= 450 ? 'text-2xl' :
                                        width <= 700 ? 'text-4xl' :
                                        width <= 1024 ? 'text-5xl' :
                                        width <= 1700 ? 'text-6xl' :
                                        width <= 2300 ? 'text-6xl' :
                                        'text-6xl'
                                    }
                                    `}>AI Powered Podcasting</h3>
                                <img src="/sparkles.png" alt="Writing" className="w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                            <p className={`text-white/70 mb-6 font-playfair-display px-2 sm:px-4 md:px-6 w-[80%] self-center
                                ${
                                    width <= 380 ? 'text-xs' :
                                    width <= 450 ? 'text-sm' :
                                    width <= 700 ? 'text-md' :
                                    width <= 1024 ? 'text-xl' :
                                    width <= 1700 ? 'text-xl' :
                                    width <= 2300 ? 'text-xl' :
                                    'text-xl'
                                }
                                `}>
                                Create Podcasts Quicker, Record Better, Generate Heading & Descriptions With Keyword Tooling, Automated Timestamps, Generate Videos And Audio All through Your Own Custom Prompts.
                            </p>
                            <div className={`z-10 flex justify-center items-center w-full border border-red-500
                                ${
                                    width <= 380 ? 'h-40' :
                                    width <= 450 ? 'h-50' :
                                    width <= 700 ? 'h-70' :
                                    width <= 1024 ? 'h-110' :
                                    width <= 1700 ? 'h-150' :
                                    width <= 2300 ? 'h-220' :
                                    'h-220'
                                }
                                `}>


                            </div>
                        </div>
                        <motion.button
                            onClick={() => router.push("/authentication/signup/")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`bg-secondary text-secondary-foreground p-2 px-6 rounded-4xl font-medium hover:opacity-90 transition-opacity mt-auto cursor-pointer
                                ${
                                    width <= 380 ? 'text-md' :
                                    width <= 450 ? 'text-md' :
                                    width <= 700 ? 'text-lg' :
                                    width <= 1024 ? 'text-2xl' :
                                    width <= 1700 ? 'text-2xl' :
                                    width <= 2300 ? 'text-2xl' :
                                    'text-2xl'
                                }
                                `}
                        >
                            Start Podcasting
                        </motion.button>
                    </motion.div>
                </div>

                {/* Join the Soma Community Section */}
                <div className="mt-10 flex flex-col items-center justify-center">
                    {/* Join the Soma Community Title */}
                    <div className="flex flex-col align-center justify-center text-white text-2xl font-bold text-center mb-5">
                        <h2>Join the Soma Community</h2>
                        <div className="flex flex-row justify-center items-center"><Copyright /> <span>Made By Sahara.lab</span></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        title: string;
        link: string;
        thumbnail: string;
    };
    translate: MotionValue<number>;
}) => {
    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -20,
            }}
            key={product.title}
            className="group/product h-96 w-[30rem] relative shrink-0"
        >
            <Link
                href={product.link}
                className="block group-hover/product:shadow-2xl"
            >
                <Image
                    src={product.thumbnail}
                    height="600"
                    width="600"
                    className="object-cover object-left-top absolute h-full w-full inset-0 cursor-pointer rounded-3xl"
                    alt={product.title}
                />
            </Link>
            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
            <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
                {product.title}
            </h2>
        </motion.div>
    );
};
