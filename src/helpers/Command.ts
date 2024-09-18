import { Hook } from "@prisma/client";
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from "axios";

const execPromise = promisify(exec);

export const executeDeployCommand = async (hook: Hook) => {
    // Ejecuta el comando
    try {
        const { stdout, stderr } = await execPromise(hook.pipeline);
        console.log(`MS-CICD: ${hook.name}: stdout: \n ${stdout} stderr: \n ${stderr}`);
        sendGmail('babyyoda62406@gmail.com', `CI-CD ${hook.name}`, buildHtmlContent(hook.name, stdout, stderr));
    } catch (error) {
        console.log(`MS-CICD: ${hook.name}: error: \n ${error}`);
        sendGmail('babyyoda62406@gmail.com', `CI-CD ${hook.name}`, buildHtmlContent(hook.name, `` , error));
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


const buildHtmlContent = (hookName, stdout, stderr) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #2E86C1;">Result of ${hookName}</h1>
        <hr style="border: 1px solid #ddd; margin: 20px 0;">
  
        <details style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
          <summary style="font-weight: bold; color: #28B463; cursor: pointer;">stdout</summary>
          <pre style="background-color: #1D1F21; color: #F0F0F0; padding: 10px; border-radius: 4px; white-space: pre-wrap; margin-top: 10px;">${stdout}</pre>
        </details>
  
        <details style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; margin-top: 20px;">
          <summary style="font-weight: bold; color: #C0392B; cursor: pointer;">stderr</summary>
          <pre style="background-color: #1D1F21; color: #F0F0F0; padding: 10px; border-radius: 4px; white-space: pre-wrap; margin-top: 10px;">${stderr}</pre>
        </details>
      </div>
    `;
  };
  


