import {prisma} from "../../../prisma";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth].js";
import {getUserByEmail} from "../../../lib/user.service";
import {getPixelById} from "../../../lib/pixel.service";

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        res.status(400).send({
            error: "You must be signed in to view the protected content on this page.",
        })
    }
    const user = await getUserByEmail(session.user.email);

    const body = JSON.parse(req.body);

    const { jsonGrid, pixelId } = body;
    if (!jsonGrid || !pixelId) {
        res.status(400).json({ error: 'No json given' });
        return;
    }

    const pixelArt = await getPixelById((typeof pixelId === 'string') ? parseInt(pixelId) : pixelId);
    if (!pixelArt) {
        res.status(404).send({
            error: "Pixel art not found",
        });
        return;
    }


    if (pixelArt.userId !== user.id) {
        res.status(403).send({
            error: "You can only edit your own pixel art",
        });
        return;
    }

    await prisma.pixel.update({
        where: {
            id: pixelArt.id,
        },
        data: {
            pixels: jsonGrid,
        },
    })

    res.status(200).json(JSON.stringify(body))
}
