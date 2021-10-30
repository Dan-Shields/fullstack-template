import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNum: { type: String, required: true },
    orderCount: { type: Number, required: true }
})

export const User = model('User', UserSchema)
