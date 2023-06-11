import { Schema, model, models } from 'mongoose'

const LeaveTypeSchema = Schema(
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

const LeaveTypes = models.LeaveTypes || model('LeaveTypes', LeaveTypeSchema)

export default LeaveTypes
