import { Product, SizeRef } from "./types";

export const COLORS = [
  "Negro", "Blanco", "Gris Claro", "Gris Oscuro", "Plata", 
  "Carbón", "Hueso", "Crema", "Ónix", "Ceniza", "Pizarra", "Marfil"
];

export const SIZES: SizeRef[] = [
  { us: "5", eu: "35" },
  { us: "5.5", eu: "36" },
  { us: "6", eu: "36.5" },
  { us: "6.5", eu: "37" },
  { us: "7", eu: "40" },
  { us: "7.5", eu: "40.5" },
  { us: "8", eu: "41" },
  { us: "8.5", eu: "42" },
  { us: "9", eu: "42.5" },
  { us: "9.5", eu: "43" },
  { us: "10", eu: "44" },
  { us: "10.5", eu: "44.5" },
  { us: "11", eu: "45" },
  { us: "11.5", eu: "45.5" },
  { us: "12", eu: "46" },
];

export const CLOTHING_SIZES: SizeRef[] = [
  { us: "S", eu: "S" },
  { us: "M", eu: "M" },
  { us: "L", eu: "L" },
  { us: "XL", eu: "XL" },
  { us: "XXL", eu: "XXL" }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p-001",
    name: "Avia Elevate Minimal",
    brand: "Avia",
    price: 85.0,
    colors: ["Blanco", "Gris Claro", "Crema"],
    sizes: SIZES.slice(4, 12),
    images: [
      "https://raw.githubusercontent.com/kicksonline/photo_bank/refs/heads/main/160792-2/160792-2%20B.webp",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Diseño aerodinámico y limpio, el Elevate Minimal es el calzado deportivo que redefine la elegancia en tonos grises.",
    material: "Malla transpirable Premium con detalles de TPU y suela de espuma EVA ligera.",
    careInstructions: "Lavar a mano con un paño húmedo. No usar lavadora. Secar a la sombra.",
    rating: 4.8,
    isNew: true,
    gender: "Caballero",
    sku: "AVA-ELM-01",
    inventory: 15,
    category: "Calzado",
    colorVariants: {
      "Blanco": {
        images: [
          "https://raw.githubusercontent.com/kicksonline/photo_bank/refs/heads/main/160792-2/160792-2%20B.webp",
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: [
          { us: "7", eu: "40" },
          { us: "8", eu: "41" },
          { us: "9", eu: "42.5" },
          { us: "10", eu: "44" }
        ]
      },
      "Gris Claro": {
        images: [
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: [
          { us: "8", eu: "41" },
          { us: "8.5", eu: "42" },
          { us: "9", eu: "42.5" }
        ]
      },
      "Crema": {
        images: [
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: [
          { us: "9", eu: "42.5" },
          { us: "9.5", eu: "43" },
          { us: "10", eu: "44" }
        ]
      }
    },
    reviews: [
      { id: "r1", author: "Carlos M.", rating: 5, text: "Extremadamente cómodos y el diseño blanco es impecable.", date: "10 Abr 2026" },
      { id: "r2", author: "Luis V.", rating: 4, text: "Buena calidad, ajustan perfecto a la talla indicada.", date: "05 Abr 2026" }
    ]
  },
  {
    id: "p-002",
    name: "Hey Dude Wally Sox",
    brand: "Hey Dude",
    price: 60.0,
    comparePrice: 80.0,
    colors: ["Negro", "Carbón", "Ceniza"],
    sizes: SIZES,
    images: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "El clásico reinventado. Minimalismo supremo, ligereza insuperable y la aesthetic sobria perfecta para el día a día.",
    material: "Empeine de punto elástico (Knit) y forro de algodón suave. Suela ultra-ligera.",
    careInstructions: "Lavables a máquina en ciclo frío. Retirar plantilla antes de lavar.",
    rating: 4.5,
    isOnSale: true,
    gender: "Caballero",
    sku: "HD-WS-02",
    inventory: 5,
    category: "Calzado",
    colorVariants: {
      "Negro": {
        images: [
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: [
          { us: "7", eu: "40" },
          { us: "8", eu: "41" },
          { us: "9", eu: "42.5" }
        ]
      },
      "Carbón": {
        images: [
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: [
          { us: "9", eu: "42.5" },
          { us: "10", eu: "44" },
          { us: "11", eu: "45" }
        ]
      },
      "Ceniza": {
        images: [
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: [
          { us: "8", eu: "41" },
          { us: "9", eu: "42.5" },
          { us: "10", eu: "44" }
        ]
      }
    },
    reviews: [
      { id: "r3", author: "Andrés G.", rating: 5, text: "Literalmente siento que no llevo zapatos puestos. Excelente servicio.", date: "12 May 2026" }
    ]
  },
  {
    id: "p-003",
    name: "Penguin Classic Kicks",
    brand: "Penguin",
    price: 110.0,
    colors: ["Gris Oscuro", "Ónix", "Pizarra"],
    sizes: SIZES.slice(2, 10),
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "La herencia británica de Original Penguin traducida en una silueta monocromática sofisticada para uso urbano.",
    material: "Piel sintética de alta gama y lona resistente. Suela de caucho vulcanizado.",
    careInstructions: "Limpiar con cepillo de cerdas suaves y jabón neutro.",
    rating: 4.9,
    gender: "Caballero",
    sku: "PEN-CK-03",
    inventory: 0,
    reviews: [
      { id: "r4", author: "Jose L.", rating: 5, text: "La textura gris es muy premium. Valen cada centavo.", date: "22 May 2026" },
      { id: "r5", author: "Miguel R.", rating: 5, text: "Envío rápido vía WhatsApp, me sorprendió lo fácil que fue.", date: "01 Jun 2026" }
    ]
  },
  {
    id: "p-004",
    name: "Hey Dude Wendy",
    brand: "Hey Dude",
    price: 75.0,
    colors: ["Marfil", "Hueso", "Blanco"],
    sizes: SIZES.slice(1, 10),
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Estilo icónico adaptado al confort femenino en colores crudos refinados, ideal para un look minimalista.",
    material: "Parte superior impermeable de tacto suave.",
    careInstructions: "Lavar a mano. Suela apta para cepillo suave.",
    rating: 4.2,
    gender: "Dama",
    sku: "HD-WEN-04",
    inventory: 22,
    reviews: []
  },
  {
    id: "p-005",
    name: "Avia Retro 90s Grayscale",
    brand: "Avia",
    price: 95.0,
    comparePrice: 130.0,
    colors: ["Plata", "Blanco", "Negro", "Carbón"],
    sizes: SIZES,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Una silueta chunky que evoca los años 90 pero estrictamente contenida en la gama de blancos, negros y grises.",
    material: "Bloques de cuero vegano y refuerzos sintéticos. Entresuela robusta absorbente de impactos.",
    careInstructions: "Limpiar en seco con espuma para calzado.",
    rating: 4.7,
    isNew: true,
    isOnSale: true,
    gender: "Dama",
    sku: "AVA-R90-05",
    inventory: 2,
    reviews: [
       { id: "r6", author: "Victoria T.", rating: 4, text: "Me encantan. Súper modernos aunque parezcan retro.", date: "09 Jun 2026" }
    ]
  },
  {
    id: "p-006",
    name: "Penguin Formal Derby",
    brand: "Penguin",
    price: 130.0,
    colors: ["Negro", "Ónix"],
    sizes: SIZES.slice(3, 11),
    images: [
      "https://images.unsplash.com/photo-1614252339462-23c21a115ed3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614252235314-8561d56ae4bb?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "El zapato híbrido definitivo. Formalidad en el corte superior con la comodidad de calzado deportivo en la suela.",
    material: "Cuero auténtico teñido en oscuro profundo, suela contrastante o negra tonal.",
    careInstructions: "Pulir regularmente con crema para cuero negra y cepillo de crin.",
    rating: 5.0,
    gender: "Caballero",
    sku: "PEN-FD-06",
    inventory: 30,
    category: "Calzado",
    reviews: [
      { id: "r7", author: "Gabriel O.", rating: 5, text: "Perfectos para ir a la oficina caminando con estilo y cero dolor.", date: "28 May 2026" }
    ]
  },
  {
    id: "p-101",
    name: "Chaqueta Cortavientos Carven Luxe",
    brand: "Carven",
    price: 145.0,
    colors: ["Negro", "Gris Oscuro"],
    sizes: CLOTHING_SIZES.slice(0, 4),
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Chaqueta impermeable ligera de la colección Carven Paris, perfecta para resistir el viento con un porte de alta moda.",
    material: "Poliéster técnico impermeable con forro de sarga.",
    careInstructions: "Lavar a máquina en frío ciclo suave. Secar al aire.",
    rating: 4.9,
    gender: "Caballero",
    sku: "CRV-CHQ-101",
    inventory: 12,
    category: "Ropa",
    subcategory: "Chaquetas",
    isNew: true,
    reviews: [
      { id: "cr1", author: "Santiago F.", rating: 5, text: "La calidad de las costuras es de otro nivel, super premium.", date: "12 Jun 2026" }
    ]
  },
  {
    id: "p-102",
    name: "Chemise Polo Carven Essential",
    brand: "Carven",
    price: 75.0,
    colors: ["Blanco", "Crema", "Ónix"],
    sizes: CLOTHING_SIZES,
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "La clásica polo chemise refinada por Carven. Ofrece un ajuste impecable para ocasiones casuales y semiformales.",
    material: "Algodón Piqué 100% orgánico transpirable.",
    careInstructions: "Lavar al revés. No usar blanqueador.",
    rating: 4.7,
    gender: "Caballero",
    sku: "CRV-CHM-102",
    inventory: 20,
    category: "Ropa",
    subcategory: "Chemises",
    reviews: []
  },
  {
    id: "p-103",
    name: "Franela Carven Paris Logo",
    brand: "Carven",
    price: 45.0,
    comparePrice: 60.0,
    colors: ["Blanco", "Negro", "Gris Claro"],
    sizes: CLOTHING_SIZES.slice(0, 4),
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Franela básica con el logotipo minimalista de Carven Paris bordado en el pecho. Comodidad y diseño en una sola pieza.",
    material: "Algodón Supima de fibra larga de tacto ultra-suave.",
    careInstructions: "Lavar con colores similares. No usar secadora.",
    rating: 4.8,
    gender: "Caballero",
    sku: "CRV-FRN-103",
    inventory: 15,
    category: "Ropa",
    subcategory: "Franelas",
    isOnSale: true,
    reviews: []
  },
  {
    id: "p-104",
    name: "Camisa Lino Carven Casual",
    brand: "Carven",
    price: 90.0,
    colors: ["Crema", "Blanco", "Ceniza"],
    sizes: CLOTHING_SIZES.slice(0, 4),
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "La frescura y distinción de la camisa de lino estructurada con corte moderno y cuello cubano.",
    material: "100% Lino Premium italiano de caída ligera.",
    careInstructions: "Planchado húmedo o limpieza en seco profesional.",
    rating: 4.6,
    gender: "Dama",
    sku: "CRV-CMS-104",
    inventory: 8,
    category: "Ropa",
    subcategory: "Camisas",
    reviews: []
  },
  {
    id: "p-105",
    name: "Short Cargo Carven Daily",
    brand: "Carven",
    price: 65.0,
    colors: ["Carbón", "Pizarra"],
    sizes: CLOTHING_SIZES.slice(0, 4),
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565049033148-18e5de7e9ddb?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Shorts tipo cargo de diseño utilitario contemporáneo con bolsillos planos discretos y cordón ajustable.",
    material: "Algodón ripstop de alta resistencia.",
    careInstructions: "Lavar en lavadora con agua fría.",
    rating: 4.5,
    gender: "Caballero",
    sku: "CRV-SHR-105",
    inventory: 18,
    category: "Ropa",
    subcategory: "Shorts",
    reviews: []
  },
  {
    id: "p-106",
    name: "Pantalón Chino Carven Slim",
    brand: "Carven",
    price: 95.0,
    comparePrice: 120.0,
    colors: ["Gris Oscuro", "Negro", "Pizarra"],
    sizes: CLOTHING_SIZES.slice(0, 4),
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Pantalón de vestir informal con corte cónico (slim-fit), ideal para looks de oficina y salidas nocturnas.",
    material: "98% Algodón elástico con elastano para máxima flexibilidad.",
    careInstructions: "Lavar con prendas oscuras. Planchar a temperatura media.",
    rating: 4.9,
    gender: "Caballero",
    sku: "CRV-PNT-106",
    inventory: 5,
    category: "Ropa",
    subcategory: "Pantalones",
    isOnSale: true,
    reviews: []
  }
];
