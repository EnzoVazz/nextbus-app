export const DIAS = [
  { valor: '1', nome: 'Seg' },
  { valor: '2', nome: 'Ter' },
  { valor: '3', nome: 'Qua' },
  { valor: '4', nome: 'Qui' },
  { valor: '5', nome: 'Sex' },
  { valor: '6', nome: 'Sáb' },
  { valor: '7', nome: 'Dom' },
] as const;

export function textoDias(valor: string) {
  return valor
    .split(',')
    .filter(Boolean)
    .map((dia) => DIAS.find((item) => item.valor === dia)?.nome ?? dia)
    .join(', ');
}

export function textoSentido(sentido: string) {
  if (sentido === 'IDA') return 'Ida';
  if (sentido === 'VOLTA') return 'Volta';
  return sentido;
}
