import {prisma} from "../prisma";

export async function getPixelById(pixelId) {
    return prisma.pixel.findUnique({
        where: {
            id: pixelId,
        },
        include: {
            user: true,
        }
    });
}

export async function getAllPixels() {
    return prisma.pixel.findMany({
        include: {
            user: true,
        }
    });
}
