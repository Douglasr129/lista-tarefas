export interface Tarefa {
  id?: number;
  titulo: string;
  descricao?: string;
  dataCadastro?: string;
  dataConclusao?: string;
  concluida: boolean;
}
