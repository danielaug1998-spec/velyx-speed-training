# VELYX Speed Training

MVP/full-stack starter para una plataforma de entrenamiento de velocidad especializada en 100 m, 200 m y 400 m.

## Incluye
- Landing page responsive.
- Registro e inicio de sesión local para demo.
- Perfil del atleta.
- Planes para 100/200/400 m.
- Registro de sesiones y progreso.
- Pago por Yape: S/85 al año.
- El usuario puede enviar el código/número de operación para revisión manual.
- Backend Express.
- Estructura preparada para conectar una IA real.

## Ejecutar
1. Instala Node.js 20+.
2. Abre esta carpeta en terminal.
3. Ejecuta `npm install`.
4. Copia `.env.example` como `.env`.
5. Ejecuta `npm start`.
6. Abre `http://localhost:3000`.

## Pago Yape
El sitio muestra el número de Yape configurado por el propietario. El pago NO se verifica automáticamente en este MVP: el atleta debe enviar el código de operación y el administrador lo valida manualmente.

## IA
No se incluye una clave privada de IA en el navegador. Para producción, conecta un proveedor de IA desde `server.js` mediante una variable de entorno y añade reglas de seguridad y validación deportiva.

## Importante
Este proyecto es una base funcional para probar el producto. Antes de cobrar a clientes reales, conviene añadir base de datos, autenticación segura, recuperación de contraseña, HTTPS, panel de administración y un sistema de verificación de pagos.
