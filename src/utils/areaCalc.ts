export const calculateArea = (latitude: number, longitude: number, radiusKm: number) => {
    const earthRadius = 6371; // Radius of the Earth in kilometers
  
    const latDelta = radiusKm / earthRadius;
    const lonDelta = radiusKm / (earthRadius * Math.cos((Math.PI * latitude) / 180));
  
    const minLat = latitude - (latDelta * 180) / Math.PI;
    const maxLat = latitude + (latDelta * 180) / Math.PI;
    const minLon = longitude - (lonDelta * 180) / Math.PI;
    const maxLon = longitude + (lonDelta * 180) / Math.PI;
  
    return {
      minLat,
      maxLat,
      minLon,
      maxLon,
    };
  };