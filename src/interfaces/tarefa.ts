export interface Tarefa {
  id?: string;
  titulo: string;
  descricao?: string;
  dataCadastro?: string;
  dataConclusao?: string;
  concluida: boolean;
}
