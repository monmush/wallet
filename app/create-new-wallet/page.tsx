"use client";

import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateNewWallet() {
  const [checkedItems, setCheckedItems] = useState(new Set<string>([]));
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("encryptedPasscode")) {
      router.push("/create-passcode");
    }
  }, [router]);

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    if (checkedItems.size !== 3) {
      setShowErrorMessage(true);
    } else {
      // Here you would typically create the wallet
      console.log("Creating wallet...");
      // Then redirect to the next page in your flow
      router.push("/secret-phases");
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white p-4">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="text-gray-400">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Create new wallet</h1>
          <button
            onClick={() => router.push("/skip-backup")}
            className="text-green-500 invisible"
          >
            SKIP
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center">
          <Image
            src="/path-to-your-illustration.svg"
            alt="Backup Illustration"
            width={200}
            height={200}
          />

          <h2 className="text-2xl font-bold mt-8 mb-4 text-center">
            This secret phrase is the master key to your wallet
          </h2>

          <p className="text-sm text-gray-400 mb-8 text-center">
            Tap on all checkboxes to confirm you understand the importance of
            your secret phrase
          </p>

          <div className="max-w-xl">
            {[
              "Your secret phrase is not stored by us.",
              "Avoid saving your secret phrase digitally in plain text. This includes taking screenshots, saving to text files, or sending it to yourself via email.",
              "Record your secret phrase and keep it in a secure, offline location.",
            ].map((text, index) => (
              <Checkbox
                key={index}
                isSelected={checkedItems.has(index.toString())}
                onValueChange={() => handleCheckboxChange(index.toString())}
                className="mb-4"
              >
                {text}
              </Checkbox>
            ))}

            {showErrorMessage && (
              <p className="text-red-500 text-sm text-center">
                Please select all three options
              </p>
            )}

            <Button
              onClick={handleContinue}
              className="w-full mt-4"
              disabled={checkedItems.size !== 3}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
