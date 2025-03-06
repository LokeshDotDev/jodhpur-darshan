import { PrismaClient } from "@prisma/client";

const prismaClientSignleton = () => {
	return new PrismaClient();
};

type prismaClientSignleton = ReturnType<typeof prismaClientSignleton>;

const globalforPrisma = global as unknown as {
	prisma: prismaClientSignleton | undefined;
};

const prisma = globalforPrisma.prisma ?? prismaClientSignleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
	globalforPrisma.prisma = prisma;
}
