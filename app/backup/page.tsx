"use client";

import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { createWalletFromMnemonic } from "../actions";

const schema = z.object({
  walletName: z.string().min(1, "Wallet name is required"),
  secretPhrase: z
    .string()
    .min(1, "Secret phrase is required")
    .refine(
      (phrase) => {
        const words = phrase.trim().split(/\s+/);
        return [12, 18, 24].includes(words.length);
      },
      {
        message:
          "Secret phrase must be 12, 18, or 24 words separated by single spaces",
      }
    ),
});

type FormData = z.infer<typeof schema>;

export default function BackupWallet() {
  const router = useRouter();
  // Add this line to use the wallet hook
  const { saveWallet } = useWallet();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      walletName: "Main Wallet",
      secretPhrase: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Create a new wallet from the mnemonic
      const newWallet = await createWalletFromMnemonic(data.secretPhrase);

      // Add the new wallet to the useWallet hook
      saveWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        publicKey: newWallet.publicKey,
        balance: 0, // TODO: Fetch balance from the network
      });

      // Show success message
      toast({
        title: "Wallet restored successfully!",
      });

      // Redirect to the wallet page or dashboard
      router.push("/wallet");
    } catch (error) {
      console.error("Error restoring wallet:", error);
      toast({
        title: "Failed to restore wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  console.log("errors", errors);

  return (
    <div className="flex flex-col min-h-screen text-white p-4">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="text-gray-400">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Backup wallet</h1>
          <button
            onClick={() => router.push("/skip-backup")}
            className="text-green-500 invisible"
          >
            SKIP
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-2xl"
          >
            <div>
              <Controller
                name="walletName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Wallet name"
                    variant="bordered"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => field.onChange("")}
                      >
                        <X size={18} />
                      </button>
                    }
                    isInvalid={!!errors.walletName}
                    errorMessage={errors.walletName?.message}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="secretPhrase"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Secret phrase"
                    variant="bordered"
                    placeholder="Enter your secret phrase"
                    minRows={3}
                    errorMessage={errors.secretPhrase?.message}
                    isInvalid={!!errors.secretPhrase}
                  />
                )}
              />
              <p className="text-sm text-gray-400 mt-2">
                Typically 12 (sometimes 18, 24) words separated by single spaces
              </p>
            </div>

            <Button color="primary" className="w-full" type="submit">
              Restore wallet
            </Button>
          </form>

          <div
            className="mt-8 bg-yellow-100 bg-opacity-10 border border-yellow-600 text-yellow-600 rounded-lg p-4 w-full max-w-2xl"
            role="alert"
          >
            <div className="flex items-center mb-2">
              <Info size={24} className="mr-2" />
              <span className="font-bold">Important Note</span>
            </div>
            <p className="text-sm">
              Never share your secret phrase with anyone. This phrase is the key
              to your wallet and sharing it could result in the loss of your
              assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
