import { RolesBuilder } from 'nest-access-control';
import { Role } from './enum';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

// prettier-ignore
RBAC_POLICY
    .grant(Role.USER)
        .read('books')
        .read('book')
    .grant(Role.ADMIN)
        .extend(Role.USER)
        .create('book')
        .update('book')
        .delete('book')
