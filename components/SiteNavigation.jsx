import NavBar from "./NavBar"
import { useRouter } from 'next/router'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import {signIn, signOut} from "next-auth/react";

export default function SiteNavigation({user}) {
    const router = useRouter()
    const navigation = [
        { name: 'New', Icon: PlusCircleIcon, href: '/pixel/create', current: router.pathname === '/pixel/create' },
    ]

    const handleSearch = (text) => {
        router.push(`/search?q=${text}`)
    }


    return (
        <NavBar navigation={navigation} onSearch={handleSearch} onSignIn={signIn} onSignOut={signOut} user={user} />
    )
}