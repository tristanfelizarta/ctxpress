import connect from 'database/connect'
import Requests from 'database/schemas/requests'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        const requests = await Requests.find({}).sort({ createdAt: -1 })
        const data = requests.filter((request) => request.user.id === id)
        res.status(200).send(data)
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
