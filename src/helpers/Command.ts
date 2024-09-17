import { Hook } from "@prisma/client";
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from "axios";

const execPromise = promisify(exec);

export const executeDeployCommand = async (hook: Hook) => {
    // Ejecuta el comando
    const { stdout, stderr } = await execPromise(hook.pipeline);
    console.log(`Despliegue exitoso para ${hook.name}: ${stdout}`);
    sendGmail('babyyoda62406@gmail.com', `Despliegue exitoso para ${hook.name}`, stdout);
    if (stderr) {
        console.log(`Error en el despliegue para ${hook.name}: ${stderr}`);
        sendGmail('babyyoda62406@gmail.com', `Error en el despliegue para ${hook.name}`, stderr);
    }
}

const sendGmail = async (reciver: string  , topic: string , msg:string): Promise<string> => {
    const formData = new FormData();
    formData.append('req', 'gmail_send');
    formData.append('reciver', reciver);
    formData.append('topic', topic);
    formData.append('body', msg);

    try {
        await axios.post('https://deivistm.alwaysdata.net/server/server.php', formData, {
            timeout: 10000 // Establecer un tiempo de espera de 10 segundos (10000 milisegundos)
        });
        return 'Codigo enviado';
    } catch (error) {        
        return 'No se ha podido enviar el código, inténtelo mas tarde';
    }
}






