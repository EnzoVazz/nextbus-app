import * as Location from 'expo-location';

export type Coordenada = {
  lat: number;
  lng: number;
};

export async function lerLocalizacao(): Promise<Coordenada> {
  const permissao = await Location.requestForegroundPermissionsAsync();
  if (permissao.status !== 'granted') {
    throw new Error('Permita o uso da localização para achar os pontos perto de você.');
  }
  const posicao = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    lat: posicao.coords.latitude,
    lng: posicao.coords.longitude,
  };
}
