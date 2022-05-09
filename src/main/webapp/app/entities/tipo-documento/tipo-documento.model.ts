import { IUser } from 'app/entities/user/user.model';
import { State } from 'app/entities/enumerations/state.model';

export interface ITipoDocumento {
  id?: number;
  iniciales?: string;
  nombreDocumento?: string;
  estadoTipoDocumento?: State;
  user?: IUser | null;
}

export class TipoDocumento implements ITipoDocumento {
  constructor(
    public id?: number,
    public iniciales?: string,
    public nombreDocumento?: string,
    public estadoTipoDocumento?: State,
    public user?: IUser | null
  ) {}
}

export function getTipoDocumentoIdentifier(tipoDocumento: ITipoDocumento): number | undefined {
  return tipoDocumento.id;
}
