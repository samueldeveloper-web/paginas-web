export const CART_STORAGE_KEY = "trex-cart";
export const WHATSAPP_NUMBER = "573116455682";

export const ROUTES = {
  home: "/index.html",
  admin: "/pages/admin/admin.html",
  cart: "/pages/carrito/carrito.html",
  login: "/pages/login/login.html",
  dynamicCategory: "/pages/categorias/categoria/categoria.html",
};

export const CATEGORY_ROUTES = {
  "armas-traumaticas": "/pages/categorias/traumaticas/traumaticas.html",
  fogueo: "/pages/categorias/fogueo/fogueo.html",
  "aire-comprimido": "/pages/categorias/aire-comprimido/aire-comprimido.html",
  "airsoft-tactico": "/pages/categorias/airsoft/airsoft.html",
  accesorios: "/pages/categorias/accesorios/accesorios.html",
};

export const LEGACY_CATEGORY_SLUGS = {
  "traumaticas.html": "armas-traumaticas",
  "fogueo.html": "fogueo",
  "aire-comprimido.html": "aire-comprimido",
  "airsoft.html": "airsoft-tactico",
  "accesorios.html": "accesorios",
};

export const DEFAULT_CATEGORIES = [
  {
    number_label: "01",
    title: "Armas traumaticas",
    description: "Pistolas, revolveres y accesorios con presencia visual fuerte.",
    slug: "armas-traumaticas",
    tag: "Categoria TREX",
  },
  {
    number_label: "02",
    title: "Fogueo",
    description: "Modelos de fogueo, accesorios compatibles y presentacion comercial especializada.",
    slug: "fogueo",
    tag: "Categoria TREX",
  },
  {
    number_label: "03",
    title: "Aire comprimido",
    description: "Rifles, pistolas y municiones para tiro deportivo y practica.",
    slug: "aire-comprimido",
    tag: "Categoria TREX",
  },
  {
    number_label: "04",
    title: "Airsoft tactico",
    description: "Replicas, BBs, chalecos, cascos y plataformas de juego.",
    slug: "airsoft-tactico",
    tag: "Categoria TREX",
  },
  {
    number_label: "05",
    title: "Accesorios",
    description: "Miras, linternas, estuches, protectores y repuestos.",
    slug: "accesorios",
    tag: "Categoria TREX",
  },
];

export const CATEGORY_DIVISIONS = {
  "armas-traumaticas": {
    heading: "Explora la linea traumatica por tipo de arma.",
    items: [
      {
        title: "Pistolas",
        description: "Modelos compactos y de respuesta rapida para vitrina comercial y uso deportivo.",
      },
      {
        title: "Escopetas",
        description: "Plataformas largas con silueta dominante para una linea mas robusta y tactica.",
      },
      {
        title: "Revolveres",
        description: "Piezas clasicas de alto impacto visual, ideales para coleccion y exhibicion premium.",
      },
    ],
  },
};
