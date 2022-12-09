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

    useEffect(() => {
        (async () => {
            const response = await fetch('/api/users/all');
            const data = await response.json();
            if (!response.ok) {
                alert(data.error);
            }
            setUsers(data);
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

                    <div className={"mt-5"}>
                        <h2 className="text-center text-4xl">Users</h2>
                        <div className={"flex flex-col items-center"}>
                            {!users ? (
                                <div>Loading...</div>
                            ) : users?.map(user => (
                                <Link key={user.id} href={"/profile/" + user.id}>
                                    <div key={user.id} className={"flex flex-row items-center"}>
                                        <Image src={user.image} height={100} width={100} className={"w-10 h-10 rounded-full"}/>
                                        <p className={"mx-2"}>{user.name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

