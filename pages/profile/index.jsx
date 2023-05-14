import {useEffect, useState} from 'react'

import {useRouter} from "next/router";
import SiteNavigation from "../../components/SiteNavigation";
import Image from "next/image";
import Link from "next/link";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]";
import {getUserByEmail} from "../../lib/user.service";
import Loading from "../../components/Loading";

export default function Profile({user}) {
    const router = useRouter();

    const [pixelArts, setPixelArts] = useState(null);

    // if (status === "unauthenticated") {
    //     router.push("/api/auth/signin");
    // }

    useEffect(() => {
        (async function () {
            const response = await fetch(`/api/users/${user.id}/pixels`);
            const data = await response.json();
            setPixelArts(data)
        })()
    }, []);

    return (
        <div>
            <SiteNavigation user={user}/>
            <div className={"flex justify-center items-center py-5 gap-10 align-center"}>
                <h3 className={"mt-5"}>{user.name}</h3>
                <Image className={"rounded-full"} src={user.image} width={100} height={100}/>
            </div>
            <div className={'w-full flex justify-center'}>
                <div className='flex flex-col items-center justify-center h-1/6 w-4/12 border-2 gap-2 rounded-xl p-2'>
                    {!pixelArts ? (
                      <Loading />
                    ) : pixelArts.map((pixelArt) => (
                      <Link href={`/pixelArts/${pixelArt.id}`} className={"px-6 py-2 border-b border-gray-200 w-full rounded hover:bg-gray-400 transition-all duration-300"} key={pixelArt.id}>
                          Pixel Art #{pixelArt.id}
                      </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions)
    if (!session?.user) {
        return {
            redirect: {
                destination: "/api/auth/signin",
            },
        }
    }

    return {
        props: {
            user: await getUserByEmail(session.user.email)
        },
    }
}

