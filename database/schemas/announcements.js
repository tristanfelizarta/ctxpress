import { Schema, model, models } from 'mongoose'

const AnnouncementSchema = Schema(
    {
        description: {
            type: String,
            default: ''
        },
        date: {
            type: String,
            default: ''
        },
        created: {
            type: String,
            default: ''
        },
        updated: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)

const Announcements =
    models.Announcements || model('Announcements', AnnouncementSchema)

export default Announcements
