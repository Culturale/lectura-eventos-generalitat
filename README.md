# lectura-eventos-generalitat
Script que permite leer el archivo CSV de la Generalitat que contiene la informacion de los eventos y los carga en la base de datos.  
Datos de la Generalitat: https://analisi.transparenciacatalunya.cat/Cultura-oci/Agenda-cultural-de-Catalunya-per-localitzacions-/rhpv-yr4f  


## Modo de empleo:
1. El archivo .env tiene que estar en la raiz con el siguiente contenido:
```
URI=http://localhost:8080
auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QtdXNlcm5hbWUiLCJpYXQiOjE2ODM3Mzc2NTl9.B7FUW3k2UoANqw6ocTW8m_vc75-qvO0msViLO5hWDKA
```
El parametro URI contiene la direccion donde se encuentra el servidor. En el codigo del script se asigna `/events/create` al final de la URI para poder realizar las peticiones.  

El parametro auth_token contiene un token de autentificación para poder realizar las peticiones.  

2. Descargas el archivo .csv proporcionado por la generalitat en una carpeta que tienes que crear y situar en la raiz.

Enlace: https://analisi.transparenciacatalunya.cat/Cultura-oci/Agenda-cultural-de-Catalunya-per-localitzacions-/rhpv-yr4f  

Ruta del archivo .csv: `lectura-eventos-generalitat/files/Agenda_cultural_de_Catalunya__per_localitzacions_.csv`  

3. En una terminal situate sobre la raiz del proyecto y ejecuta `yarn`
4. Sobre la raiz del proyecto ejecuta `yarn ts-node index.ts`
