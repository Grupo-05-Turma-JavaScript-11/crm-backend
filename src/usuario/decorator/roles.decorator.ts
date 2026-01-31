import { SetMetadata } from '@nestjs/common';
import { UsuarioTipo } from '../entities/usuario.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UsuarioTipo[]) => SetMetadata(ROLES_KEY, roles);
