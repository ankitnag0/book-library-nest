import { Book } from '@prisma/client';

export const bookStub = (): Book => {
  return {
    id: 1,
    title: 'Sample Book',
    author: 'John Doe',
    description: 'A sample book description',
    copies: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
