# API Connect Integration Guide

Esta guía explica cómo integrar este portal de desarrollador con IBM API Connect.

## Requisitos Previos

- IBM API Connect v10.x o superior
- Acceso a API Manager
- Conocimientos básicos de APIs REST
- Node.js (opcional, para herramientas de desarrollo)

## Pasos de Integración

### 1. Preparar el Entorno de API Connect

```bash
# Instalar API Connect CLI
npm install -g @ibm/apiconnect-cli

# Verificar instalación
apic version

# Login a API Manager
apic login --server <api-manager-url> --username <username>
```

### 2. Crear Definiciones de API

#### accounts-api.yaml

```yaml
swagger: '2.0'
info:
  title: Accounts API
  version: 1.0.0
  description: API para gestión de cuentas Diners Club
host: api.dinersclub.com
basePath: /v1
schemes:
  - https
securityDefinitions:
  oauth2:
    type: oauth2
    flow: application
    tokenUrl: https://api.dinersclub.com/oauth/token
paths:
  /accounts:
    get:
      summary: Obtener listado de cuentas
      security:
        - oauth2: []
      parameters:
        - name: limit
          in: query
          type: integer
          default: 10
        - name: offset
          in: query
          type: integer
          default: 0
        - name: status
          in: query
          type: string
          enum: [active, inactive, suspended]
      responses:
        200:
          description: Éxito
          schema:
            $ref: '#/definitions/AccountsResponse'
definitions:
  AccountsResponse:
    type: object
    properties:
      status:
        type: string
      data:
        type: object
```

#### transactions-api.yaml

```yaml
swagger: '2.0'
info:
  title: Transactions API
  version: 1.0.0
  description: API para consulta de transacciones
host: api.dinersclub.com
basePath: /v1
schemes:
  - https
securityDefinitions:
  oauth2:
    type: oauth2
    flow: application
    tokenUrl: https://api.dinersclub.com/oauth/token
paths:
  /transactions:
    get:
      summary: Consultar transacciones
      security:
        - oauth2: []
      parameters:
        - name: accountId
          in: query
          type: string
          required: true
        - name: startDate
          in: query
          type: string
          format: date
        - name: endDate
          in: query
          type: string
          format: date
        - name: limit
          in: query
          type: integer
          default: 20
      responses:
        200:
          description: Éxito
```

#### payments-api.yaml

```yaml
swagger: '2.0'
info:
  title: Payments API
  version: 1.0.0
  description: API para procesamiento de pagos
host: api.dinersclub.com
basePath: /v1
schemes:
  - https
securityDefinitions:
  oauth2:
    type: oauth2
    flow: application
    tokenUrl: https://api.dinersclub.com/oauth/token
paths:
  /payments:
    post:
      summary: Procesar un nuevo pago
      security:
        - oauth2: []
      parameters:
        - name: body
          in: body
          required: true
          schema:
            $ref: '#/definitions/PaymentRequest'
      responses:
        201:
          description: Pago creado
definitions:
  PaymentRequest:
    type: object
    required:
      - accountId
      - amount
      - currency
    properties:
      accountId:
        type: string
      amount:
        type: number
      currency:
        type: string
```

#### cards-api.yaml

```yaml
swagger: '2.0'
info:
  title: Cards API
  version: 1.0.0
  description: API para solicitud de tarjetas
host: api.dinersclub.com
basePath: /v1
schemes:
  - https
securityDefinitions:
  oauth2:
    type: oauth2
    flow: application
    tokenUrl: https://api.dinersclub.com/oauth/token
paths:
  /cards/application:
    post:
      summary: Solicitud de nueva tarjeta
      security:
        - oauth2: []
      parameters:
        - name: body
          in: body
          required: true
          schema:
            $ref: '#/definitions/CardApplicationRequest'
      responses:
        201:
          description: Solicitud creada
definitions:
  CardApplicationRequest:
    type: object
    required:
      - cardType
      - applicant
    properties:
      cardType:
        type: string
        enum: [classic, gold, platinum]
```

### 3. Crear Producto en API Connect

#### diners-club-product.yaml

```yaml
product: '1.0.0'
info:
  name: diners-club-api-product
  title: Diners Club API Product
  version: 1.0.0
gateways:
  - datapower-api-gateway
visibility:
  view:
    type: public
  subscribe:
    type: authenticated
plans:
  default:
    title: Default Plan
    description: Plan básico con límites estándar
    approval: false
    rate-limits:
      default:
        value: 100/1hour
        hard-limit: true
  premium:
    title: Premium Plan
    description: Plan premium con límites ampliados
    approval: true
    rate-limits:
      premium:
        value: 1000/1hour
        hard-limit: true
apis:
  accounts-api:
    name: accounts-api:1.0.0
  transactions-api:
    name: transactions-api:1.0.0
  payments-api:
    name: payments-api:1.0.0
  cards-api:
    name: cards-api:1.0.0
```

### 4. Publicar APIs

```bash
# Publicar cada API
apic create --type api --title "Accounts API"
apic create --type api --title "Transactions API"
apic create --type api --title "Payments API"
apic create --type api --title "Cards API"

# Publicar el producto
apic publish diners-club-product.yaml --catalog sandbox --organization <org>
```

### 5. Configurar el Portal de Desarrolladores

#### Opción A: Portal Nativo de API Connect

1. Acceda a API Manager
2. Navegue a Manage > Catalogs > Sandbox
3. Vaya a Settings > Portal
4. Configure el portal URL
5. Personalice el tema con los archivos CSS

#### Opción B: Portal Personalizado (Este Proyecto)

1. **Actualizar URLs en script.js**:

```javascript
const API_BASE_URL = 'https://api.dinersclub.com/v1';
const OAUTH_TOKEN_URL = 'https://api.dinersclub.com/oauth/token';
```

2. **Configurar CORS en API Connect**:

```yaml
# En cada definición de API
cors:
  enabled: true
  allow-credentials: false
  allow-methods:
    - GET
    - POST
    - OPTIONS
  allow-headers:
    - Authorization
    - Content-Type
  allow-origins:
    - https://developer.dinersclub.com
```

3. **Desplegar el Portal**:

```bash
# Usando un servidor web
npm install -g http-server
http-server . -p 8080

# O usando nginx
sudo cp -r * /var/www/html/developer-portal/
```

### 6. Configurar OAuth 2.0

#### oauth-provider.yaml

```yaml
oauth-provider:
  title: Diners Club OAuth Provider
  token-path: /oauth/token
  authorize-path: /oauth/authorize
  scopes:
    read: Read access
    write: Write access
  grants:
    - application
    - password
  identity-extraction:
    type: custom
```

### 7. Probar la Integración

```bash
# Obtener token
curl -X POST "https://api.dinersclub.com/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"

# Probar endpoint
curl -X GET "https://api.dinersclub.com/v1/accounts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Personalización del Portal

### Temas Personalizados

1. Cree un archivo `portal-theme.zip` con:

   - styles.css
   - logo.png
   - favicon.ico

2. Suba a API Connect:
   - Catalogs > Settings > Portal > Customize

### Variables de Entorno

Cree un archivo `.env` (no incluir en git):

```env
API_BASE_URL=https://api.dinersclub.com/v1
OAUTH_TOKEN_URL=https://api.dinersclub.com/oauth/token
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
ENVIRONMENT=sandbox
```

### Configuración de Producción

```javascript
// config.js
const config = {
  sandbox: {
    baseUrl: 'https://sandbox-api.dinersclub.com/v1',
    oauthUrl: 'https://sandbox-api.dinersclub.com/oauth/token',
  },
  production: {
    baseUrl: 'https://api.dinersclub.com/v1',
    oauthUrl: 'https://api.dinersclub.com/oauth/token',
  },
};

export default config;
```

## Monitoreo y Analytics

### Configurar API Analytics

1. En API Manager, vaya a Analytics
2. Cree dashboards personalizados
3. Configure alertas para:
   - Rate limits excedidos
   - Errores 4xx/5xx
   - Latencia alta

### Integrar con el Portal

```javascript
// analytics.js
function trackApiCall(endpoint, method, statusCode, responseTime) {
  // Enviar a Google Analytics o servicio similar
  gtag('event', 'api_call', {
    endpoint: endpoint,
    method: method,
    status: statusCode,
    response_time: responseTime,
  });
}
```

## Seguridad

### Mejores Prácticas

1. **Usar HTTPS siempre**
2. **Rotar tokens regularmente**
3. **Implementar rate limiting**
4. **Validar todos los inputs**
5. **Mantener logs de auditoría**

### Headers de Seguridad

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

## Troubleshooting

### Error: CORS no configurado

**Solución**: Agregar headers CORS en API Connect

```yaml
cors:
  enabled: true
  allow-origins:
    - '*' # Solo para desarrollo, especificar en producción
```

### Error: Token inválido

**Solución**: Verificar configuración OAuth

```bash
apic oauth-providers:list --server <server>
apic oauth-providers:get <provider-name>
```

### Error: 404 en endpoints

**Solución**: Verificar que el producto esté publicado

```bash
apic products:list --catalog sandbox --server <server>
```

## Recursos Adicionales

- [IBM API Connect Documentation](https://www.ibm.com/docs/en/api-connect)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Diners Club Developer Community](https://community.dinersclub.com)

## Soporte

Para asistencia técnica:

- 📧 api-support@dinersclub.com
- 🎫 Portal de soporte: https://support.dinersclub.com
- 📞 +1-800-DINERS-API

---

**Última actualización**: Diciembre 2025
