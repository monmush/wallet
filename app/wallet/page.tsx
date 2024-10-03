"use client";

import { useCryptoData } from "@/hooks/userCryptoData";
import { useWallet } from "@/hooks/useWallet";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Clock,
  CopyIcon,
  Landmark,
  ShoppingCart,
} from "lucide-react";

function CryptoList() {
  const { cryptoData, isLoading, error } = useCryptoData();

  if (isLoading) {
    return <Spinner className="mx-auto mt-8" />;
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h4 className="font-bold">Error</h4>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cryptoData.map((crypto) => (
        <div key={crypto.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <p className="font-semibold">{crypto.symbol}</p>
              <p className="text-sm text-gray-500">{crypto.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${crypto.price.toFixed(2)}</p>
            <p
              className={`text-sm ${
                crypto.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {crypto.change.toFixed(2)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Wallet() {
  const { wallet } = useWallet();

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <h3 className="text-xl font-bold">Main Wallet</h3>
            </CardHeader>
            <CardBody>
              <h2 className="text-4xl font-bold">
                ${wallet?.balance?.toFixed(2) ?? 0}
              </h2>
              <div className="flex items-center mt-1">
                <p className="text-sm text-gray-500">{wallet?.address}</p>
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    navigator.clipboard.writeText(wallet?.address ?? "")
                  }
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between gap-4 md:gap-8 lg:gap-12 mt-4 md:mt-8 lg:mt-12">
                <Button className="flex h-auto py-4 px-4">
                  <ArrowDown className="h-6 w-6 mb-2" />
                  <span>Send</span>
                </Button>
                <Button className="flex h-auto py-4 px-4">
                  <ArrowUp className="h-6 w-6 mb-2" />
                  <span>Receive</span>
                </Button>
                <Button className="flex h-auto py-4 px-4">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  <span>Buy</span>
                </Button>
                <Button className="flex h-auto py-4 px-4">
                  <Landmark className="h-6 w-6 mb-2" />
                  <span>Sell</span>
                </Button>
                <Button className="flex h-auto py-4 px-4">
                  <Clock className="h-6 w-6 mb-2" />
                  <span>History</span>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <h3 className="text-xl font-bold">Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                {["Send", "Receive", "Buy", "Sell"].map((action) => (
                  <Button key={action} className="flex-col h-auto py-4">
                    <ArrowUpDown className="h-6 w-6 mb-2" />
                    <span>{action}</span>
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardBody>
          <Tabs>
            <Tab key="crypto" title="Crypto">
              <CryptoList />
            </Tab>
            <Tab key="nfts" title="NFTs">
              <p>NFT content goes here</p>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
