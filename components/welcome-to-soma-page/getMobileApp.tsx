import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import useWindowSize from "@/hooks/useWindow";

interface GetMobileAppProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileAppDialog = DialogPrimitive.Root;
const MobileAppPortal = DialogPrimitive.Portal;
const MobileAppOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
MobileAppOverlay.displayName = DialogPrimitive.Overlay.displayName;

const MobileAppContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <MobileAppPortal>
        <MobileAppOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-50 w-[380px] h-[420px] translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </MobileAppPortal>
));
MobileAppContent.displayName = DialogPrimitive.Content.displayName;

export function GetMobileApp({ isOpen, onClose }: GetMobileAppProps) {
    const { width } = useWindowSize();

    const getContentSize = () => {
        if (width < 380) {
            return {
                dialogWidth: "300px",
                dialogHeight: "360px",
                qrSize: 130,
                imageWidth: 45,
                imageHeight: 30,
                textSize: "text-xs",
                headingSize: "text-base",
                gap: "gap-6"
            };
        } else if (width > 1700) {
            return {
                dialogWidth: "480px",
                dialogHeight: "520px",
                qrSize: 220,
                imageWidth: 80,
                imageHeight: 55,
                textSize: "text-sm",
                headingSize: "text-xl",
                gap: "gap-12"
            };
        }
        return {
            dialogWidth: "380px",
            dialogHeight: "420px",
            qrSize: 170,
            imageWidth: 60,
            imageHeight: 40,
            textSize: "text-xs",
            headingSize: "text-lg",
            gap: "gap-10"
        };
    };

    const sizes = getContentSize();

    return (
        <MobileAppDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <MobileAppContent className="bg-white" style={{ width: sizes.dialogWidth, height: sizes.dialogHeight }}>
                <div className="text-center">
                    <h2 className={`${sizes.headingSize} font-bold mb-2 font-playfair-display`}>Get the Soma Mobile App</h2>
                    <p className={`text-gray-600 mb-3 ${sizes.textSize} font-playfair-display`}>
                        Scan the QR code below to download our mobile app and stay connected on the go.
                    </p>

                    <div className="bg-white p-2 rounded-lg inline-block">
                        <QRCodeSVG
                            value="https://soma.app/download"
                            size={sizes.qrSize}
                            level="H"
                            includeMargin={true}
                            className="rounded-lg"
                        />
                    </div>

                    <p className={`${sizes.textSize} text-gray-600 font-playfair-display`}>
                        Available On iOS and Android, HarmonyOS (Click On the Icons Below)
                    </p>
                    <div className={`flex justify-center ${sizes.gap} mt-3`}>
                        <a href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store" className="font-playfair-display flex flex-col items-center text-xs">
                            <Image
                                src="/apple_store_icon.png"
                                alt="Download on the App Store"
                                width={sizes.imageWidth}
                                height={sizes.imageHeight}
                                className="rounded-md shadow hover:scale-105 transition-transform duration-150"
                            />
                            App Store
                        </a>
                        <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" aria-label="Download on Play Store" className="font-playfair-display flex flex-col items-center text-xs">
                            <Image
                                src="/google_play_icon.png"
                                alt="Get it on Google Play"
                                width={sizes.imageWidth}
                                height={sizes.imageHeight}
                                className="rounded-md shadow hover:scale-105 transition-transform duration-150"
                            />
                            Play Store
                        </a>
                        <a href="https://consumer.huawei.com/en/harmonyos/" target="_blank" rel="noopener noreferrer" aria-label="Download on HarmonyOS" className="font-playfair-display flex flex-col items-center text-xs">
                            <Image
                                src="/appgallery-icon2.png"
                                alt="Get it on AppGallery"
                                width={sizes.imageWidth}
                                height={sizes.imageHeight}
                                className="rounded-md shadow hover:scale-105 transition-transform duration-150"
                            />
                            AppGallery
                        </a>
                    </div>
                </div>
            </MobileAppContent>
        </MobileAppDialog>
    );
} 