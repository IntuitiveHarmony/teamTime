const nouns = [
  // Animals
  "Lion",
  "Dolphin",
  "Kangaroo",
  "Elephant",
  "Giraffe",
  "Monkey",
  "Penguin",
  "Tiger",
  "Panda",
  "Koala",
  "Octopus",
  "Zebra",
  "Rhinoceros",
  "Cheetah",
  "Fox",
  "Owl",
  "Bear",
  "Rabbit",
  "Hippopotamus",
  "Peacock",
  "Shark",
  "Crocodile",
  "Butterfly",
  "Seahorse",
  "Platypus",
  "Chimpanzee",
  "Horse",
  "Llama",
  "Camel",
  "Hedgehog",
  "Sloth",
  "Raccoon",
  "Flamingo",
  "Parrot",
  "Orangutan",
  "Snail",
  "Walrus",
  "Alpaca",
  // Plants
  "Redwood",
  "Sunflower",
  "Fern",
  "Rose",
  "Oak",
  "Tulip",
  "Bamboo",
  "Cactus",
  "Palm",
  "Daisy",
  "Lily",
  "Pine",
  "Maple",
  "Bonsai",
  "Moss",
  "Dandelion",
  "Cherry Blossom",
  "Ivy",
  "Succulent",
  "Poppy",
  "Carnation",
  "Aloe",
  "Birch",
  "Lotus",
  "Willow",
  "Hibiscus",
  "Cedar",
  "Beech",
  "Fir",
  "Cypress",
  "Wisteria",
  "Marigold",
  "Violet",
  "Thistle",
  "Mushroom",
  "Fuchsia",
  "Lavender",
  // Minerals
  "Amethyst",
  "Obsidian",
  "Jade",
  "Topaz",
  "Opal",
  "Quartz",
  "Emerald",
  "Ruby",
  "Sapphire",
  "Pearl",
  "Garnet",
  "Turquoise",
  "Diamond",
  "Agate",
  "Onyx",
  "Amber",
  "Citrine",
  "Malachite",
  "Moonstone",
  "Peridot",
  "Coral",
  "Lapis Lazuli",
  "Pyrite",
  "Hematite",
  "Fluorite",
  "Amazonite",
  "Rhodochrosite",
  "Sunstone",
  "Tiger's Eye",
  "Aventurine",
  "Howlite",
  "Serpentine",
  "Kyanite",
  "Labradorite",
  "Obsidian",
  "Unakite",
  // Objects
  "Telescope",
  "Clock",
  "Lantern",
  "Compass",
  "Microscope",
  "Sculpture",
  "Canvas",
  "Globe",
  "Camera",
  "Palette",
  "Piano",
  "Bookshelf",
  "Candle",
  "Quill",
  "Spectacles",
  "Locket",
  "Quilt",
  "Magnifying Glass",
  "Crayon",
  "Tapestry",
  "Easel",
  "Chest",
  "Hourglass",
  "Typewriter",
  "Music Box",
  "Crown",
  "Map",
  "Abacus",
  "Bouquet",
  "Sextant",
  "Tablet",
  "Torch",
  "Chisel",
  "Sundial",
  "Sailboat",
  "Pocket Watch",
  "Fountain Pen",
  // Mythical Creatures
  "Phoenix",
  "Unicorn",
  "Dragon",
  "Mermaid",
  "Griffin",
  "Centaur",
  "Siren",
  "Minotaur",
  "Kitsune",
  "Yeti",
  "Sphinx",
  "Banshee",
  "Gryphon",
  "Kraken",
  "Chimera",
  "Cyclops",
  "Faun",
  "Pegasus",
  "Valkyrie",
  "Gorgon",
  "Nymph",
  "Leviathan",
  "Elf",
  "Djinn",
  "Werewolf",
  "Basilisk",
  "Selkie",
  "Naga",
  "Orc",
  "Troll",
  "Chupacabra",
  // Elements
  "Thunder",
  "Crystal",
  "Fire",
  "Earth",
  "Water",
  "Air",
  "Lightning",
  "Fog",
  "Rain",
  "Sun",
  "Moon",
  "Star",
  "Cloud",
  "Aurora",
  "Rainbow",
  "Mist",
  "Dew",
  "Shadow",
  "Snow",
  "Ice",
  "Tornado",
  "Volcano",
  "Quake",
  "Gale",
  "Cyclone",
  "Lava",
  "Hail",
  "Breeze",
  "Flame",
  "Blaze",
  "Sleet",
  "Solar Wind",
  // Space Objects
  "Comet",
  "Galaxy",
  "Nebula",
  "Star",
  "Asteroid",
  "Meteor",
  "Planet",
  "Moon",
  "Black Hole",
  "Constellation",
  "Satellite",
  "Spacecraft",
  "Celestial Body",
  "Orbit",
  "Supernova",
  "Cosmic Dust",
  "Milky Way",
  "Cosmos",
  "Eclipse",
  "Exoplanet",
  "Meteorite",
  "Solar System",
  "Quasar",
  "Red Dwarf",
  "Zodiac",
  "Nova",
  "Space Probe",
  "Dark Matter",
  "White Dwarf",
  "Cosmonaut",
];

const adjectives = [
  // Colorful
  "Vibrant",
  "Radiant",
  "Colorful",
  "Chromatic",
  "Multicolored",
  "Vivid",
  "Brilliant",
  "Saturated",
  "Dazzling",
  "Lively",
  "Technicolor",
  "Rainbow",
  "Polychromatic",
  "Pigmented",
  "Energetic",
  "Flamboyant",
  "Dynamic",
  "Spectacular",
  "Exuberant",
  "Flourishing",
  // Playful
  "Whimsical",
  "Zany",
  "Cheerful",
  "Lighthearted",
  "Joyful",
  "Amusing",
  "Jovial",
  "Merry",
  "Frolicsome",
  "Gleeful",
  "Animated",
  "Ebullient",
  "Playful",
  "Vivacious",
  "Bubbly",
  "Carefree",
  "Sprightly",
  "Peppy",
  "Eccentric",
  "Mirthful",
  "Lively",
  // Mysterious
  "Enigmatic",
  "Cryptic",
  "Ethereal",
  "Mystifying",
  "Shadowy",
  "Uncanny",
  "Elusive",
  "Intriguing",
  "Obscure",
  "Puzzling",
  "Hidden",
  "Secretive",
  "Mysterious",
  "Esoteric",
  "Unfathomable",
  "Unseen",
  "Enshrouded",
  "Concealed",
  "Arcane",
  "Unearthly",
  // Quirky
  "Quirky",
  "Offbeat",
  "Eccentric",
  "Unconventional",
  "Whimsical",
  "Kooky",
  "Oddball",
  "Curious",
  "Bizarre",
  "Idiosyncratic",
  "Unusual",
  "Weird",
  "Unorthodox",
  "Outlandish",
  "Unpredictable",
  "Funky",
  "Uncommon",
  "Amusing",
  "Whacky",
  "Individualistic",
  // Magical
  "Magical",
  "Enchanted",
  "Mystical",
  "Spellbinding",
  "Fantastical",
  "Otherworldly",
  "Wonderful",
  "Supernatural",
  "Mythical",
  "Awe-inspiring",
  "Miraculous",
  "Whimsical",
  "Enigmatic",
  "Sorcerous",
  "Charming",
  "Transcendent",
  "Wondrous",
  "Ethereal",
  "Dreamy",
  // Galactic
  "Stellar",
  "Celestial",
  "Interstellar",
  "Cosmic",
  "Astronomical",
  "Galactic",
  "Nebulous",
  "Cometary",
  "Lunar",
  "Planetary",
  "Asteroidal",
  "Orbital",
  "Cosmological",
  "Astrophysical",
  "Exoplanetary",
  "Astrological",
  "Sidereal",
  "Starlit",
  "Milky Way",
  "Interplanetary",
  // Nature-Inspired
  "Sylvan",
  "Blossoming",
  "Lush",
  "Verdant",
  "Flourishing",
  "Botanical",
  "Rustic",
  "Natural",
  "Bucolic",
  "Scenic",
  "Picturesque",
  "Serene",
  "Tranquil",
  "Idyllic",
  "Enchanting",
  "Green",
  "Fertile",
  "Serenading",
  "Harmonious",
  "Sunlit",
  "Breezy",
];

module.exports = {
  nouns,
  adjectives,
};
