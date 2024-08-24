import { z } from "zod";
import { prisma } from "@lib";
import { Response, Category } from "@types";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const typeValidator = z.enum(["income", "expense"]).nullable();
    const validType = typeValidator.safeParse(type);

    if (!validType.success) {
      return NextResponse.json<Response<Category[]>>(
        {
          success: false,
          errors: [
            {
              title: "Error",
              description: validType.error.message,
            },
          ],
        },
        {
          status: 400,
        },
      );
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: user!.id,
        ...(validType.data && { type: validType.data }),
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json<Response<Category[]>>(
      {
        success: true,
        data: categories,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json<Response<Category[]>>(
      {
        success: false,
        errors: [
          {
            title: "Error",
            description: "Something went wrong, please try again!",
          },
        ],
      },
      {
        status: 500,
      },
    );
  }
}
