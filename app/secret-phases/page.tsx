"use client";

import { Button } from "@nextui-org/button";
import * as bip39 from "bip39";
import { Copy, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecretPhrases() {
  const [secretPhrase, setSecretPhrase] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const mnemonic = bip39.generateMnemonic();
    const words = mnemonic.split(" ");
    setSecretPhrase(words);
  }, []);

  const handleCopy = () => {
    const phraseString = secretPhrase.join(" ");
    navigator.clipboard.writeText(phraseString);
    // You might want to add a toast notification here
  };

  const handleContinue = () => {
    // Navigate to the next step
    router.push("/confirm-secret-phrase");
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

          <div className="mt-8 max-w-2xl mx-auto">
            <div
              className="bg-yellow-100 bg-opacity-10 rounded-lg text-yellow-600 border-l-4 p-4 max-w-4xl"
              role="alert"
            >
              <div className="flex items-center">
                <Info size={24} className="mr-2" />
                <span>Important Note</span>
              </div>
              <p className="text-sm">
                Never share your secret phrase with anyone. This phrase is the
                key to your wallet and sharing it could result in the loss of
                your assets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
