"use client";

import {
  Command,
  CommandList,
  CommandItem,
  CommandInput,
  CommandEmpty,
  CommandGroup,
} from "@ui/command";
import { toast } from "sonner";
import { Button } from "@ui/button";
import { UserSettings } from "@types";
import { useMediaQuery } from "@hooks";
import { updateUserSettings } from "@actions";
import SkeletonWrapper from "./skeleton-wrapper";
import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Currencies, Currency, CurrencyKey, fetch } from "@lib";
import { Drawer, DrawerContent, DrawerTrigger } from "@ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

export default function CurrencyComboBox() {
  const [open, setOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const userSettings = useQuery({
    queryKey: ["get_userSettings"],
    queryFn: () =>
      fetch<UserSettings>({
        input: "/api/user-settings",
        init: {
          cache: "no-store",
        },
        onError(errors) {
          errors.forEach((error) =>
            toast.error(error.title, {
              description: error.description,
            }),
          );
        },
        onSuccess(data) {
          setSelectedCurrency(Currencies[data.currency as CurrencyKey] || null);
        },
      }),
  });

  const updateUserSettingsMutation = useMutation({
    mutationKey: ["update_userSettings"],
    mutationFn: updateUserSettings,
    onSuccess(data) {
      if (data.success) {
        toast.success("Currency updated successfully 🎉", {
          id: "update-currency",
        });

        userSettings.refetch();
      } else {
        if (data.errors?.length) {
          data.errors.forEach((error) =>
            toast.error(error.title, {
              description: error.description,
            }),
          );
        }
      }
    },
  });

  const setValue = useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }

      toast.loading("Updating Currency...", {
        id: "update-currency",
      });

      updateUserSettingsMutation.mutate({
        data: {
          currency: currency.value,
        },
      });
    },
    [updateUserSettingsMutation],
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isLoading}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={updateUserSettingsMutation.isPending}
            >
              {selectedCurrency ? (
                <>{selectedCurrency.label}</>
              ) : (
                <>Set currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <StatusList setOpen={setOpen} setSelectedCurrency={setValue} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={updateUserSettingsMutation.isPending}
          >
            {selectedCurrency ? (
              <>{selectedCurrency.label}</>
            ) : (
              <>Set currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StatusList setOpen={setOpen} setSelectedCurrency={setValue} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function StatusList({
  setOpen,
  setSelectedCurrency,
}: {
  setOpen: (open: boolean) => void;
  setSelectedCurrency: (currency: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Object.values(Currencies).map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedCurrency(Currencies[value as CurrencyKey] || null);
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
