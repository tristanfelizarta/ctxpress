import connect from 'database/connect'
import Users from 'database/schemas/users'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await connect()

    try {
        const { id, data } = req.body

        await Users.findByIdAndUpdate(
            { _id: id },
            {
                ...data,
                updated: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Manila'
                })
            }
        )

        const user = await Users.findById({ _id: id })

        console.log(user)

        const template = {
            to: user.email,
            from: process.env.EMAIL_FROM,
            subject: 'You have been promoted as Employee!',
            html: '<strong>You have been promoted as Employee you can sign in now.</strong>'
        }

        sgMail.send(template)
        res.status(200).send('request success.')
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
