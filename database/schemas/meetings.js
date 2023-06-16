import { Schema, model, models } from 'mongoose'

const MeetingSchema = new Schema(
    {
        description: {
            type: String,
            default: ''
        },
        department: {
            type: String,
            default: ''
        },
        date: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            default: ''
        },
        file: {
            url: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: ''
            }
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

const Meetings = models.Meetings || model('Meetings', MeetingSchema)

export default Meetings
