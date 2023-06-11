import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from 'database'
import GoogleProvider from 'next-auth/providers/google'
import connect from 'database/connect'
import Users from 'database/schemas/users'

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    session: {
        strategy: 'database',
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    },
    callbacks: {
        async session({ session, user }) {
            await connect()

            if (user && user.role === undefined) {
                await Users.findOneAndDelete({ _id: user.id })

                await Users.create({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    created: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    }),
                    updated: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    })
                })
            }

            ;(session.user.id = user.id),
                (session.user.department = user.department),
                (session.user.designation = user.designation),
                (session.user.status = user.status),
                (session.user.role = user.role)

            return session
        }
    }
}

export default NextAuth(authOptions)
