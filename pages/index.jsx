import {useEffect, useState} from 'react'

import Pixels from '../components/Pixels'
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import SiteNavigation from "../components/SiteNavigation";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    const {data: session} = useSession();
    const router = useRouter();

    const [users, setUsers] = useState(null);
    const [pixelArts, setPixelArts] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await fetch('/api/users/all');
            const data = await response.json();
            if (!response.ok) {
                alert(data.error);
            }
            setUsers(data);

            const resopnse2 = await fetch('/api/pixel');
            const data2 = await resopnse2.json();
            if (!resopnse2.ok) {
                alert(data2.error);
            }
            setPixelArts(data2);
        })()
    }, []);

    return (
        <>
            <SiteNavigation user={session?.user ?? null}/>
            <div className='h-screen'>

                <div className='flex flex-col items-center justify-around h-1/6 m-10'>
                    <h2 className="text-center text-7xl pb-10 pt-10">Welcome</h2>

                    <Link href='/pixelArts/create'
                          className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>Create</Link>

                    <div className={"mt-5 flex flex-col gap-2"}>
                        <h2 className="text-center text-5xl">Contributors</h2>
                        <div className={"flex flex-row items-center gap-2 flex-wrap max-w-md"}>
                            {!users ? (
                                <div>Loading...</div>
                            ) : users?.map(user => (
                                <Link key={user.id} href={"/profile/" + user.id}>
                                    <div key={user.id} className={"flex flex-row items-center"}>
                                        <Image src={user.image} height={100} width={100} className={"w-10 h-10 rounded-full"}/>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={'w-full h-5/6 mt-40'}>
                    <h2 className={'text-center text-5xl'}>Pixels</h2>
                    {!pixelArts ? (
                      <div>Loading...</div>
                    ) : pixelArts.map(pixelArt => (
                      <div key={pixelArt.id} className="flex mt-7 flex-col items-center h-5/6 gap-4">
                          <div>
                              <h2 className="text-center text-4xl">Pixel Art #{pixelArt.id}</h2>
                              <div className={"flex items-center gap-3"}>
                                  <p>Creator: {pixelArt.user.name}</p>
                                  <Image src={pixelArt.user.image} height={100} width={100} className={"w-10 h-10 rounded-full"} alt={pixelArt.user.name}/>
                              </div>
                          </div>
                          <div className={'flex flex-col items-center h-5/6'}>
                              <Pixels pixelColors={JSON.parse(pixelArt.pixels)} />
                          </div>
                      </div>
                    ))}
                </div>
            </div>
        </>
    )
}

