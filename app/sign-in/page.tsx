"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "./actions";

// Define the schema for form validation
const schema = z.object({
  passcode: z.string().length(6, "Passcode must be 6 digits"),
});

type FormValues = z.infer<typeof schema>;

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  // Get saved passcode from local storage
  const encryptedPasscode = localStorage.getItem("passcode") ?? "";

  // Redirect user to create passcode if no passcode is found
  if (!encryptedPasscode) {
    router.push("/passcode");
  }

  const onSubmit = async (data: { passcode: string }) => {
    if (!isValid) {
      setError(
        errors.passcode?.message || "Please fill in the passcode correctly."
      );
      return;
    }

    try {
      const result = await signIn(data.passcode, encryptedPasscode);

      console.log("result", result);

      if (result.success) {
        router.push("/wallet");
      } else {
        setError(result.error || "Incorrect passcode. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 mx-auto">
      <Card className="shadow-lg max-w-4xl p-8">
        <CardBody>
          <h1 className="text-2xl font-bold mb-8">Enter passcode</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8">
              <p className="text-sm text-gray-400 mb-2">Enter your passcode:</p>
              <Controller
                name="passcode"
                control={control}
                render={({ field }) => (
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>

            {errors.passcode && (
              <p className="text-red-600 mb-4">{errors.passcode.message}</p>
            )}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <p className="text-sm text-gray-400 mb-8 text-center">
              Enter the 6-digit passcode you created to access your wallet.
            </p>

            <Button
              type="submit"
              className="w-full mt-4 text-white"
              disabled={!isValid}
            >
              Access Wallet
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
