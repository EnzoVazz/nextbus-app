export type PontoTrajeto = {
  lat: number;
  lng: number;
};

type RespostaRota = {
  routes?: {
    geometry?: {
      coordinates?: [number, number][];
    };
  }[];
};

export async function trajetoNasRuas(pontos: PontoTrajeto[]) {
  if (pontos.length < 2) return pontos;
  const caminho = pontos.map((ponto) => `${ponto.lng},${ponto.lat}`).join(';');
  const resposta = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${caminho}?overview=full&geometries=geojson`,
  );
  if (!resposta.ok) {
    throw new Error('Não foi possível traçar as ruas.');
  }
  const dados = (await resposta.json()) as RespostaRota;
  const coordenadas = dados.routes?.[0]?.geometry?.coordinates;
  if (!coordenadas || coordenadas.length < 2) {
    throw new Error('Não foi possível traçar as ruas.');
  }
  return coordenadas.map(([lng, lat]) => ({ lat, lng }));
}
