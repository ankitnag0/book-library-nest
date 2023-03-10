import { User } from '@prisma/client';

export const userStub = (): User => {
  return {
    id: 1,
    email: 'user@test.com',
    hash: '$argon2id$v=19$m=65536,t=3,p=4$N3qU5N5klF4H4dJ6Ug/6bg$BjNXfkEhmdDmzFphXihSG2Dmfoe1m13fLtGtnfInozw',
    roles: 'user',
    name: 'Test User',
    phone: null,
    address: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
