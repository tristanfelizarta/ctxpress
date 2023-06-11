import { Schema, model, models } from 'mongoose'

const DesignationSchema = Schema(
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

const Designations =
    models.Designations || model('Designations', DesignationSchema)

export default Designations
