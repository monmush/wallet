"use client";

import { useWallet } from "@/hooks/useWallet";
import { Button } from "@nextui-org/button";
import { Copy, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateSecretPhrase } from "../actions";

export default function WalletCreation() {
  const [secretPhrase, setSecretPhrase] = useState<string[]>([]);
  const { saveWallet } = useWallet();
  const router = useRouter();

  useEffect(() => {
    async function fetchSecretPhrase() {
      const { secretPhases, publicKey, privateKey, address } =
        await generateSecretPhrase();
      saveWallet({ publicKey, privateKey, address });
      setSecretPhrase(secretPhases);
    }

    fetchSecretPhrase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    const phraseString = secretPhrase.join(" ");
    navigator.clipboard.writeText(phraseString);
    // You might want to add a toast notification here
  };

  const handleContinue = () => {
    // Navigate to the next step
    router.push("/wallet");
  };

  return (
    <div className="flex flex-col min-h-screen text-white p-4">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="text-gray-400">
            ← Back
          </button>
          <h1 className="text-xl font-bold">Secret Phrase</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-center">
            Your Secret Recovery Phrase
          </h2>

          <p className="text-sm text-gray-400 mb-8 text-center">
            Write down or copy these words in the correct order and store them
            somewhere safe.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
            {secretPhrase.map((word, index) => (
              <div
                key={index}
                className="bg-content1 p-3 rounded-md flex items-center"
              >
                <span className="text-gray-500 mr-2">{index + 1}.</span>
                <span>{word}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleCopy}
            className="mb-4 w-full max-w-md"
            startContent={<Copy size={18} />}
          >
            Copy to Clipboard
          </Button>

          <Button onClick={handleContinue} className="w-full max-w-md">
            Continue
          </Button>

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
