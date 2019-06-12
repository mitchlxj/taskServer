import jwt from 'jsonwebtoken';

import { User } from '../interface';

import config from './config';


export default function JwtSign(user: User) {
    const userToken = {
        id:user.id,
        user_name: user.user_name,
        area_limit: user.area_limit,
        user_type: user.user_type,
        status: user.status,
        ctime: user.ctime,
    }

    const token = jwt.sign(userToken, config.jwtTokenSecret, { expiresIn: '365d' });

    return token;
}
