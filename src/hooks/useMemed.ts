/* eslint-disable @typescript-eslint/no-explicit-any */
import { PacientInterface } from "@/_types/patient";
import { useState } from "react";

declare global {
    interface Window {
        MdHub?: any;
        MdSinapsePrescricao?: any
    }
}

export interface Patient {
    idExterno: string, // Obrigatório
    nome: string, // Obrigatório
    cpf: string, // Obrigatório caso o paciente não possua cpf, utilizar a tag withoutCpf: true
    data_nascimento: string | undefined, // Opcional
    nome_social: string | undefined, // Opcional
    endereco: string | undefined, // Opcional
    cidade: string | undefined, // Opcional
    telefone: string, // Obrigatório
    peso: number | undefined, // Opcional
    altura: number | undefined, // Opcional
    nome_mae: string | undefined, // Opcional
    dificuldade_locomocao: boolean | undefined, // Opcional
}

export const useMemed = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    const logOut = () => {
        // Parar os event listeners da Memed
        window.MdHub.server.unbindEvents();
    
        // Remover o objeto principal da Memed
        delete window.MdHub;
      };
    
      const definePacient = (pacient: PacientInterface): Promise<any> => {
        return new Promise((resolve, reject): void => {
          try {
            window.MdHub.command
              ?.send('plataforma.prescricao', 'setPaciente', {
                idExterno: pacient?.idExterno,
                nome: pacient?.nome,
                nome_social: pacient?.nome_social,
                endereco: pacient?.endereco,
                cidade: pacient?.cidade,
                telefone: pacient?.telefone,
                peso: pacient?.peso,
                altura: pacient?.altura,
                nome_mae: pacient?.nome_mae,
                dificuldade_locomocao: pacient?.dificuldade_locomocao,
              })
              .then(
                (response: any) => {
                    console.info('====== Paciente selecionado ======', response)
                  resolve('');
                },
                (error: any) => {
                  reject(error);
                }
              );
          } catch (err: any) {
            console.error(err);
          }
        });
      };
    
      const initEventsMemed = async () => {
        try {
          window.MdSinapsePrescricao.event.add('core:moduleHide', (modulo: any) => {
            if (modulo.moduleName === 'plataforma.prescricao') {
              console.info('====== Módulos da Memed encerrados ======');
            }
          });
    
          window.MdSinapsePrescricao.event.add('core:moduleInit', function setFeatureToggle(modulo: any) {
            window.MdHub.command.send('plataforma.prescricao', 'setFeatureToggle', {
              // Desativa a opção de excluir um paciente
              deletePatient: false,
              // Desabilita a opção de remover/trocar o paciente
              removePatient: false,
              // Esconde o formulário de confirmação dos dados do paciente para receituário de controle especial
              // caso a cidade e o endereço tenham sido definidos com o comando `setPaciente`
              editPatient: false,
              setPatientAllergy: true,
            });

            if(modulo.name === 'plataforma.prescricao') {
                setIsLoaded(true);
            }
          });



        } catch (err: any) {
          console.error(err);
        }
      };
    
      const initMemed = (token: string) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('data-color', '#53837F');
        script.setAttribute('data-token', token);
        script.setAttribute('data-container', 'memed-container')
        script.src = `https://integrations.memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js`;
        script.onload = () => {
          initEventsMemed()
        };
        document.body.appendChild(script);
      };
    
      const open = (module = 'plataforma.prescricao') => {
        window.MdHub.module.show(module);
      };

    return {
        logOut, open, initMemed, definePacient, isLoaded
    }
}