# Onigiri Edorin

Una web de una sola página para un local de comida japonesa y coreana de Donostia (Erregina
Erregeordea kalea, 4). Enseña la tienda, los productos, el horario (de 11:00 a 22:00 todos los
días), el mapa y el enlace para pedir a domicilio, y se lee en castellano, euskera e inglés.

**Verla funcionando:** <https://onigiri-edorin.pages.dev>

## Cómo está hecha

Es HTML, CSS y JavaScript escritos a mano. No hay frameworks ni librerías de ningún tipo: la
página son tres ficheros propios (`index.html`, `css/styles.css` y `js/app.js`) y las imágenes.

Lo que más cuidado tuvo:

- **Las tipografías se sirven desde la propia web**, no desde el CDN de Google. Son dos, M PLUS
  Rounded 1c para los titulares y Plus Jakarta Sans para el texto, ambas con licencia SIL Open
  Font License 1.1. Así no se manda la IP del visitante a un tercero y la página carga antes.
- **Imágenes ligeras y a su medida.** Cada foto se prepara en AVIF y WebP, con un JPG de
  respaldo, y en varios anchos; el navegador elige la que le corresponde con `<picture>`.
- **Datos estructurados** de tipo `Restaurant`, con dirección, tipo de cocina y horario, para
  que los buscadores puedan leer bien el negocio.
- **Sin analítica ni scripts de terceros.** En el navegador solo se guardan preferencias del
  visitante, como el idioma o si quiere ver movimiento.
- **Respeta el «reducir movimiento»** que el visitante tenga activado en su sistema, y hay
  además un botón para encender o apagar las animaciones.
- El mapa es un `<iframe>` de Google Maps. Es de un tercero y, junto con los enlaces, lo único
  externo que la página toca.

## Estado de los datos

El logotipo es una recreación en SVG hecha a partir del avatar de Instagram del negocio, con las
letras trazadas sobre M PLUS Rounded 1c. Si el negocio tiene el original en vectorial, hay que
sustituirla.

Las fotografías proceden de la ficha de Google Maps del negocio y de su Instagram. De algunas
consta que las subió el propio negocio; de otras no se ha podido comprobar la autoría. Falta que
el negocio confirme por escrito los derechos de uso, así que no se ofrecen para reutilizarlas.

## Créditos

Los iconos son trazados de [Lucide](https://lucide.dev) (licencia ISC).

Hecha por Samuel Pil, estudiante de Informática en la UPV, en Donostia
([LinkedIn](https://www.linkedin.com/in/samuel-pil)). El nombre y el logotipo pertenecen a
Onigiri Edorin y no se ofrecen para reutilizarlos.
