# Diners Club Developer Portal

Portal de desarrollador diseñado para IBM API Connect con branding de Diners Club.

## 🌟 Características

- **Diseño Moderno y Responsivo**: Interfaz atractiva con colores corporativos de Diners Club (azul marino y dorado)
- **Documentación Interactiva**: 4 endpoints completamente documentados (2 GET y 2 POST) Ejemplo)
- **API Playground**: Probador de APIs en vivo integrado
- **Autenticación OAuth 2.0**: Documentación completa de autenticación
- **Compatible con API Connect**: Estructura lista para integración

## 📋 APIs Documentadas

### GET Endpoints

1. **GET /api/v1/accounts** - Obtener listado de cuentas
2. **GET /api/v1/transactions** - Consultar transacciones

### POST Endpoints

3. **POST /api/v1/payments** - Procesar pagos
4. **POST /api/v1/cards/application** - Solicitud de tarjetas

## 🎨 Colores de Marca

- **Primario (Navy Blue)**: `#002B5B`
- **Secundario (Gold)**: `#D4AF37`
- **Fondos claros**: `#f9fafb`, `#f3f4f6`

## 📁 Estructura del Proyecto

```
Dev Portal/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos con tema Diners Club
├── js/
│   └── script.js       # Funcionalidad interactiva
├── assets/             # Recursos (logos, imágenes)
└── README.md           # Esta documentación
```

## 🚀 Instalación y Uso

### Opción 1: Visualización Local

Simplemente abra `index.html` en su navegador web favorito.

### Opción 2: Servidor Local

```bash
# Con Python 3
python3 -m http.server 8000

# Con Node.js
npx http-server -p 8000

# Luego visite: http://localhost:8000
```

### Opción 3: Live Server en VS Code

1. Instale la extensión "Live Server"
2. Click derecho en `index.html`
3. Seleccione "Open with Live Server"

## 🔗 Integración con API Connect

Este portal está diseñado para ser utilizado con IBM API Connect. Para integrarlo:

1. **Personalizar el Portal**:

   - Reemplace las URLs de API mock con sus endpoints reales
   - Actualice los tokens de autenticación
   - Ajuste los esquemas de respuesta según su API

2. **Configurar API Connect**:

   ```bash
   # Ejemplo de configuración
   apic config:set catalog=<your-catalog>
   apic publish <product-yaml>
   ```

3. **Temas Personalizados**:

   - Los archivos CSS pueden ser subidos como temas personalizados en API Connect
   - El HTML puede ser integrado en las plantillas del portal

4. **Variables de Entorno**:
   - Actualice las URLs base en `script.js`
   - Configure las credenciales OAuth 2.0
   - Ajuste los endpoints según su catálogo

## 📝 Personalización

### Cambiar Colores

Edite las variables CSS en `css/styles.css`:

```css
:root {
  --color-primary: #002b5b; /* Azul marino */
  --color-secondary: #d4af37; /* Dorado */
}
```

### Agregar Nuevos Endpoints

1. Copie un bloque `.api-card` existente en `index.html`
2. Actualice los detalles del endpoint
3. Agregue el caso correspondiente en `script.js` (función `sendTestRequest`)

### Modificar Logo

Reemplace el SVG del logo en el header con su logo personalizado:

```html
<div class="logo">
  <img src="assets/logo.png" alt="Logo" width="150" />
</div>
```

## 🌐 Características del Portal

### 1. Hero Section

- Estadísticas clave (Uptime, Cobertura, Latencia)
- Llamados a la acción claros
- Diseño degradado con colores de marca

### 2. Documentación de APIs

- Tabs interactivos (Request, Response, Ejemplo)
- Tablas de parámetros
- Ejemplos de código cURL
- Botones de copiar código

### 3. API Playground

- Selector de endpoints
- Ambiente Sandbox/Production
- Editor de request body
- Visualización de respuestas en tiempo real

### 4. Sección de Autenticación

- Guía paso a paso de OAuth 2.0
- Ejemplos de código
- Mejores prácticas de seguridad

### 5. Soporte

- Enlaces a recursos
- Centro de ayuda
- Estado de APIs
- Comunidad de desarrolladores

## 🔒 Seguridad

- Todas las APIs utilizan OAuth 2.0
- Tokens con expiración configurada
- Headers de seguridad recomendados
- HTTPS obligatorio en producción

## 📱 Responsive Design

El portal es completamente responsivo y funciona en:

- 💻 Desktop (1280px+)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (< 768px)

## 🛠 Tecnologías

- HTML5 semántico
- CSS3 con variables personalizadas
- JavaScript ES6+ (Vanilla JS)
- Fuente: Inter (Google Fonts)

## 📦 Próximas Mejoras

- [ ] Integración con Swagger/OpenAPI
- [ ] Sistema de autenticación real
- [ ] Dashboard de métricas
- [ ] Versionado de APIs
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Rate limiting display
- [ ] Webhooks documentation

## 📄 Licencia

Este proyecto es una plantilla para Diners Club y está destinado para uso interno.

## 👥 Soporte

Para soporte técnico o consultas:

- 📧 Email: developers@dinersclub.com
- 🌐 Portal: https://developer.dinersclub.com
- 💬 Comunidad: https://community.dinersclub.com

## 🎯 API Connect Specifics

### Configuración de Producto

```yaml
info:
  name: diners-club-api
  title: Diners Club API
  version: 1.0.0
gateways:
  - datapower-api-gateway
plans:
  default:
    rate-limits:
      default:
        value: 100/1hour
    approval: false
apis:
  - accounts-api:1.0.0
  - transactions-api:1.0.0
  - payments-api:1.0.0
  - cards-api:1.0.0
```

### Configuración del Portal

1. Navegue a su catálogo en API Manager
2. Vaya a Settings > Portal
3. Suba los archivos del tema personalizado
4. Configure el portal URL
5. Publique sus productos

---
