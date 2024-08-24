"use client";

import {
  Command,
  CommandList,
  CommandItem,
  CommandInput,
  CommandEmpty,
} from "@ui/command";
import { toast } from "sonner";
import { cn, fetch } from "@lib";
import { Category } from "@types";
import { Button } from "@ui/button";
import CreateCategory from "./create-category";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

type Props = {
  type: "income" | "expense";
  onChange: (value: string) => void;
};

export default function CategoryPicker({ type, onChange }: Props) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const categories = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch<Category[]>({
        input: "/api/category",
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
      }),
  });

  useEffect(() => onChange(value), [value, onChange]);

  const selectedCategory = categories.data?.find(
    (category) => category.name === value,
  );

  function onCreateCategorySucess(category: Category) {
    setValue(category.name!);
    setOpen((prev) => !prev);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          className="w-[200px] justify-between gap-2"
        >
          {selectedCategory ? (
            <>
              <span role="img">{selectedCategory.icon}</span>
              <span className="truncate">{selectedCategory.name}</span>
            </>
          ) : (
            "Select Category"
          )}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={(event) => event.preventDefault()}>
          <CommandInput placeholder="Search category..." />
          <CreateCategory
            type={type}
            onSuccess={useCallback(onCreateCategorySucess, [setValue, setOpen])}
          />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandList className="space-y-1 p-1">
            {categories.data?.map((category, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  setValue(category.name!);
                  setOpen((prev) => !prev);
                }}
              >
                <span role="img">{category.icon}</span>
                <span className="truncate">{category.name}</span>
                <Check
                  className={cn("mr-2 size-4 opacity-0", {
                    "opacity-100": value === category.name,
                  })}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
