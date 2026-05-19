export interface ConstellationData {
  nameRu: string;
  stars: [number, number][]; // 0–100 normalized
  edges: [number, number][];
  brightStars: number[]; // indices of the brightest stars (drawn bigger)
}

// All coordinates are normalized 0–100 in both axes
export const CONSTELLATIONS: Record<string, ConstellationData> = {
  aries: {
    nameRu: 'Овен',
    stars: [
      [22, 52], [38, 44], [52, 36], [64, 30], // Mesarthim → Sheratan → Hamal → 41 Ari
    ],
    edges: [[0,1],[1,2],[2,3]],
    brightStars: [2], // Hamal is the brightest
  },
  taurus: {
    nameRu: 'Телец',
    stars: [
      [52, 58], // Aldebaran (α)
      [38, 42], [22, 32], // Hyades V left
      [36, 22], [50, 28], // Hyades V right
      [68, 40], [80, 48], [88, 38], // Elnath arm
    ],
    edges: [[0,1],[1,2],[0,3],[0,4],[0,5],[5,6],[6,7]],
    brightStars: [0, 7],
  },
  gemini: {
    nameRu: 'Близнецы',
    stars: [
      // Castor chain
      [24, 18], [28, 32], [30, 48], [26, 62], [24, 74],
      // Pollux chain
      [55, 14], [58, 28], [58, 44], [54, 58], [52, 70],
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9],[2,7]],
    brightStars: [0, 5],
  },
  cancer: {
    nameRu: 'Рак',
    stars: [
      [50, 18], // top (δ)
      [22, 48], [50, 46], [78, 44], // middle row
      [42, 74], [58, 74], // Acubens bottom
    ],
    edges: [[0,2],[1,2],[2,3],[2,4],[4,5]],
    brightStars: [1, 3],
  },
  leo: {
    nameRu: 'Лев',
    stars: [
      [48, 22], // Regulus (α) - top sickle
      [36, 30], [25, 44], [30, 58], [44, 66], // Sickle curve
      [60, 54], [68, 36], // back body
      [70, 58], [82, 68], // tail stars
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[5,7],[7,8]],
    brightStars: [0, 6],
  },
  virgo: {
    nameRu: 'Дева',
    stars: [
      [50, 82], // Spica (α) - brightest
      [42, 62], [26, 46], [16, 32], // left arm
      [35, 22], [58, 16], [72, 26], // top arc
      [78, 42], [72, 58], [60, 66], // right side
    ],
    edges: [[0,1],[1,2],[2,3],[1,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,1]],
    brightStars: [0, 5],
  },
  libra: {
    nameRu: 'Весы',
    stars: [
      [20, 42], [50, 26], [78, 38], // top beam (scale bar)
      [35, 66], [65, 62], // the pans
      [50, 50], // center pivot
    ],
    edges: [[0,1],[1,2],[0,5],[2,5],[5,3],[5,4],[0,3],[2,4]],
    brightStars: [0, 2],
  },
  scorpio: {
    nameRu: 'Скорпион',
    stars: [
      [18, 22], [28, 30], [40, 36], [52, 32], [62, 26], // head/claws
      [70, 32], [76, 44], [72, 56], // body curve
      [65, 66], [58, 74], [52, 80], // tail start
      [46, 86], [40, 84], // stinger
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]],
    brightStars: [0, 5],
  },
  sagittarius: {
    nameRu: 'Стрелец',
    stars: [
      [55, 28], [45, 36], [35, 46], [44, 54], // arrow tip → bow
      [54, 56], [64, 46], [70, 36], [60, 26], // teapot body
      [30, 60], [48, 68], [62, 66], // spout/handle
    ],
    edges: [[0,7],[7,6],[6,5],[5,4],[4,3],[3,2],[2,1],[1,0],[3,9],[9,8],[4,10],[10,5]],
    brightStars: [0, 4],
  },
  capricorn: {
    nameRu: 'Козерог',
    stars: [
      [18, 44], [36, 26], [58, 20], [76, 32],
      [80, 52], [65, 64], [45, 68], [26, 58],
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]],
    brightStars: [2, 4],
  },
  aquarius: {
    nameRu: 'Водолей',
    stars: [
      [20, 34], [35, 40], [50, 32], [65, 38], [80, 30], // upper wave
      [25, 54], [40, 60], [55, 52], [70, 58], [82, 50], // lower wave
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9],[2,7]],
    brightStars: [2, 7],
  },
  pisces: {
    nameRu: 'Рыбы',
    stars: [
      // Northern fish (circle-ish)
      [28, 24], [20, 36], [28, 48], [42, 46], [50, 34], [44, 22],
      // Southern fish
      [60, 66], [55, 78], [66, 84], [78, 78], [80, 65], [72, 58],
      // Cord middle point
      [56, 50],
    ],
    edges: [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],
      [6,7],[7,8],[8,9],[9,10],[10,11],[11,6],
      [4,12],[12,6],
    ],
    brightStars: [3, 9],
  },
};
