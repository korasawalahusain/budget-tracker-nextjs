import React from "react";
import { Button } from "@ui/button";
import { currentUser } from "@clerk/nextjs/server";
import CreateTransaction from "./_components/create-transaction";

type Props = {};

async function getUserSettings() {
  const route = await import("../api/user-settings/route");
  const response = await route.GET();
  return await response.json();
}

export default async function Page({}: Props) {
  const user = await currentUser();
  const userSettings = await getUserSettings();

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">Hello, {user?.firstName}! 👋</p>

          <div className="flex items-center gap-3">
            <CreateTransaction type="income">
              <Button
                variant="outline"
                className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
              >
                New Income 🤑
              </Button>
            </CreateTransaction>
            <CreateTransaction type="expense">
              <Button
                variant="outline"
                className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
              >
                New Expense 😤
              </Button>
            </CreateTransaction>
          </div>
        </div>
      </div>
    </div>
  );
}
