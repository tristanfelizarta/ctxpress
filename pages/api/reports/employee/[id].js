import connect from 'database/connect'
import Reports from 'database/schemas/reports'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        const reports = await Reports.find({}).sort({ createdAt: -1 })
        const data = reports.filter((report) => report.user.id === id)
        res.status(200).send(data)
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
