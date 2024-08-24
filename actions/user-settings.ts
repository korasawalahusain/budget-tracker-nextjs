"use server";

import { prisma } from "@lib";
import { Prisma } from "@prisma/client";
import { Response, UserSettings } from "@types";
import { currentUser } from "@clerk/nextjs/server";

type UpdateUserSettingsInput = Partial<Prisma.UserSettingUpdateArgs>;
type UpdateUserSettingsOutput = Response<UserSettings>;

export async function updateUserSettings({
  data,
  where,
  select,
}: UpdateUserSettingsInput): Promise<UpdateUserSettingsOutput> {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        errors: [
          {
            title: "User not found!",
            description: "Please login to continue!",
          },
        ],
      };
    }

    const updatedUser = await prisma.userSetting.update({
      select,
      data: {
        ...(data || {}),
      },
      where: {
        ...where,
        userId: user.id,
      },
    });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          title: "Error",
          description: "Something went wrong!",
        },
      ],
    };
  }
}
