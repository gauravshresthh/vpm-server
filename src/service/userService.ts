import { User } from "../models/userModel";

const create = async (payload :any )=> {
    const user = new User(payload); 
    return await user.save();
}

export default {
    create,
}