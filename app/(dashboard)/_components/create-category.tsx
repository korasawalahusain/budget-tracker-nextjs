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
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@ui/dialog";
import { cn } from "@lib";
import { toast } from "sonner";
import { Input } from "@ui/input";
import { Category } from "@types";
import { Button } from "@ui/button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { createCategory } from "@actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import { createCategorySchema, CreateCategoryType } from "@schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

type Props = {
  type: "income" | "expense";
  onSuccess: (category: Category) => void;
};

export default function CreateCategory({ type, onSuccess }: Props) {
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CreateCategoryType>({
    defaultValues: {
      type,
    },
    resolver: zodResolver(createCategorySchema),
  });

  const createCategoryMutation = useMutation({
    mutationKey: ["create_category"],
    mutationFn: createCategory,
    onSuccess: async (data) => {
      if (data.success) {
        form.reset({ icon: "", name: "", type });
        toast.success(`Category ${data.data.name} created successfully 🎉`, {
          id: "create-category",
        });

        await queryClient.invalidateQueries({ queryKey: ["categories"] });
        onSuccess(data.data);
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
            id: "create-category",
          });
        }
      }
    },
  });

  function onSubmit(values: CreateCategoryType) {
    toast.loading(`Creating category...`, {
      id: "create-category",
    });
    createCategoryMutation.mutate({ data: values });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground"
        >
          <PlusSquare className="mr-2 h-4 w-4" /> Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={cn("m-1", {
                "text-red-500": type === "expense",
                "text-emerald-500": type === "income",
              })}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="icon"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[100px] w-full">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="size-[48px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Picker
                          data={data}
                          theme={resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) =>
                            field.onChange(emoji.native)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            disabled={createCategoryMutation.isPending}
          >
            {!createCategoryMutation.isPending ? (
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
