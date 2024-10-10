import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { executeDeployCommand } from 'src/helpers/Command';

@Injectable()
export class HookService {
  private readonly logger = new Logger('MS-CICD');

  async deploy(payload: any) {
    let ref: string;
    let full_name: string;
    try {
      
      ref = payload.ref;
      full_name = payload.repository.full_name;
    } catch (error) {
      throw new HttpException({ message: 'Bad Request :| ' }, HttpStatus.BAD_REQUEST);
    }


    console.log(`Deploying ${full_name} on ${ref}`);
    if (!full_name || !ref) throw new HttpException({ message: 'Bad Request :| ' }, HttpStatus.BAD_REQUEST);

    const data = process.env.PIPE
    console.log(data)

    if (data.length === 0) throw new HttpException({ message: `No se encontraron hooks para el branch ${ref} en el repositorio ${full_name}`, details: "Error en la consulta de hooks / FindAll" }, HttpStatus.NOT_FOUND);

    try {
      executeDeployCommand(data)
    } catch (error) {
      console.log(error)
      throw new HttpException({ message: 'No podemos enviar hooks en este momento', details: "Error en la consulta de hooks / FindAll" }, HttpStatus.SERVICE_UNAVAILABLE);
    }

  }
}
