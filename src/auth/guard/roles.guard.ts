import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuarioTipo } from '../../usuario/entities/usuario.entity';
import { ROLES_KEY } from '../../usuario/decorator/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UsuarioTipo[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    // Verifica se o tipo do usuário logado está na lista de permitidos
    const hasRole = requiredRoles.some((role) => user.tipo?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso');
    }
    
    return hasRole;
  }
}