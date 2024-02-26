// prisma-extend.d.ts

import { Prisma } from "@prisma/client";

declare module "@prisma/client" {
  interface UserCreateInput {
    cognitoSub?: string;
  }
}
