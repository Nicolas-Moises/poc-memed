/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Patient, useMemed } from "@/hooks/useMemed";
import { useEffect, useState } from "react";

const FAKE_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.WzM2MzE3LCI2MTA0NGVkZThiMDg4YzdmMmIwMDlkNWM3NmJiMzJjMiIsIjIwMjItMTItMTciLCJzaW5hcHNlLnByZXNjcmljYW8iLCJwYXJ0bmVyLjMuMzE2NDkiXQ.Kv-VSTmXqCI-q6GPiPHF7Q8Prhz2RKy0sL0BWYfoM2I'

export function MemedPrescription() {

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const { definePacient, initMemed, open, isLoaded } = useMemed()

    const patient: Patient = {
        idExterno: 'algum_tipo_de_hash_ou_id_dijdf',
        nome: "Nicolas Moises", // 
        telefone: "11954264849",
        cpf: "99999999999",
        altura: undefined,
        cidade: undefined,
        data_nascimento: undefined,
        endereco: undefined,
        dificuldade_locomocao: undefined,
        nome_mae: undefined,
        nome_social: undefined,
        peso: undefined
    }

    useEffect(() => {
        initMemed(FAKE_TOKEN)
    }, [initMemed])

    const showMemed = () => {
        setLoading(true);

        definePacient(patient).then(() => {
            open();
            setIsOpen(true)
            setLoading(false);
        });
    }

    return (
        <div className="w-full h-full relative">
            {isOpen && (
                <div 
                    className="fixed inset-0 w-full max-w-4xl mx-auto overflow-auto" 
                    id="memed-container"
                />
            )}
            <button
                disabled={loading || !isLoaded} 
                onClick={showMemed}
                className="px-3 py-1.5 rounded-lg bg-violet-500 text-white font-medium hover:opacity-90 disabled:opacity-70 hover:cursor-pointer disabled:cursor-not-allowed"
            >
                {!isLoaded ? 'Carregando Memed...' : 'Prescrever com a memed'}
            </button>
        </div>
    )
}