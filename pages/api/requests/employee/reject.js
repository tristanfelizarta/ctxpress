import connect from 'database/connect'
import Users from 'database/schemas/users'
import Requests from 'database/schemas/requests'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await connect()

    try {
        const { id, data } = req.body
        const request = await Requests.findById({ _id: id })
        const user = await Users.findById({ _id: request.user.id })

        await Requests.findByIdAndUpdate(
            { _id: id },
            {
                status: 'rejected',
                ...data,
                updated: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Manila'
                })
            }
        )

        const msg = {
            to: user.email,
            from: process.env.EMAIL_FROM,
            subject: 'Your Request is Rejected!',
            html: '.'
        }

        sgMail.send(msg)
        res.status(200).send('request success.')
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
