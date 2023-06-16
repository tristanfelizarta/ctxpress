import { Schema, model, models } from 'mongoose'

const RequestTypeSchema = new Schema(
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

const RequestTypes =
    models.RequestTypes || model('RequestTypes', RequestTypeSchema)

export default RequestTypes
