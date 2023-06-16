import { Schema, model, models } from 'mongoose'

const HolidaySchema = new Schema(
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

const Holidays = models.Holidays || model('Holidays', HolidaySchema)

export default Holidays
