"use server";

import { prisma } from "@lib";
import { Prisma } from "@prisma/client";
import { Response, Transaction } from "@types";
import { currentUser } from "@clerk/nextjs/server";
import { createTransactionSchema, CreateTransactionType } from "@schemas";

type CreateTransactionInput = {
  data: CreateTransactionType;
  select?: Prisma.TransactionSelect;
};
type CreateTransactionOutput = Response<Transaction>;

export async function createTransaction({
  data,
  select,
}: CreateTransactionInput): Promise<CreateTransactionOutput> {
  try {
    const parsedData = createTransactionSchema.safeParse(data);
    if (!parsedData.success) {
      const errors = parsedData.error.flatten();
      return {
        success: false,
        validationErrors: Object.keys(errors).map((error) => ({
          field: error,
          description:
            errors.fieldErrors[error as keyof typeof errors.fieldErrors]?.join(
              ", \n",
            ),
        })),
      };
    }

    const { type, amount, category, date } = parsedData.data;

    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        errors: [
          {
            title: "User not found",
            description: "Please login to continue",
          },
        ],
      };
    }

    const categoryRow = await prisma.category.findFirst({
      where: {
        name: category,
        userId: user.id,
      },
    });

    if (!categoryRow) {
      return {
        success: false,
        errors: [
          {
            title: "Category not found",
            description:
              "Please enter a category you have created or create a new one",
          },
        ],
      };
    }

    const [createdTransaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          ...parsedData.data,
          userId: user.id,
          categoryIcon: categoryRow.icon,
        },
        select,
      }),
      prisma.monthHistory.upsert({
        where: {
          day_month_year_userId: {
            userId: user.id,
            day: date.getUTCDate(),
            month: date.getUTCMonth(),
            year: date.getUTCFullYear(),
          },
        },
        create: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          income: type === "income" ? amount : 0,
          expense: type === "expense" ? amount : 0,
        },
        update: {
          income: {
            increment: type === "income" ? amount : 0,
          },
          expense: {
            increment: type === "expense" ? amount : 0,
          },
        },
      }),
      prisma.yearHistory.upsert({
        where: {
          month_year_userId: {
            userId: user.id,
            month: date.getUTCMonth(),
            year: date.getUTCFullYear(),
          },
        },
        create: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
          income: type === "income" ? amount : 0,
          expense: type === "expense" ? amount : 0,
        },
        update: {
          income: {
            increment: type === "income" ? amount : 0,
          },
          expense: {
            increment: type === "expense" ? amount : 0,
          },
        },
      }),
    ]);

    return {
      success: true,
      data: createdTransaction,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          title: "Error",
          description: "Something went wrong, please try again",
        },
      ],
    };
  }
}
