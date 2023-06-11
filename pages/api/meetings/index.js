import connect from 'database/connect'
import Users from 'database/schemas/users'
import Meetings from 'database/schemas/meetings'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await Meetings.find({}).sort({ createdAt: -1 })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body
                const users = await Users.find({}).sort({ createdAt: -1 })

                await Meetings.create({
                    ...data,
                    created: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    }),
                    updated: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    })
                })

                if (data.department === 'all') {
                    const emails = () => {
                        let email = []

                        users.map((user) => {
                            email.push(user.email)
                        })

                        return email
                    }

                    if (emails(users).length !== 0) {
                        const template = {
                            to: emails(users),
                            from: process.env.EMAIL_FROM,
                            subject: 'New Meetings',
                            html: '<strong></strong>'
                        }

                        sgMail.sendMultiple(template)
                    }
                } else {
                    const emails = () => {
                        let email = []

                        users
                            .filter(
                                (user) => user.department === data.department
                            )
                            .map((user) => {
                                email.push(user.email)
                            })

                        return email
                    }

                    if (emails(users).length !== 0) {
                        const template = {
                            to: emails(users),
                            from: process.env.EMAIL_FROM,
                            subject: 'New Meetings',
                            html: '<strong></strong>'
                        }

                        sgMail.sendMultiple(template)
                    }
                }

                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'PATCH':
            try {
                const { id, data } = req.body
                const users = await Users.find({}).sort({ createdAt: -1 })

                await Meetings.findByIdAndUpdate(
                    { _id: id },
                    {
                        ...data,
                        created: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        }),
                        updated: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    }
                )

                if (data.department === 'all') {
                    const emails = () => {
                        let email = []

                        users.map((user) => {
                            email.push(user.email)
                        })

                        return email
                    }

                    if (emails(users).length !== 0) {
                        const template = {
                            to: emails(users),
                            from: process.env.EMAIL_FROM,
                            subject: 'New Updated Meetings',
                            html: '<strong></strong>'
                        }

                        sgMail.sendMultiple(template)
                    }
                } else {
                    const emails = () => {
                        let email = []

                        users
                            .filter(
                                (user) => user.department === data.department
                            )
                            .map((user) => {
                                email.push(user.email)
                            })

                        return email
                    }

                    if (emails(users).length !== 0) {
                        const template = {
                            to: emails(users),
                            from: process.env.EMAIL_FROM,
                            subject: 'New Updated Meetings',
                            html: '<strong></strong>'
                        }

                        sgMail.sendMultiple(template)
                    }
                }

                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'DELETE':
            try {
                const { id } = req.body

                await Meetings.findByIdAndDelete({ _id: id })

                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        default:
            res.status(400).send('request failed.')
            break
    }
}
