import { IUser } from 'app/entities/user/user.model';
import { IAdmiBancoP } from 'app/entities/admi-banco-p/admi-banco-p.model';

export interface IAdministrador {
  id?: number;
  nivelAcceso?: number | null;
  user?: IUser | null;
  admiBancoP?: IAdmiBancoP | null;
}

export class Administrador implements IAdministrador {
  constructor(public id?: number, public nivelAcceso?: number | null, public user?: IUser | null, public admiBancoP?: IAdmiBancoP | null) {}
}

export function getAdministradorIdentifier(administrador: IAdministrador): number | undefined {
  return administrador.id;
}
