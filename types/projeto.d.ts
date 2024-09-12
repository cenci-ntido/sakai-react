declare namespace Projeto {
    type Registry = {
        value: number;
        id?: number;
        description: string;
        period?: string;
        person: 'TI' | 'GABI';
        status: 'RECEBIDO' | 'NAO_RECEBIDO' | 'EM_ABERTO' | 'PAGO' | 'PENDENTE' | 'RESERVADO';
        type: 'REVENUE' | 'EXPENSE';
        [key: string]: string | number | undefined;
    };
}
