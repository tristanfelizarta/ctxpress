import connect from 'database/connect'
import Users from 'database/schemas/users'
import Holidays from 'database/schemas/holidays'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await Holidays.find({}).sort({ createdAt: -1 })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body
                const users = await Users.find({}).sort({ createdAt: -1 })

                await Holidays.create({
                    ...data,
                    created: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    }),
                    updated: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    })
                })

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
                        subject: 'New Holiday',
                        html: '<strong></strong>'
                    }

                    sgMail.sendMultiple(template)
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

                await Holidays.findByIdAndUpdate(
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
                        subject: 'New Updated Holiday',
                        html: '<strong></strong>'
                    }

                    sgMail.sendMultiple(template)
                }

                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'DELETE':
            try {
                const { id } = req.body

                await Holidays.findByIdAndDelete({ _id: id })

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
