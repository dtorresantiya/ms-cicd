import { exec } from 'child_process';
import { promisify } from 'util';
import axios from "axios";

const execPromise = promisify(exec);

export const executeDeployCommand = async (data: string) => {
  const mailReciver = 'babyyoda62406@gmail.com'
  try {
      // Ejecuta el comando
      const { stdout, stderr } = await execPromise(data);

      console.log(`MS-CICD: Atinya API: stdout: \n ${stdout} stderr: \n ${stderr}`);

      // Envía el correo con el resultado exitoso
      sendGmail(mailReciver, `CI-CD Atinya Api`, buildHtmlContent(`Atinya API`, stdout, stderr));

  } catch (error: any) {
      // Tipamos el error como `any` para acceder a propiedades específicas
      console.log(`MS-CICD: Atinya API: error: \n`, error);

      // Extraemos más detalles del error si es posible
      const errorMessage = error?.message || 'Error desconocido';
      const errorCmd = error?.cmd || 'Comando no disponible';
      const errorCode = error?.code || 'Código de error no disponible';
      const errorStack = error?.stack || 'Stack no disponible';
      const errorStdout = error?.stdout || '';
      const errorStderr = error?.stderr || '';

      console.log(`Error Detalles:
          Mensaje: ${errorMessage}
          Comando: ${errorCmd}
          Código de Error: ${errorCode}
          Stdout: ${errorStdout}
          Stderr: ${errorStderr}
          Stack: ${errorStack}`);

      // Envía un correo con los detalles del error
      sendGmail(mailReciver, `Error en CI-CD Atinya Api`, buildHtmlContent(`Atinya API`, errorStdout, errorMessage + '\n' + errorStderr));
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
  


