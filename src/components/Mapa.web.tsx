import { createElement, useEffect, useId } from 'react';
import { StyleSheet, View } from 'react-native';

import { LinhasNoPonto, useToqueNoMapa } from '@/components/LinhasNoPonto';
import { MapaMoldura } from '@/components/MapaMoldura';
import { corDoMarco, type Marco, type PontoMapa, type PropsMapa } from '@/components/mapaTipos';

export function Mapa({ marcos, trajeto = [], onPressMarco }: PropsMapa) {
  const mapaId = useId();
  const html = montarHtml(marcos, trajeto, mapaId);
  const { ponto, aoPressionar } = useToqueNoMapa(onPressMarco);

  useEffect(() => {
    function receber(evento: EventoMensagem) {
      if (typeof evento.data !== 'string') return;
      try {
        const dado = JSON.parse(evento.data) as { id?: unknown; mapa?: unknown };
        if (dado.mapa !== mapaId || typeof dado.id !== 'string') return;
        aoPressionar(dado.id);
      } catch {
        // Outras mensagens da página não fazem parte do mapa.
      }
    }
    window.addEventListener('message', receber);
    return () => window.removeEventListener('message', receber);
  }, [aoPressionar, mapaId]);

  return (
    <View style={estilos.bloco}>
      <MapaMoldura marcos={marcos}>
        {createElement('iframe', {
          title: 'Mapa dos pontos em São Paulo',
          srcDoc: html,
          style: {
            border: 'none',
            width: '100%',
            height: '100%',
            display: 'block',
          },
        })}
      </MapaMoldura>
      <LinhasNoPonto codigo={ponto} />
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    gap: 8,
  },
});

type EventoMensagem = { data: unknown };

function montarHtml(marcos: Marco[], trajeto: PontoMapa[], mapaId: string) {
  const dados = JSON.stringify(
    marcos.map((marco) => ({
      id: marco.id,
      lat: marco.lat,
      lng: marco.lng,
      titulo: marco.titulo,
      cor: corDoMarco(marco.tipo),
      onibus: marco.tipo === 'onibus',
      grande: marco.tipo === 'eu' || marco.tipo === 'origem' || marco.tipo === 'destino' || marco.tipo === 'onibus',
    })),
  ).replace(/</g, '\\u003c');
  const rota = JSON.stringify(trajeto).replace(/</g, '\\u003c');
  const idMapa = JSON.stringify(mapaId);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #mapa { height: 100%; margin: 0; background: #F4EFE6; }
    .leaflet-control-attribution { font-size: 10px; }
  </style>
</head>
<body>
  <div id="mapa"></div>
  <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const marcos = ${dados};
    const trajeto = ${rota};
    const mapa = L.map('mapa', { zoomControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapa);
    const limites = [];
    const seguirRua = trajeto.length > 1;
    if (seguirRua) {
      const pontos = trajeto.map((ponto) => [ponto.lat, ponto.lng]);
      L.polyline(pontos, { color: '#0A3F34', weight: 8, opacity: 0.85 }).addTo(mapa);
      L.polyline(pontos, { color: '#E3A008', weight: 4 }).addTo(mapa);
      for (const ponto of pontos) limites.push(ponto);
    }
    for (const marco of marcos) {
      const marca = L.circleMarker([marco.lat, marco.lng], {
        radius: marco.grande ? 10 : 7,
        color: '#ffffff',
        weight: 2,
        fillColor: marco.cor,
        fillOpacity: 1
      }).addTo(mapa);
      marca.bindTooltip(marco.titulo, { direction: 'top' });
      marca.on('click', () => parent.postMessage(JSON.stringify({ id: marco.id, mapa: ${idMapa} }), '*'));
      if (!seguirRua || marco.onibus) limites.push([marco.lat, marco.lng]);
    }
    if (limites.length === 1) mapa.setView(limites[0], 14);
    else if (limites.length > 1) mapa.fitBounds(limites, { padding: [24, 24], maxZoom: 15 });
    else mapa.setView([-23.55, -46.63], 11);
  </script>
</body>
</html>`;
}
