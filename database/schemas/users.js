import { Schema, model, models } from 'mongoose'

const UserSchema = Schema(
    {
        name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        },
        resume: {
            type: String,
            default: ''
        },
        department: {
            type: String,
            default: ''
        },
        designation: {
            type: String,
            default: ''
        },
        gender: {
            type: String,
            default: ''
        },
        contact: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        hired_date: {
            type: String,
            default: ''
        },
        contract_end_date: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            default: 'User'
        },
        status: {
            type: String,
            default: 'active'
        },
        suspended: {
            duration: {
                type: String,
                default: ''
            }
        },
        terminated: {
            files: {
                type: String,
                default: ''
            }
        },
        resigned: {
            files: {
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

const Users = models.Users || model('Users', UserSchema)

export default Users
