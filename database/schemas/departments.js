import { Schema, model, models } from 'mongoose'

const DepartmentSchema = Schema(
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

const Departments = models.Departments || model('Departments', DepartmentSchema)

export default Departments
