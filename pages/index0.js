import {useEffect, useState} from 'react'

import Pixels from '../components/Pixels'
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import SiteNavigation from "../components/SiteNavigation";


function createBlankArray(number = 16) {
    return Array(number).fill(0).map(a => (Array(number).fill(0)))
}

export default function Home() {
    const {data: session} = useSession();
    const router = useRouter();


    const [pixelColors, setPixelColors] = useState(createBlankArray(16))



    return (
        <>
            <SiteNavigation user={session?.user ?? null} />
            <div className='h-screen'>

                <div className='flex flex-col items-center justify-around h-1/6'>
                    <h2 className="text-center text-7xl">Create a new drawing</h2>

                    <div className='flex'>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
                            onClick={async () => {
                                if (!session?.user) {
                                    await router.push("/api/auth/signin")
                                    return;
                                }

                                // save the matrix
                                try {
                                    const response = await fetch('/api/pixel/save', {
                                        method: 'POST',
                                        body: JSON.stringify({jsonGrid: JSON.stringify(pixelColors)}),
                                    });
                                    console.log(response);
                                    const data = await response.json();
                                    if (!response.ok) {
                                        alert(data.error);
                                        return;
                                    }



                                    // setPixelColors(data);
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        >
                            {session?.user ? 'Save' : 'Sign in to save'}
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

