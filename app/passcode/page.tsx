"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { encrypt } from "@/utils/encryption";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CreatePasscode() {
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const mode = useSearchParams().get("mode");

  const handleSubmit = () => {
    if (passcode !== confirmPasscode) {
      setError("Passcodes do not match");
      return;
    }
    if (passcode.length === 6) {
      const encryptedData = encrypt(passcode);
      localStorage.setItem("passcode", encryptedData);
      if (mode === "create") {
        router.push("/wallet-creation");
      } else if (mode === "backup") {
        router.push("/backup");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 mx-auto ">
      <Card className="shadow-lg max-w-4xl p-8">
        <CardBody>
          <h1 className="text-2xl font-bold mb-8">Create passcode</h1>

          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2">Enter your passcode:</p>
            <InputOTP maxLength={6} value={passcode} onChange={setPasscode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2">Confirm your passcode:</p>
            <InputOTP
              maxLength={6}
              value={confirmPasscode}
              onChange={setConfirmPasscode}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <p className="text-sm text-gray-400 mb-8 text-center">
            Be sure to remember your passcode. You&apos;ll need it to unlock
            your wallet.
          </p>

          <Button
            onClick={handleSubmit}
            className="w-full mt-4 text-white"
            disabled={passcode.length !== 6 || confirmPasscode.length !== 6}
          >
            Continue
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
