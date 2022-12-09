import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {prisma} from "../../../prisma";

export const authOptions = {
    // Configure one or more authentication providers
    secret: process.env.OAUTH_NEXT_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        // ...add more providers here
    ],
}
export default NextAuth(authOptions)