/**
 * Diners Club Developer Portal - JavaScript
 * Interactive functionality for API documentation
 */

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
  // Navigation active state
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });

          // Update active state
          navLinks.forEach((l) => l.classList.remove('active'));
          this.classList.add('active');
        }
      }
    });
  });

  // Intersection Observer for nav highlighting
  const sections = document.querySelectorAll('.section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
});

/**
 * Toggle API Details
 * Expands/collapses API endpoint details
 */
function toggleApiDetails(button) {
  const apiCard = button.closest('.api-card');
  const details = apiCard.querySelector('.api-details');

  if (details.classList.contains('visible')) {
    details.classList.remove('visible');
    button.classList.remove('expanded');
  } else {
    details.classList.add('visible');
    button.classList.add('expanded');
  }
}

/**
 * Switch between tabs in API details
 */
function switchTab(button, tabName) {
  const apiCard = button.closest('.api-card');
  const tabs = apiCard.querySelectorAll('.tab-btn');
  const contents = apiCard.querySelectorAll('.tab-content');

  // Remove active class from all tabs
  tabs.forEach((tab) => tab.classList.remove('active'));
  contents.forEach((content) => content.classList.remove('active'));

  // Add active class to clicked tab
  button.classList.add('active');

  // Show corresponding content
  const targetContent = apiCard.querySelector(`.tab-content.${tabName}`);
  if (targetContent) {
    targetContent.classList.add('active');
  }
}

/**
 * Copy code to clipboard
 */
function copyCode(button) {
  const codeBlock = button.previousElementSibling;
  const code = codeBlock.querySelector('code').textContent;

  navigator.clipboard
    .writeText(code)
    .then(() => {
      const originalText = button.textContent;
      button.textContent = '✓ Copiado!';
      button.style.background = '#10b981';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    })
    .catch((err) => {
      console.error('Error al copiar:', err);
      button.textContent = '✗ Error';
      setTimeout(() => {
        button.textContent = 'Copiar';
      }, 2000);
    });
}

/**
 * API Category Filtering
 */
document.addEventListener('DOMContentLoaded', function () {
  const categoryBtns = document.querySelectorAll('.category-btn');
  const apiCards = document.querySelectorAll('.api-card');

  categoryBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const category = this.dataset.category;

      // Update active button
      categoryBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');

      // Filter cards
      apiCards.forEach((card) => {
        const method = card.dataset.method;

        if (category === 'all' || category === method) {
          card.style.display = 'block';
          // Add animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});

/**
 * API Playground - Send Test Request
 */
function sendTestRequest() {
  const endpointSelect = document.getElementById('endpoint-select');
  const authToken = document.getElementById('auth-token').value;
  const requestBody = document.getElementById('request-body').value;
  const responseStatus = document.getElementById('response-status');
  const responseOutput = document.getElementById('response-output');
  const environment = document.querySelector('input[name="env"]:checked').value;

  // Get selected endpoint
  const selectedEndpoint = endpointSelect.value;

  // Validate token
  if (!authToken) {
    responseOutput.innerHTML =
      '<code>{\n  "error": "Por favor ingrese un token de autorización"\n}</code>';
    responseStatus.innerHTML =
      '<span style="color: #ef4444;">Status: Error</span><span>Time: -</span>';
    return;
  }

  // Show loading state
  responseStatus.innerHTML =
    '<span style="color: #f59e0b;">Status: Loading...</span><span>Time: -</span>';
  responseOutput.innerHTML = '<code>Enviando request...</code>';

  // Simulate API call (In production, this would be a real API call)
  const startTime = Date.now();

  setTimeout(() => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    let mockResponse = {};

    // Generate mock responses based on endpoint
    switch (selectedEndpoint) {
      case 'get-accounts':
        mockResponse = {
          status: 'success',
          data: {
            accounts: [
              {
                accountId: 'ACC-123456789',
                accountNumber: '************1234',
                accountType: 'credit',
                status: 'active',
                balance: 5000.0,
                currency: 'USD',
                creditLimit: 10000.0,
                availableCredit: 5000.0,
                cardholderName: 'Juan Pérez',
                expiryDate: '12/2027',
              },
            ],
            pagination: {
              total: 1,
              limit: 10,
              offset: 0,
            },
          },
          timestamp: new Date().toISOString(),
        };
        break;

      case 'get-transactions':
        mockResponse = {
          status: 'success',
          data: {
            transactions: [
              {
                transactionId: 'TXN-987654321',
                accountId: 'ACC-123456789',
                amount: 150.0,
                currency: 'USD',
                type: 'purchase',
                status: 'completed',
                merchant: {
                  name: 'Amazon',
                  category: 'E-commerce',
                  location: 'Online',
                },
                transactionDate: '2025-12-17T15:45:00Z',
                description: 'Purchase at Amazon',
              },
            ],
            pagination: {
              total: 1,
              limit: 20,
              offset: 0,
            },
          },
          timestamp: new Date().toISOString(),
        };
        break;

      case 'post-payments':
        try {
          const body = requestBody ? JSON.parse(requestBody) : {};
          mockResponse = {
            status: 'success',
            data: {
              paymentId: 'PAY-' + Math.floor(Math.random() * 1000000000),
              accountId: body.accountId || 'ACC-123456789',
              amount: body.amount || 0,
              currency: body.currency || 'USD',
              status: 'pending',
              description: body.description || '',
              recipient: body.recipient || {},
              createdAt: new Date().toISOString(),
              estimatedCompletionTime: new Date(
                Date.now() + 300000
              ).toISOString(),
              fees: {
                amount: 5.0,
                currency: 'USD',
              },
            },
            timestamp: new Date().toISOString(),
          };
        } catch (e) {
          mockResponse = {
            status: 'error',
            error: {
              code: 'INVALID_JSON',
              message: 'El cuerpo de la solicitud no es un JSON válido',
              details: [{ field: 'body', message: e.message }],
            },
            timestamp: new Date().toISOString(),
          };
        }
        break;

      case 'post-cards':
        try {
          const body = requestBody ? JSON.parse(requestBody) : {};
          mockResponse = {
            status: 'success',
            data: {
              applicationId: 'APP-' + Math.floor(Math.random() * 1000000000),
              cardType: body.cardType || 'gold',
              status: 'under_review',
              applicant: body.applicant || {},
              submittedAt: new Date().toISOString(),
              estimatedDecisionDate: new Date(
                Date.now() + 172800000
              ).toISOString(),
              nextSteps: [
                'Verificación de identidad',
                'Evaluación crediticia',
                'Aprobación final',
              ],
              requiredDocuments: ['Copia de cédula', 'Comprobante de ingresos'],
            },
            timestamp: new Date().toISOString(),
          };
        } catch (e) {
          mockResponse = {
            status: 'error',
            error: {
              code: 'INVALID_JSON',
              message: 'El cuerpo de la solicitud no es un JSON válido',
              details: [{ field: 'body', message: e.message }],
            },
            timestamp: new Date().toISOString(),
          };
        }
        break;
    }

    // Display response
    const statusColor =
      mockResponse.status === 'success' ? '#10b981' : '#ef4444';
    const statusCode =
      mockResponse.status === 'success' ? '200 OK' : '400 Bad Request';

    responseStatus.innerHTML = `
            <span style="color: ${statusColor};">Status: ${statusCode}</span>
            <span>Time: ${responseTime}ms</span>
        `;

    responseOutput.innerHTML =
      '<code>' + JSON.stringify(mockResponse, null, 2) + '</code>';

    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-copy';
    copyBtn.textContent = 'Copiar';
    copyBtn.onclick = function () {
      copyCode(this);
    };
    responseOutput.querySelector('pre').appendChild(copyBtn);
  }, 800); // Simulate network delay
}

/**
 * Initialize endpoint selector with example body
 */
document.addEventListener('DOMContentLoaded', function () {
  const endpointSelect = document.getElementById('endpoint-select');
  const requestBodyTextarea = document.getElementById('request-body');

  if (endpointSelect && requestBodyTextarea) {
    endpointSelect.addEventListener('change', function () {
      const endpoint = this.value;

      let exampleBody = '';

      if (endpoint === 'post-payments') {
        exampleBody = `{
  "accountId": "ACC-123456789",
  "amount": 500.00,
  "currency": "USD",
  "description": "Payment to supplier",
  "recipient": {
    "name": "Acme Corp",
    "accountNumber": "9876543210",
    "bankCode": "BANK001"
  }
}`;
      } else if (endpoint === 'post-cards') {
        exampleBody = `{
  "cardType": "gold",
  "applicant": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "phone": "+593987654321",
    "dateOfBirth": "1990-05-15",
    "nationalId": "1234567890"
  },
  "address": {
    "street": "Av. Amazonas 123",
    "city": "Quito",
    "state": "Pichincha",
    "country": "Ecuador",
    "postalCode": "170150"
  },
  "employment": {
    "status": "employed",
    "income": 3000,
    "employer": "Tech Corp"
  }
}`;
      } else {
        exampleBody = '';
      }

      requestBodyTextarea.value = exampleBody;
    });
  }
});

/**
 * Add smooth hover effects to cards
 */
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll(
    '.feature-card, .support-card, .api-card'
  );

  cards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });
});

/**
 * Console welcome message
 */
console.log(
  '%c🏆 Diners Club Developer Portal',
  'font-size: 20px; color: #D4AF37; font-weight: bold;'
);
console.log(
  '%c¡Bienvenido al portal de desarrolladores!',
  'font-size: 14px; color: #002B5B;'
);
console.log(
  '%cVisita https://api.dinersclub.com para más información',
  'font-size: 12px; color: #6b7280;'
);
