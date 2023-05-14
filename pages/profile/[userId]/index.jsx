import {useEffect, useState} from 'react'

import {useRouter} from "next/router";
import SiteNavigation from "../../../components/SiteNavigation";
import Image from "next/image";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {getUserById} from "../../../lib/user.service";

export default function OtherProfiles({user}) {
    const {data: session, status} = useSession();
    const router = useRouter();
    const {userId} = router.query;

    const [pixelArts, setPixelArts] = useState(null);

    useEffect(() => {
        (async function () {
            const response = await fetch(`/api/users/${userId}/pixels`);
            const data = await response.json();
            if (response.ok) {
                setPixelArts(data)
            }
        })()
    }, []);

    return (
        <>
            <SiteNavigation user={session?.user ?? null}/>
            <div className={"flex justify-center items-center py-5 gap-10 align-center"}>
                <h3 className={"mt-5"}>{user.name}</h3>
                <Image className={"rounded-full"} src={user.image} width={100} height={100} alt={''}/>
            </div>
            <div className={'w-full flex justify-center'}>
              <div className='flex flex-col items-center justify-center h-1/6 w-4/12 border-2 gap-2 rounded-xl p-2'>
                  {!pixelArts ? (
                      <div>Loading...</div>
                  ) : pixelArts.map((pixelArt) => (
                    <Link href={`/pixelArts/${pixelArt.id}`} className={"px-6 py-2 border-b border-gray-200 w-full rounded hover:bg-gray-400 transition-all duration-300"} key={pixelArt.id}>
                      Pixel Art #{pixelArt.id}
                    </Link>
                  ))}
              </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const {userId} = context.query;
    const user = await getUserById(userId);

    if (!user) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            user
        }
    }
}

