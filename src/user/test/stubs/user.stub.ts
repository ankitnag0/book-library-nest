import { User } from '@prisma/client';

export const userStub = (): User => {
  return {
    id: 1,
    email: 'ankit1@email.com',
    hash: '$argon2id$v=19$m=65536,t=3,p=4$I3vyVclhpGwRe7n3j3+JYQ$OFCE2W9vydDMF+2TBS05+hkSBl+aMaPV9t5gCV+egts',
    roles: 'user',
    name: 'ankit1',
    phone: null,
    address: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
