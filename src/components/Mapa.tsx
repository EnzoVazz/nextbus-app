import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { LinhasNoPonto, useToqueNoMapa } from '@/components/LinhasNoPonto';
import { MapaMoldura } from '@/components/MapaMoldura';
import { corDoMarco, type PropsMapa } from '@/components/mapaTipos';

export function Mapa({ marcos, trajeto = [], onPressMarco }: PropsMapa) {
  const { ponto, aoPressionar } = useToqueNoMapa(onPressMarco);
  const mapa = useRef<MapView>(null);
  const pronto = useRef(false);
  const marcosAtuais = useRef(marcos);
  const trajetoAtual = useRef(trajeto);
  marcosAtuais.current = marcos;
  trajetoAtual.current = trajeto;
  const assinatura = marcos.map((marco) => `${marco.id}:${marco.lat.toFixed(5)}:${marco.lng.toFixed(5)}`).join('|');
  const assinaturaTrajeto = trajeto.map((pontoRota) => `${pontoRota.lat.toFixed(4)},${pontoRota.lng.toFixed(4)}`).join(';');

  function coordenadasDoFoco() {
    const rota = trajetoAtual.current;
    if (rota.length > 1) {
      const onibus = marcosAtuais.current.filter((marco) => marco.tipo === 'onibus');
      return [...rota, ...onibus].map((pontoRota) => ({ latitude: pontoRota.lat, longitude: pontoRota.lng }));
    }
    return marcosAtuais.current.map((marco) => ({ latitude: marco.lat, longitude: marco.lng }));
  }

  function enquadrar() {
    const lista = coordenadasDoFoco();
    if (!mapa.current || lista.length === 0) return;
    if (lista.length === 1) {
      const unico = lista[0];
      mapa.current.animateToRegion(
        {
          latitude: unico.latitude,
          longitude: unico.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        400,
      );
      return;
    }
    mapa.current.fitToCoordinates(lista, {
      edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
      animated: true,
    });
  }

  useEffect(() => {
    if (pronto.current) enquadrar();
  }, [assinatura, assinaturaTrajeto]);

  return (
    <View style={estilos.bloco}>
      <MapaMoldura marcos={marcos}>
        <MapView
          ref={mapa}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: -23.55,
            longitude: -46.63,
            latitudeDelta: 0.2,
            longitudeDelta: 0.32,
          }}
          onMapReady={() => {
            pronto.current = true;
            enquadrar();
          }}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}>
          {trajeto.length > 1 ? (
            <Polyline
              coordinates={trajeto.map((pontoRota) => ({ latitude: pontoRota.lat, longitude: pontoRota.lng }))}
              strokeColor="#E3A008"
              strokeWidth={5}
              zIndex={0}
            />
          ) : null}
          {marcos.map((marco) => (
            <Marker
              key={marco.id}
              coordinate={{ latitude: marco.lat, longitude: marco.lng }}
              title={marco.titulo}
              pinColor={corDoMarco(marco.tipo)}
              zIndex={marco.tipo === 'origem' || marco.tipo === 'destino' || marco.tipo === 'eu' ? 3 : 1}
              onPress={() => aoPressionar(marco.id)}
            />
          ))}
        </MapView>
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

