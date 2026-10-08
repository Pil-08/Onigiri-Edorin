# Onigiri Edorin

Una web de una sola página para un local de comida japonesa y coreana de Donostia (Erregina
Erregeordea kalea, 4). Enseña la tienda y los productos, da el horario (de 11:00 a 22:00 todos
los días), pone el mapa y enlaza con el pedido a domicilio. Se lee en castellano, euskera e
inglés.

**Verla funcionando:** <https://onigiri-edorin.pages.dev>

## Cómo está hecha

Todo el código es propio: `index.html`, `css/styles.css` y `js/app.js`, sin frameworks ni
librerías, y las imágenes.

Hay dos tipografías, M PLUS Rounded 1c para los titulares y Plus Jakarta Sans para el texto, y
las dos viajan con la web en lugar de pedirse al CDN de Google (licencia SIL Open Font License
1.1). Es una decisión de privacidad, porque así no se envía la IP del visitante a un tercero, y
también de velocidad. Las fotos se preparan en AVIF y WebP, con un JPG de respaldo, y en varios
anchos para que cada pantalla descargue la que necesita.

Para los buscadores, el negocio figura como `Restaurant` en datos estructurados, con su
dirección, su tipo de cocina y su horario.

La página no usa analítica ni scripts de terceros, y de las preferencias del visitante solo
recuerda el idioma y si quiere movimiento. Las animaciones se detienen si el sistema pide
«reducir movimiento», y un botón permite encenderlas o apagarlas a mano. Lo único que se carga
de otro servidor es el mapa, un `<iframe>` de Google Maps.

## Estado de los datos

El logotipo es una recreación en SVG hecha a partir del avatar de Instagram del negocio, con las
letras trazadas sobre M PLUS Rounded 1c. Si el negocio tiene el original en vectorial, hay que
sustituirla.

Las fotografías proceden de la ficha de Google Maps del negocio y de su Instagram. De algunas
consta que las subió el propio negocio; de otras no se ha podido comprobar la autoría. Falta que
el negocio confirme por escrito los derechos de uso, así que no se ofrecen para reutilizarlas.
La foto de la tarjeta «Inari» la envió el propio negocio en octubre de 2026.

## Créditos

Los iconos son trazados de [Lucide](https://lucide.dev) (licencia ISC).

Hecha por Samuel Pil, estudiante de Informática en la UPV, en Donostia
([LinkedIn](https://www.linkedin.com/in/samuel-pil)). El nombre y el logotipo pertenecen a
Onigiri Edorin y no se ofrecen para reutilizarlos.
