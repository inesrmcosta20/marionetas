// Importar todas as imagens
import hat1 from '../assets/items/hat1.png';
import hat2 from '../assets/items/hat2.png';
import hat3 from '../assets/items/hat3.png';


export const characterTabConfig = {
  hats: { icon: '👒', title: 'Hats', category: 'head' },
  tops: { icon: '👕', title: 'Tops', category: 'torso' },
  pants: { icon: '👖', title: 'Pants', category: 'legs' },
  shoes: { icon: '👟', title: 'Shoes', category: 'feet' },
  accessories: { icon: '👓', title: 'Accessories', category: 'accessory' },
  colors: { icon: '🎨', title: 'Colors', category: 'colors' }
};

export const characterToolbarItems = {
  hats: [
    { id: 'hat1', name: 'Baseball Cap', image: hat1, type: 'hat' },
    { id: 'hat2', name: 'Top Hat', image: hat2, type: 'hat' },
    { id: 'hat3', name: 'Crown', image: hat3, type: 'hat' }
  ],
  tops: [
    { id: 'top1', name: 'T-Shirt', image: hat1, type: 'top' },
    { id: 'top2', name: 'Jacket', image: hat2, type: 'top' },
    { id: 'top3', name: 'Dress', image: hat3, type: 'top' }
  ],
  pants: [
    { id: 'pants1', name: 'Jeans', image: hat1, type: 'pants' },
    { id: 'pants2', name: 'Shorts', image: hat2, type: 'pants' },
    { id: 'pants3', name: 'Skirt', image: hat3, type: 'pants' }
  ],
  shoes: [
    { id: 'shoes1', name: 'Sneakers', image: hat1, type: 'shoes' },
    { id: 'shoes2', name: 'Boots', image: hat2, type: 'shoes' },
    { id: 'shoes3', name: 'Sandals', image: hat3, type: 'shoes' }
  ],
  accessories: [
    { id: 'acc1', name: 'Glasses', image: hat1, type: 'accessory' },
    { id: 'acc2', name: 'Watch', image: hat2, type: 'accessory' },
    { id: 'acc3', name: 'Necklace', image: hat3, type: 'accessory' }
  ],
  colors: [
    { id: 'color1', name: 'Red', color: '#FF0000', type: 'color' },
    { id: 'color2', name: 'Green', color: '#00FF00', type: 'color' },
    { id: 'color3', name: 'Blue', color: '#0000FF', type: 'color' },
    { id: 'color4', name: 'Yellow', color: '#FFFF00', type: 'color' },
    { id: 'color5', name: 'Magenta', color: '#FF00FF', type: 'color' },
    { id: 'color6', name: 'Cyan', color: '#00FFFF', type: 'color' },
    { id: 'color7', name: 'Orange', color: '#FFA500', type: 'color' },
    { id: 'color8', name: 'Purple', color: '#800080', type: 'color' },
    { id: 'color9', name: 'Pink', color: '#FFC0CB', type: 'color' },
    { id: 'color10', name: 'Brown', color: '#A52A2A', type: 'color' },
    { id: 'color11', name: 'Black', color: '#000000', type: 'color' },
    { id: 'color12', name: 'White', color: '#FFFFFF', type: 'color' }
  ]
};

export const scenarioTabConfig = {
  backgrounds: { icon: '🌅', title: 'Backgrounds' },
  nature: { icon: '🌳', title: 'Nature' },
  furniture: { icon: '🪑', title: 'Furniture' },
  buildings: { icon: '🏠', title: 'Buildings' }
};

export const scenarioToolbarItems = {
  backgrounds: [
    { id: 101, name: 'Blue Sky', type: 'background', resizable: true, category: 'background', emoji: '🌅' },
    { id: 102, name: 'Night Sky', type: 'background', resizable: true, category: 'background', emoji: '🌃' },
    { id: 103, name: 'Mountains', type: 'background', resizable: true, category: 'background', emoji: '⛰️' },
    { id: 104, name: 'Cityscape', type: 'background', resizable: true, category: 'background', emoji: '🏙️' },
    { id: 105, name: 'Beach', type: 'background', resizable: true, category: 'background', emoji: '🏖️' },
  ],
  nature: [
    { id: 201, name: 'Tree', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🌳' },
    { id: 202, name: 'Bush', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🌿' },
    { id: 203, name: 'Flower', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🌷' },
    { id: 204, name: 'Rock', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🪨' },
    { id: 205, name: 'Cactus', type: 'nature', resizable: true, rotatable: true, category: 'nature', emoji: '🌵' },
  ],
  furniture: [
    { id: 301, name: 'Chair', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '🪑' },
    { id: 302, name: 'Table', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '🪟' },
    { id: 303, name: 'Sofa', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '🛋️' },
    { id: 304, name: 'Bookshelf', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '📚' },
    { id: 305, name: 'Bed', type: 'furniture', resizable: true, rotatable: true, category: 'furniture', emoji: '🛏️' },
  ],
  buildings: [
    { id: 401, name: 'House', type: 'building', resizable: true, rotatable: false, category: 'building', emoji: '🏠' },
    { id: 402, name: 'Castle', type: 'building', resizable: true, rotatable: false, category: 'building', emoji: '🏰' },
    { id: 403, name: 'Shop', type: 'building', resizable: true, rotatable: false, category: 'building', emoji: '🏪' },
    { id: 404, name: 'School', type: 'building', resizable: true, rotatable: false, category: 'building', emoji: '🏫' },
  ]
};

export const sampleCharacters = [
  { id: 1, name: 'Hero', type: 'character', category: 'character', emoji: '🦸‍♂️' },
  { id: 2, name: 'Villain', type: 'character', category: 'character', emoji: '🦹‍♂️' },
  { id: 3, name: 'Friend', type: 'character', category: 'character', emoji: '👫' },
  { id: 4, name: 'Animal', type: 'character', category: 'character', emoji: '🐱' },
];