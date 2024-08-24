"use client";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "@ui/form";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
} from "@ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";
import { cn, dateToUTCDate } from "@lib";
import { useForm } from "react-hook-form";
import { createTransaction } from "@actions";
import CategoryPicker from "./category-picker";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarHeartIcon, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import React, { PropsWithChildren, useCallback, useState } from "react";
import { createTransactionSchema, CreateTransactionType } from "@schemas";

type Props = {
  type: "income" | "expense";
};

export default function CreateTransaction({
  type,
  children,
}: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionType>({
    defaultValues: {
      type,
      date: new Date(),
    },
    resolver: zodResolver(createTransactionSchema),
  });

  const createTransactionMutation = useMutation({
    mutationKey: ["create_transaction"],
    mutationFn: createTransaction,
    onSuccess: async (data) => {
      if (data.success) {
        form.reset({ type, date: new Date() });
        toast.success(`Transaction created successfully 🎉`, {
          id: "create-transaction",
        });

        setOpen((prev) => !prev);
      } else {
        if (data.validationErrors?.length) {
          data.validationErrors.forEach((error) =>
            form.setError(error.field as any, {
              message: error.description,
            }),
          );
        } else if (data.errors?.length) {
          data.errors.forEach((error) =>
            toast.error(error.title, {
              description: error.description,
            }),
          );
        } else {
          toast.error(`Something went wrong`, {
            id: "create-transaction",
          });
        }
      }
    },
  });

  function onSubmit(values: CreateTransactionType) {
    toast.loading(`Creating transaction...`, {
      id: "create-transaction",
    });
    createTransactionMutation.mutate({
      data: {
        ...values,
        date: dateToUTCDate(values.date),
      },
    });
  }

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn("m-1", {
                "text-red-500": type === "expense",
                "text-emerald-500": type === "income",
              })}
            >
              {type}
            </span>{" "}
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (required)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2">
              <FormField
                name="category"
                control={form.control}
                render={() => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              {
                                "text-muted-foreground": !field.value,
                              },
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarHeartIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            initialFocus
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              if (!value) return;
                              field.onChange(value);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      Select a date for this transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={createTransactionMutation.isPending}
          >
            {!createTransactionMutation.isPending ? (
              "Create"
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
