import {prisma} from "../../../../prisma";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "../../auth/[...nextauth]";

export default async function handler(req, res) {
    const { pixelId } = req.query;

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        res.status(400).send({
            error: "You must be signed in to view the protected content on this page.",
        })
    }

    const pixelArt = await prisma.pixel.findUnique({
        where: {
            id: pixelId,
        }
    });

    if (!pixelArt) {
        res.status(404).send({
            error: "Pixel art not found",
        });
        return;
    }

    res.status(200).json({ name: 'John Doe' })
}
