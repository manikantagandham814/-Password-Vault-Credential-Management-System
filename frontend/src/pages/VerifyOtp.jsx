import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/auth/auth.css";

function VerifyOtp() {

    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [timeLeft, setTimeLeft] = useState(60);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);


    // =====================================================
    // OTP TIMER
    // =====================================================

    useEffect(() => {

        if (timeLeft <= 0) {
            return;
        }

        const interval = setInterval(() => {

            setTimeLeft((previous) => previous - 1);

        }, 1000);

        return () => clearInterval(interval);

    }, [timeLeft]);


    // =====================================================
    // VERIFY OTP
    // =====================================================

    async function handleVerify(e) {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8082/api/verify-otp",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        otp: otp
                    })
                }
            );


            if (
                response.status === 401
            ) {

                navigate("/login");

                return;
            }


            if (response.ok) {

                setSuccess(
                    "OTP verified successfully"
                );

                setTimeout(() => {

                    navigate("/reset-password");

                }, 700);

            } else {

                if (
                    response.status === 400 ||
                    response.status === 401 ||
                    response.status === 410
                ) {

                    setError(
                        "Invalid or expired OTP"
                    );

                } else {

                    setError(
                        "Unable to verify OTP. Please try again."
                    );

                }

            }

        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );


            if (
                error instanceof TypeError
            ) {

                setError(
                    "Unable to connect to server. Please check your connection and try again."
                );

            } else {

                setError(
                    "Unable to verify OTP. Please try again."
                );

            }

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // RESEND OTP
    // =====================================================

    async function handleResend() {

        setError("");
        setSuccess("");
        setResending(true);

        try {

            const response = await fetch(
                "http://localhost:8082/api/resend-otp",
                {
                    method: "POST",

                    credentials: "include"
                }
            );


            if (
                response.status === 401
            ) {

                navigate("/login");

                return;
            }


            if (response.ok) {

                setTimeLeft(60);

                setOtp("");

                setSuccess(
                    "New OTP sent successfully"
                );

            } else {

                if (
                    response.status === 400 ||
                    response.status === 410
                ) {

                    setError(
                        "Unable to resend OTP. Please request a new OTP again."
                    );

                } else {

                    setError(
                        "Unable to resend OTP. Please try again."
                    );

                }

            }

        } catch (error) {

            console.error(
                "Resend OTP error:",
                error
            );


            if (
                error instanceof TypeError
            ) {

                setError(
                    "Unable to connect to server. Please check your connection and try again."
                );

            } else {

                setError(
                    "Unable to resend OTP. Please try again."
                );

            }

        } finally {

            setResending(false);
        }
    }


    // =====================================================
    // TIMER DISPLAY
    // =====================================================

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="auth-page">

            <div className="auth-container">

                <h2>
                    Verify OTP
                </h2>


                <p>
                    Enter the OTP sent to your email.
                </p>


                {/* Error */}

                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {/* Success */}

                {success && (

                    <p className="success">
                        {success}
                    </p>

                )}


                <form onSubmit={handleVerify}>

                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value)
                        }
                        disabled={
                            timeLeft <= 0 ||
                            loading ||
                            resending
                        }
                        required
                        inputMode="numeric"
                        autoComplete="one-time-code"
                    />


                    {/* Timer */}

                    <p className="timer-text">

                        OTP expires in{" "}

                        <span id="timer">

                            {timeLeft > 0
                                ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
                                : "Expired"
                            }

                        </span>

                    </p>


                    {/* Buttons */}

                    <div className="button-group">

                        <button
                            id="verifyBtn"
                            type="submit"
                            disabled={
                                timeLeft <= 0 ||
                                loading ||
                                resending
                            }
                        >

                            {loading
                                ? "Verifying..."
                                : "Verify OTP"
                            }

                        </button>


                        {timeLeft <= 0 && (

                            <button
                                id="resendBtn"
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                            >

                                {resending
                                    ? "Sending..."
                                    : "Resend OTP"
                                }

                            </button>

                        )}

                    </div>

                </form>

            </div>

        </div>
    );
}

export default VerifyOtp;