import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IPrueba } from 'app/entities/prueba/prueba.model';
import { IPruebaApoyo } from 'app/entities/prueba-apoyo/prueba-apoyo.model';
import { ISala } from 'app/entities/sala/sala.model';
import { IEstudianteSala } from 'app/entities/estudiante-sala/estudiante-sala.model';

export interface IEstudiante {
  id?: number;
  grado?: string;
  colegio?: string;
  fechaNacimiento?: dayjs.Dayjs | null;
  ciudad?: string;
  user?: IUser | null;
  pruebas?: IPrueba[] | null;
  pruebaApoyos?: IPruebaApoyo[] | null;
  salas?: ISala[] | null;
  estudianteSala?: IEstudianteSala | null;
}

export class Estudiante implements IEstudiante {
  constructor(
    public id?: number,
    public grado?: string,
    public colegio?: string,
    public fechaNacimiento?: dayjs.Dayjs | null,
    public ciudad?: string,
    public user?: IUser | null,
    public pruebas?: IPrueba[] | null,
    public pruebaApoyos?: IPruebaApoyo[] | null,
    public salas?: ISala[] | null,
    public estudianteSala?: IEstudianteSala | null
  ) {}
}

export function getEstudianteIdentifier(estudiante: IEstudiante): number | undefined {
  return estudiante.id;
}
