import {useEffect, useState} from 'react'

import {useRouter} from "next/router";
import SiteNavigation from "../../components/SiteNavigation";
import Image from "next/image";
import Link from "next/link";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]";
import {getUserByEmail} from "../../lib/user.service";

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
            console.log(data)
            setPixelArts(data)
        })()
    }, []);

    return (
        <>
            <SiteNavigation user={user}/>
            <div className={"flex justify-center gap-10 align-center m-auto m-0"}>
                <h3 className={"mt-5"}>{user.name}</h3>
                <Image className={"rounded-full"} src={user.image} width={100} height={100}/>
            </div>
            <div className='flex flex-col items-center justify-around h-1/6'>
                {!pixelArts ? (
                    <div>Loading...</div>
                ) : pixelArts.map((pixelArt) => (
                    <div className={"px-6 py-2 border-b border-gray-200 w-full rounded-t-lg"} key={pixelArt.id}>
                        <Link href={`/pixelArts/${pixelArt.id}`}>Pixel Art #{pixelArt.id} click to see</Link>
                    </div>
                ))}
            </div>
        </>
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

