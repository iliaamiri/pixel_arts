import {prisma} from "../../../../prisma";

export default async function handler(req, res) {
    const userId = req.query.userId;

    const pixelArts = await prisma.pixel.findMany({
        where: {
            userId: userId,
        }
    });

    console.log(pixelArts);

    res.status(200).json(pixelArts ?? []);
}
