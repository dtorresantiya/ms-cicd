import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateHookDto } from './dto/create-hook.dto';
import { UpdateHookDto } from './dto/update-hook.dto';
import { Hook, PrismaClient } from '@prisma/client';
import { executeDeployCommand } from 'src/helpers/Command';


@Injectable()
export class HookService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('MS-CICD');

  onModuleInit() {
    this.$connect()
    this.logger.log('DB CICD CONNECTED')
  }

  create(createHookDto: CreateHookDto) {
    try {
      return this.hook.create({
        data: createHookDto,
      });
    } catch (error) {
      console.log(error)
      throw new HttpException({ message: 'No podemos crear hooks en este momento', details: "Error en la consulta de hooks / Create" }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  findAll() {
    try {
      return this.hook.findMany();
    } catch (error) {
      console.log(error)
      throw new HttpException({ message: 'No podemos obtener hooks en este momento', details: "Error en la consulta de hooks / FindAll" }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  findOne(id: string) {
    try {
      return this.hook.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.log(error)
      throw new HttpException({ message: 'No podemos obtener hooks en este momento', details: "Error en la consulta de hooks / FindOne" }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async update(id: string, updateHookDto: UpdateHookDto) {
    try {
      return await this.hook.update({
        where: {
          id: id,
        },
        data: updateHookDto,
      });
    } catch (error) {
      console.log(error)
      throw new HttpException({ message: 'No podemos editar hooks en este momento', details: "Error en la consulta de hooks / Update" }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async remove(id: string) {
    try {
      return await this.hook.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.log(error)
      throw new HttpException({ message: 'No podemos eliminar hooks en este momento', details: "Error en la consulta de hooks / Remove" }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async deploy(payload: any) {
    const { ref , repository} = payload;
    const { full_name }  = repository;
    console.log(`Deploying ${full_name} on ${ref}`);
    if (!full_name || !ref) throw new HttpException({ message: 'Bad Request :| ' }, HttpStatus.BAD_REQUEST);
    
    let data: Hook[]  = [];
    try {
      data = await this.hook.findMany({
        where: {
          branch: ref, 
          name: full_name
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException({ message: 'No podemos obtener hooks en este momento', details: "Error en la consulta de hooks / FindAll" }, HttpStatus.SERVICE_UNAVAILABLE);
    }
    if (data.length === 0) throw new HttpException({ message: `No se encontraron hooks para el branch ${ref} en el repositorio ${full_name}`, details: "Error en la consulta de hooks / FindAll" }, HttpStatus.NOT_FOUND);

    for (const hook of data) {
      try {
          executeDeployCommand(hook)        
      } catch (error) {
        console.log(error)
        throw new HttpException({ message: 'No podemos enviar hooks en este momento', details: "Error en la consulta de hooks / FindAll" }, HttpStatus.SERVICE_UNAVAILABLE);
      }
    }

  }

}
