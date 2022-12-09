import {prisma} from "../../../prisma";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth].js";

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        res.status(400).send({
            error: "You must be signed in to view the protected content on this page.",
        })
    }
    const user = session.user;

    console.log(session);

    const body = JSON.parse(req.body);

    const jsonGrid = body.jsonGrid;
    if (!jsonGrid) {
        res.status(400).json({ error: 'No json given' });
        return;
    }

    console.log(jsonGrid);

    const createdPixel = await prisma.pixel.create({
        data: {
            pixels: jsonGrid,
            user: {
                connect: {
                    email: user.email,
                }
            }
        },
    })

    res.status(200).json(createdPixel)
}
