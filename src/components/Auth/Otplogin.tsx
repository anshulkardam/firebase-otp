"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FormEvent, useEffect, useState, useTransition } from "react";

const Otplogin = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }

        return () => clearTimeout(timer);
    }, [resendCountdown]);

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
        });
        setRecaptchaVerifier(recaptchaVerifier);

        return () => recaptchaVerifier.clear();
    }, [auth]);

    const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        setResendCountdown(60);
        startTransition(async () => {
            setError("");
            if (!recaptchaVerifier) {
                return setError("reCAPTCHA error");
            }
            try {
                // Ensure phone number includes the country code
                const formattedPhoneNumber = `+91${phoneNumber}`;
                console.log(auth);
                
                const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
                setConfirmationResult(confirmationResult);
                setSuccess("OTP sent successfully!");
            } catch (error: any) {
                console.log(error);
                if (error.code === "auth/invalid-phone-number") {
                    setError("Invalid phone number. Please check your number.");
                } else if (error.code === "auth/too-many-requests") {
                    setError("Too many requests. Please try again later.");
                } else {
                    setError("Failed to send OTP. Please try again.");
                }
            }
        });
    };

    return (
        <div>
            {!confirmationResult ? (
                <form onSubmit={requestOtp}>
                    <Input
                        className="text-black"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                    />
                    <p>Enter your number</p>
                </form>
            ) : (
                <div>
                    <p>OTP sent successfully. Please check your phone.</p>
                    <Input
                        className="text-black"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                    />
                    <Button
                        onClick={() => {
                            if (confirmationResult) {
                                confirmationResult.confirm(otp).then((result) => {
                                    setSuccess("User signed in successfully.");
                                    console.log(result.user);
                                }).catch((err) => {
                                    setError("Failed to verify OTP.");
                                });
                            }
                        }}
                    >
                        Verify OTP
                    </Button>
                </div>
            )}
            <Button
                disabled={!phoneNumber || isPending || resendCountdown > 0}
                onClick={() => requestOtp()}
                className="mt-5"
            >
                ENTER
            </Button>
            <div>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </div>
            <div id="recaptcha-container" />
        </div>
    );
};

export default Otplogin;
