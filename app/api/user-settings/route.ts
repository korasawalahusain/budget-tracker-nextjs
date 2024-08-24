import { prisma } from "@lib";
import { NextResponse } from "next/server";
import { Response, UserSettings } from "@types";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    let userSettings = await prisma.userSetting.findUnique({
      where: {
        userId: user!.id,
      },
    });

    if (!userSettings) {
      userSettings = await prisma.userSetting.create({
        data: {
          userId: user!.id,
          currency: "IND",
        },
      });
    }

    return NextResponse.json<Response<UserSettings>>(
      {
        success: true,
        data: userSettings,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json<Response<UserSettings>>(
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
