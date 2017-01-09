Ordenador de serie
=====================

Proyecto
-------------------
[Enlace al demo](https://renzotev.github.io/ordenamiento/app/index.html)

Instalación(DESARROLLO)
-----------------------
Pasos levantar el ambiente de desarrollo con node ejecutar:

1. npm install (para instalar las dependecias de desarrollo)
2. gulp serve (para levantar nuestro servidor)

En caso no contar con node instalado la aplicación puede ser visualizada en la ruta app/index.html

Resumen del proyecto
--------------------
El proyecto ha sido realizado desde 0 con:
* Sass
* TypeScript
* Pug ~~Jade~~
* Gulp

Librerias externas:
No se usaron librerias externas a excepción de:
* normalize.css
* Librerias para compilar con gulp
* Algoritmos de ordenamiento de toda la vida(Ordenamiento por mezcla) para evitar usar el sort de javascript

Nota:
No usé JQuery debido a que el proyecto es muy pequeño para una libreria tan grande ya que tambien tenemos librerías que solucionan este tipo de problemas como las siguientes:

* [MixItUp](https://www.kunkalabs.com/mixitup/)
* [Isotope](http://isotope.metafizzy.co/)

Que dependiendo del proyecto es mas sencillo usar alguna de estas librerias

Estructura de carpetas
----------------------

```scss
ordenador de serie/
|- app/
|  |- css/
|  |  |- style.css (CSS compilado)

|  |- fonts/
|  |  |- ... (Icomoon fonts)

|  |- js/
|  |  |- app.js (Javascript transpilado y concatenado)

|  |- scss/ (Archivos Sass)
|  |  - base/
|  |  - components/
|  |  - layout/
|  |  - vendor/
|  |  |- style.scss (includes)

|  |- ts/ (Archivos TypeScript)
|  |  |- app.ts
|  |  |- Form.ts
|  |  |- Sort.ts
|  |  |- Validate.ts

|  |- views/ (Archivos Pug ~~Jade~~)
|  |  - inc/ (Header, footer)
|  |  |- index.pug 

|  |- index.html

|- .editorconfig (indentación fijada a 4 espacios)
|- .gitattributes
|- .gitignore (obviamos los modulos de node)
|- gulpfile.js (listo para compilar el proyecto)
|- package.json
