import { Request } from '@prisma/client';
import { bookStub } from './book.stub';
import { userStub } from './user.stub';

export const requestStub = (): Request => {
  return {
    id: 1,
    userId: 1,
    bookId: 1,
    status: 'pending',
    type: 'checkout',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
