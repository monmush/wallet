"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Download, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleCreateWallet = () => {
    const passcode = localStorage.getItem("passcode");
    if (passcode) {
      router.push("/create-new-wallet");
    } else {
      router.push("/passcode");
    }
  };

  const handleBackupWallet = () => {
    router.push("/backup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Image
            src="/path-to-your-illustration.svg"
            alt="Wallet Illustration"
            width={200}
            height={200}
          />
        </div>

        <h1 className="text-2xl font-bold text-center">
          Explore the limitless possibilities of the web with our community
        </h1>

        <Card className="">
          <CardBody>
            <Button
              startContent={<Plus size={20} />}
              className="w-full mb-4"
              onClick={handleCreateWallet}
            >
              Create a new wallet
            </Button>
            <p className="text-xs text-gray-400 mb-1 ml-1">
              Secret phrase or Swift wallet
            </p>
          </CardBody>
        </Card>

        <Card className="">
          <CardBody>
            <Button
              onClick={handleBackupWallet}
              startContent={<Download size={20} />}
              className="w-full mb-4"
            >
              Add existing wallet
            </Button>
            <p className="text-xs text-gray-400 mb-1 ml-1">
              Import, restore or view-only
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
