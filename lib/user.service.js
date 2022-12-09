import {prisma} from "../prisma";

export async function getUserByEmail(email) {
    return prisma.user.findFirst({
        where: {
            email: email,
        },
    });
}

export async function getUserById(id) {
    return prisma.user.findUnique({
        where: {
            id: id,
        },
    });
}