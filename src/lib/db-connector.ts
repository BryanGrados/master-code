import { PrismaClient as AuthClient } from "@prisma/client";

const prismaClientSingleton = () => {
	return new AuthClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
	authDB: PrismaClientSingleton | undefined;
};

const authDB = globalForPrisma.authDB ?? prismaClientSingleton();

export default authDB;

if (process.env.NODE_ENV !== "production") globalForPrisma.authDB = authDB;
