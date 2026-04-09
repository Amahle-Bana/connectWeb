import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"


// OTP Form
export function OTPForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    // OTP Form Container
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">OTP</CardTitle>
          <CardDescription>
            Enter the OTP sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* OTP Form */}
          <form>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <div className="flex justify-center">
                  {/* OTP Form Input */}
                    <InputOTP maxLength={6}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
              </div>

              {/* OTP Form Submit Button */}
              <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/70 cursor-pointer">
                Verify OTP
              </Button>

              {/* OTP Form Resend OTP Link */}
              <div className="text-center text-sm">
                Haven&apos;t Receive An OTP?{" "}
                <Link href="/login/resetpassword" className="underline underline-offset-4">
                  Resend The Password
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* OTP Form Terms and Privacy Link */}
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
