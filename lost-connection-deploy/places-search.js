/**
 * LOST CONNECTION - MÓDULO DE BÚSQUEDA INTELIGENTE DE LUGARES
 * Este archivo proporciona funcionalidades de búsqueda, autocompletado y matching de lugares
 */

// ==============================================
// BASE DE DATOS DE LUGARES POPULARES
// ==============================================

const PLACES_DATABASE = [
  // Cafeterías y Restaurantes
  { name: 'Starbucks', category: 'cafe', lat: 43.5425, lng: -5.6629, aliases: ['starbucks coffee', 'star'] },
  { name: 'Café Central', category: 'cafe', lat: 43.5425, lng: -5.6629, aliases: ['central', 'cafe central'] },
  { name: 'Café Comercial', category: 'cafe', lat: 43.5430, lng: -5.6635, aliases: ['comercial'] },
  { name: 'McDonald\'s Centro', category: 'restaurant', lat: 43.5420, lng: -5.6620, aliases: ['mcdonalds', 'mac', 'mcdonald'] },
  { name: 'Burger King', category: 'restaurant', lat: 43.5415, lng: -5.6625, aliases: ['bk', 'burguer'] },
  { name: 'Telepizza', category: 'restaurant', lat: 43.5428, lng: -5.6618, aliases: ['pizza'] },
  { name: 'KFC', category: 'restaurant', lat: 43.5422, lng: -5.6632, aliases: ['kentucky'] },
  { name: 'La Cervecería', category: 'bar', lat: 43.5418, lng: -5.6628, aliases: ['cerveceria'] },
  { name: 'Bar Manolo', category: 'bar', lat: 43.5412, lng: -5.6622, aliases: ['manolo'] },
  
  // Transporte
  { name: 'Estación de Tren', category: 'transport', lat: 43.5389, lng: -5.6701, aliases: ['estacion', 'renfe', 'tren'] },
  { name: 'Estación de Autobuses', category: 'transport', lat: 43.5395, lng: -5.6705, aliases: ['autobuses', 'bus'] },
  { name: 'Aeropuerto de Asturias', category: 'transport', lat: 43.5636, lng: -6.0344, aliases: ['aeropuerto', 'airport'] },
  { name: 'Metro Plaza Mayor', category: 'transport', lat: 43.5453, lng: -5.6624, aliases: ['metro', 'plaza mayor'] },
  { name: 'Parada de Taxi Centro', category: 'transport', lat: 43.5440, lng: -5.6630, aliases: ['taxi'] },
  
  // Universidades y Educación
  { name: 'Universidad de Oviedo', category: 'university', lat: 43.3623, lng: -5.8499, aliases: ['uniovi', 'universidad'] },
  { name: 'Universidad Laboral', category: 'university', lat: 43.5234, lng: -5.6189, aliases: ['laboral'] },
  { name: 'Biblioteca Pública', category: 'library', lat: 43.5398, lng: -5.6612, aliases: ['biblioteca', 'biblio'] },
  { name: 'Colegio Inmaculada', category: 'school', lat: 43.5405, lng: -5.6595, aliases: ['inmaculada', 'colegio'] },
  
  // Parques y Espacios Públicos
  { name: 'Plaza Mayor', category: 'plaza', lat: 43.5453, lng: -5.6624, aliases: ['plaza', 'mayor'] },
  { name: 'Parque Isabel la Católica', category: 'park', lat: 43.5445, lng: -5.6589, aliases: ['parque isabel', 'isabel'] },
  { name: 'Playa San Lorenzo', category: 'beach', lat: 43.5401, lng: -5.6512, aliases: ['playa', 'san lorenzo'] },
  { name: 'Parque Begoña', category: 'park', lat: 43.5380, lng: -5.6570, aliases: ['begoña', 'begona'] },
  { name: 'Jardín Botánico', category: 'park', lat: 43.5355, lng: -5.6445, aliases: ['botanico', 'jardin'] },
  
  // Centros Comerciales y Tiendas
  { name: 'Centro Comercial Los Prados', category: 'mall', lat: 43.5367, lng: -5.6478, aliases: ['los prados', 'prados', 'cc'] },
  { name: 'El Corte Inglés', category: 'store', lat: 43.5442, lng: -5.6638, aliases: ['corte ingles', 'eci'] },
  { name: 'Mercado del Sur', category: 'market', lat: 43.5412, lng: -5.6645, aliases: ['mercado', 'sur'] },
  { name: 'Mercadona Centro', category: 'supermarket', lat: 43.5435, lng: -5.6615, aliases: ['mercadona'] },
  { name: 'Carrefour', category: 'supermarket', lat: 43.5390, lng: -5.6580, aliases: ['carrefour'] },
  
  // Cines y Entretenimiento
  { name: 'Cines Centro', category: 'cinema', lat: 43.5378, lng: -5.6598, aliases: ['cine', 'cines'] },
  { name: 'Teatro Jovellanos', category: 'theater', lat: 43.5448, lng: -5.6632, aliases: ['teatro', 'jovellanos'] },
  { name: 'Bowling Center', category: 'entertainment', lat: 43.5350, lng: -5.6520, aliases: ['bowling', 'bolos'] },
  
  // Gimnasios y Deportes
  { name: 'Gimnasio Metropolitan', category: 'gym', lat: 43.5415, lng: -5.6605, aliases: ['gym', 'metropolitan', 'gimnasio'] },
  { name: 'Polideportivo La Calzada', category: 'sports', lat: 43.5295, lng: -5.6425, aliases: ['polideportivo', 'calzada'] },
  { name: 'Club de Tenis', category: 'sports', lat: 43.5310, lng: -5.6380, aliases: ['tenis', 'club'] },
  
  // Hospitales y Salud
  { name: 'Hospital Cabueñes', category: 'hospital', lat: 43.5189, lng: -5.6289, aliases: ['hospital', 'cabuenes'] },
  { name: 'Centro de Salud Puerta de la Villa', category: 'health', lat: 43.5425, lng: -5.6655, aliases: ['centro salud', 'puerta villa'] },
  
  // Hoteles
  { name: 'Hotel Príncipe de Asturias', category: 'hotel', lat: 43.5405, lng: -5.6485, aliases: ['hotel', 'principe'] },
  { name: 'NH Collection', category: 'hotel', lat: 43.5438, lng: -5.6618, aliases: ['nh', 'hotel nh'] },
  
  // Discotecas y Vida Nocturna
  { name: 'Sala Imperio', category: 'club', lat: 43.5408, lng: -5.6642, aliases: ['imperio', 'discoteca'] },
  { name: 'Pub Tequila', category: 'pub', lat: 43.5422, lng: -5.6638, aliases: ['tequila', 'pub'] },
  { name: 'Cantina Mariachi', category: 'pub', lat: 43.5415, lng: -5.6625, aliases: ['mariachi', 'cantina'] },
  
  // Museos y Cultura
  { name: 'Museo del Ferrocarril', category: 'museum', lat: 43.5385, lng: -5.6715, aliases: ['museo', 'ferrocarril'] },
  { name: 'Aquarium', category: 'museum', lat: 43.5475, lng: -5.6505, aliases: ['acuario', 'aquarium'] },
  
  // Oficinas y Coworking
  { name: 'Coworking La Terminal', category: 'office', lat: 43.5395, lng: -5.6608, aliases: ['coworking', 'terminal'] },
  { name: 'WeWork Centro', category: 'office', lat: 43.5428, lng: -5.6595, aliases: ['wework', 'oficina'] }
];

// ==============================================
// FUNCIONES DE BÚSQUEDA
// ==============================================

/**
 * Normaliza texto: quita tildes, pasa a minúsculas, quita espacios extra
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes
    .replace(/\s+/g, ' ') // Normaliza espacios
    .trim();
}

/**
 * Calcula la similitud entre dos textos (algoritmo Levenshtein simplificado)
 */
function calculateSimilarity(str1, str2) {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  // Si uno contiene al otro, alta similitud
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }
  
  // Calcular Levenshtein distance
  const track = Array(s2.length + 1).fill(null).map(() =>
    Array(s1.length + 1).fill(null));
  
  for (let i = 0; i <= s1.length; i++) track[0][i] = i;
  for (let j = 0; j <= s2.length; j++) track[j][0] = j;
  
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - (track[s2.length][s1.length] / maxLen);
}

/**
 * Busca lugares que coincidan con el texto ingresado
 */
function searchPlaces(searchText, options = {}) {
  const {
    limit = 10,
    threshold = 0.3, // Umbral mínimo de similitud
    category = null
  } = options;
  
  if (!searchText || searchText.trim().length === 0) {
    // Sin texto, devolver lugares populares
    return PLACES_DATABASE
      .filter(p => !category || p.category === category)
      .slice(0, limit)
      .map(p => ({ ...p, score: 1 }));
  }
  
  const normalized = normalizeText(searchText);
  const results = [];
  
  for (const place of PLACES_DATABASE) {
    // Filtrar por categoría si se especifica
    if (category && place.category !== category) continue;
    
    // Calcular similitud con nombre principal
    let maxScore = calculateSimilarity(searchText, place.name);
    
    // Calcular similitud con aliases
    for (const alias of place.aliases) {
      const aliasScore = calculateSimilarity(searchText, alias);
      maxScore = Math.max(maxScore, aliasScore);
    }
    
    // Bonus si el texto está contenido
    if (normalizeText(place.name).includes(normalized)) {
      maxScore = Math.max(maxScore, 0.9);
    }
    
    // Si supera el umbral, añadir
    if (maxScore >= threshold) {
      results.push({
        ...place,
        score: maxScore
      });
    }
  }
  
  // Ordenar por score descendente
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, limit);
}

/**
 * Obtiene sugerencias contextuales según hora del día
 */
function getContextualSuggestions(limit = 5) {
  const hour = new Date().getHours();
  let categories;
  
  if (hour >= 6 && hour < 12) {
    // Mañana: cafeterías, transporte
    categories = ['cafe', 'transport', 'university'];
  } else if (hour >= 12 && hour < 18) {
    // Tarde: restaurantes, tiendas, parques
    categories = ['restaurant', 'mall', 'park', 'university'];
  } else if (hour >= 18 && hour < 22) {
    // Tarde-noche: cines, restaurantes
    categories = ['restaurant', 'cinema', 'bar'];
  } else {
    // Noche: bares, discotecas
    categories = ['bar', 'club', 'pub'];
  }
  
  const suggestions = [];
  for (const category of categories) {
    const placesInCategory = PLACES_DATABASE.filter(p => p.category === category);
    suggestions.push(...placesInCategory);
  }
  
  return suggestions.slice(0, limit);
}

/**
 * Encuentra el lugar más cercano a unas coordenadas
 */
function findNearestPlace(lat, lng, maxDistance = 1000) {
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  let nearest = null;
  let minDistance = maxDistance;
  
  for (const place of PLACES_DATABASE) {
    const distance = calculateDistance(lat, lng, place.lat, place.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...place, distance };
    }
  }
  
  return nearest;
}

/**
 * Encuentra todos los lugares dentro de un radio
 */
function findPlacesNearby(lat, lng, radius = 500) {
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const nearby = [];
  
  for (const place of PLACES_DATABASE) {
    const distance = calculateDistance(lat, lng, place.lat, place.lng);
    if (distance <= radius) {
      nearby.push({ ...place, distance });
    }
  }
  
  // Ordenar por distancia
  nearby.sort((a, b) => a.distance - b.distance);
  
  return nearby;
}

/**
 * Mejora un nombre de lugar ingresado por el usuario
 * Si encuentra algo similar en la BD, devuelve el nombre oficial y coordenadas
 */
function enhancePlaceName(userInput, userLat = null, userLng = null) {
  // Buscar coincidencias
  const matches = searchPlaces(userInput, { limit: 3, threshold: 0.5 });
  
  if (matches.length > 0) {
    const bestMatch = matches[0];
    
    // Si el usuario tiene ubicación, verificar si está cerca del lugar
    if (userLat && userLng) {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };
      
      const distance = calculateDistance(userLat, userLng, bestMatch.lat, bestMatch.lng);
      
      // Si está a menos de 200m, probablemente es el lugar correcto
      if (distance < 200) {
        return {
          name: bestMatch.name,
          lat: bestMatch.lat,
          lng: bestMatch.lng,
          confidence: 'high',
          originalInput: userInput
        };
      }
    }
    
    // Si el score es muy alto, asumir que es correcto
    if (bestMatch.score > 0.7) {
      return {
        name: bestMatch.name,
        lat: bestMatch.lat,
        lng: bestMatch.lng,
        confidence: 'medium',
        originalInput: userInput
      };
    }
  }
  
  // No se encontró coincidencia clara, devolver input original
  return {
    name: userInput,
    lat: null,
    lng: null,
    confidence: 'low',
    originalInput: userInput
  };
}

/**
 * Obtiene categorías únicas
 */
function getCategories() {
  const categories = new Set();
  PLACES_DATABASE.forEach(place => categories.add(place.category));
  return Array.from(categories);
}

/**
 * Traduce categorías al español
 */
const CATEGORY_TRANSLATIONS = {
  'cafe': 'Cafeterías',
  'restaurant': 'Restaurantes',
  'bar': 'Bares',
  'pub': 'Pubs',
  'club': 'Discotecas',
  'transport': 'Transporte',
  'university': 'Universidades',
  'school': 'Colegios',
  'library': 'Bibliotecas',
  'plaza': 'Plazas',
  'park': 'Parques',
  'beach': 'Playas',
  'mall': 'Centros Comerciales',
  'store': 'Tiendas',
  'market': 'Mercados',
  'supermarket': 'Supermercados',
  'cinema': 'Cines',
  'theater': 'Teatros',
  'entertainment': 'Entretenimiento',
  'gym': 'Gimnasios',
  'sports': 'Deportes',
  'hospital': 'Hospitales',
  'health': 'Centros de Salud',
  'hotel': 'Hoteles',
  'museum': 'Museos',
  'office': 'Oficinas'
};

function getCategoryLabel(category) {
  return CATEGORY_TRANSLATIONS[category] || category;
}

// ==============================================
// EXPORTAR FUNCIONES (para uso en el HTML)
// ==============================================

// Si se usa como módulo en Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PLACES_DATABASE,
    searchPlaces,
    getContextualSuggestions,
    findNearestPlace,
    findPlacesNearby,
    enhancePlaceName,
    getCategories,
    getCategoryLabel,
    normalizeText,
    calculateSimilarity
  };
}

// Para uso directo en el navegador
if (typeof window !== 'undefined') {
  window.PlacesSearch = {
    database: PLACES_DATABASE,
    search: searchPlaces,
    contextual: getContextualSuggestions,
    nearest: findNearestPlace,
    nearby: findPlacesNearby,
    enhance: enhancePlaceName,
    categories: getCategories,
    categoryLabel: getCategoryLabel
  };
  
  console.log('✅ Módulo de búsqueda de lugares cargado');
  console.log(`📍 ${PLACES_DATABASE.length} lugares disponibles`);
}
