"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/aurora-background";
import React from "react";


export default function BoxLanding() {

    return (
        <AuroraBackground>
            <motion.div
                className="font-comfortaa relative flex flex-col gap-4 items-center justify-center px-4"
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
            >
                {/* Logo and App Name */}
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col items-center mb-8"
                >
                    {/* Logo image instead of SVG */}
                    <img
                        src="/icons8-box-800.png"
                        alt="CampusPoll logo"
                        className="w-40 h-40 object-contain"
                    />
                    <p className="mt-2 text-lg text-gray-700 font-medium text-center max-w-xl">
                        Your voice. Your campus. <span className="text-black font-bold">Vote</span> for change, events, and leadership. Empower your university community with <span className="text-black font-bold">Box</span>
                    </p>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="flex flex-col items-center"
                >
                    <Link href="/authentication">
                        <button className="bg-black cursor-pointer hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition-all duration-200">
                            Get Started
                        </button>
                    </Link>
                    <p className="mt-4 text-gray-500 text-sm text-center max-w-md">
                        Join thousands of students making their voices heard. Secure, transparent, and easy campus voting.
                    </p>
                </motion.div>
            </motion.div>
        </AuroraBackground>
    );
}
