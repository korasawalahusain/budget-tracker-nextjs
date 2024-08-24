"use server";

import { prisma } from "@lib";
import { Prisma } from "@prisma/client";
import { Response, Category } from "@types";
import { currentUser } from "@clerk/nextjs/server";
import { createCategorySchema, CreateCategoryType } from "@schemas";

type CreateCategoryInput = {
  data: CreateCategoryType;
  select?: Prisma.CategorySelect;
};
type CreateCategoryOutput = Response<Category>;

export async function createCategory({
  data,
  select,
}: CreateCategoryInput): Promise<CreateCategoryOutput> {
  try {
    const parsedData = createCategorySchema.safeParse(data);
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

    const createdCategory = await prisma.category.create({
      data: {
        ...data,
        userId: user.id,
      },
      select,
    });

    return {
      success: true,
      data: createdCategory,
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
