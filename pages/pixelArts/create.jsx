import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import SiteNavigation from "../../components/SiteNavigation";
import Pixels from "../../components/Pixels";
import {useState} from "react";
import {createBlankArray} from "../../lib/utils";

export default function CreatePixel() {
    const {data: session, status} = useSession();
    const router = useRouter();

    const [pixelColors, setPixelColors] = useState(createBlankArray(16));

    if (status === "unauthenticated") {
        router.push("/api/auth/signin");
    }

    return !session?.user ? (
        <div>Loading...</div>
    ) : (
        <>
            <SiteNavigation user={session?.user ?? null} />
            <div className='h-screen'>

                <div className='flex flex-col items-center justify-around h-1/6'>
                    <h2 className="text-center text-7xl">Create a new drawing</h2>

                    <div className='flex'>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
                            onClick={async () => {
                                // save the matrix
                                const response = await fetch('/api/pixel/create', {
                                    method: 'POST',
                                    body: JSON.stringify({jsonGrid: JSON.stringify(pixelColors)}),
                                });
                                const data = await response.json();
                                if (!response.ok) {
                                    alert(data.error);
                                }
                                router.push("/pixelArts/" + data.id);
                            }}
                        >
                            Create
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
                            onClick={() => {
                                setPixelColors(createBlankArray(16))
                            }}
                        >
                            reset
                        </button>
                    </div>

                </div>

                <div className="flex flex-col max-h-screen items-center h-5/6">
                    <Pixels pixelColors={pixelColors} onPixelClick={(rowIndex, colIndex) => {
                        const newPixelColors = [...pixelColors]
                        newPixelColors[rowIndex][colIndex] = newPixelColors[rowIndex][colIndex] === 1 ? 0 : 1
                        setPixelColors(newPixelColors)
                    }}/>
                </div>
            </div>
        </>
    )
}

