import { PrismaClient, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import auth0 from '../auth0';

let prisma: PrismaClient;

if(process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    globalThis['prisma'] = globalThis['prisma'] || new PrismaClient();
    prisma = globalThis['prisma'];
}

export const context = async ({ req }) => {
    try {
        const { user: auth0User } = await auth0.getSession(req)
        // const auth0User = { nickname: 'faker', sub: '1', picture: '/blank.png' }
        let user = await prisma.user.findUnique({ where: { auth0: auth0User.sub } });
        
        if(!user) {
            const { nickname, sub, picture } = auth0User;
            user = await prisma.user.create({ 
                data: { 
                    id: uuidv4(), 
                    auth0: sub, 
                    nickname, 
                    picture 
                }, 
            })
            console.log(user)
        }
        return { user, prisma }
    } catch(e) {
        return { user: {}, prisma }
    }
};

export interface Context {
    prisma: PrismaClient;
    user: User;
  }

