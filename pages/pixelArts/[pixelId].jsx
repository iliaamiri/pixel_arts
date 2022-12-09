import {useRouter} from "next/router";
import {unstable_getServerSession} from "next-auth";
import Pixels from "../../components/Pixels";
import SiteNavigation from "../../components/SiteNavigation";
import {useState} from "react";
import {authOptions} from "../api/auth/[...nextauth]";
import {getUserByEmail} from "../../lib/user.service";
import {getPixelById} from "../../lib/pixel.service";
import {createBlankArray} from "../../lib/utils";
import Image from "next/image";

export default function ViewPixelArt({user, pixelArt, isOwner}) {
    const router = useRouter();

    const [pixelColors, setPixelColors] = useState(JSON.parse(pixelArt.pixels))

    const handleSaveOrReset = async (isReset) => {
        if (!user) {
            await router.push("/api/auth/signin")
            return;
        }

        let newPixels = pixelColors;
        if (isReset) {
            newPixels = createBlankArray(16);
            setPixelColors(newPixels)
        }

        const response = await fetch('/api/pixel/save', {
            method: 'POST',
            body: JSON.stringify({
                jsonGrid: JSON.stringify(newPixels),
                pixelId: pixelArt.id
            }),
        });
        // console.log(response);
        const data = await response.json();
        if (!response.ok) {
            alert(data.error);
            return;
        }

    }

    return (
        <>
            <SiteNavigation user={user}/>
            <div className='h-screen'>

                <div className='flex flex-col items-center justify-around h-1/6'>
                    <h2 className="text-center text-7xl">Pixel Art #{pixelArt.id}</h2>
                    <div className={"flex"}>
                        <p>Creator: {pixelArt.user.name}</p>
                        <Image src={pixelArt.user.image} height={100} width={100} className={"w-10 h-10 rounded-full"}/>
                    </div>

                    <div className='flex'>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
                            onClick={async () => {
                                // save the matrix
                                await handleSaveOrReset(false);
                            }}
                        >
                            {user ? 'Save' : 'Sign in'}
                        </button>
                        {(user && isOwner) &&
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
                                onClick={async () => {
                                    await handleSaveOrReset(true);
                                }}
                            >
                                reset
                            </button>}
                    </div>

                </div>

                <div className="flex mt-10 flex-col max-h-screen items-center h-5/6">
                    <Pixels pixelColors={pixelColors} onPixelClick={(rowIndex, colIndex) => {
                        const newPixelColors = [...pixelColors]
                        newPixelColors[rowIndex][colIndex] = newPixelColors[rowIndex][colIndex] === 1 ? 0 : 1
                        setPixelColors(newPixelColors)
                    }}/>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const {pixelId} = context.query;
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    const pixelArt = await getPixelById(parseInt(pixelId));
    if (!pixelArt) {
        return {
            notFound: true,
        }
    }

    let isOwner = false;
    if (session?.user) {
        const user = await getUserByEmail(session.user.email);
        isOwner = user.id === pixelArt.userId;
    }

    // console.log(session)

    return {
        props: {
            user: session?.user ?? null,
            pixelArt: JSON.parse(JSON.stringify(pixelArt)),
            isOwner,
        },
    }
}