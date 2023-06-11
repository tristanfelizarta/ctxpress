import { Schema, model, models } from 'mongoose'

const ReportTypeSchema = Schema(
    {
        name: {
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

const ReportTypes = models.ReportTypes || model('ReportTypes', ReportTypeSchema)

export default ReportTypes
