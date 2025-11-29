const spec = {
  openapi: "3.0.3",
  info: {
    title: "Auth & User API",
    version: "1.0.0",
    description:
      "API для реєстрації, логіну та отримання даних поточного користувача",
  },
  servers: [{ url: "http://localhost:3000", description: "Local server" }],
  tags: [
    { name: "Auth", description: "Реєстрація, вхід та вихід користувача" },
    { name: "Users", description: "Інформація про користувачів" },
    { name: "Booking", description: "Бронювання симуляторів" },
  ],
  // Всі маршрути знаходяться тут
  paths: {
    // --- AUTH ---
    "/register": {
      post: {
        tags: ["Auth"],
        summary: "Реєстрація нового користувача (логін + пароль + ім'я)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  login: {
                    type: "string",
                    example: "380991112233 або email@test.com",
                  },
                  password: {
                    type: "string",
                    minLength: 8,
                    example: "P@ssw0rd1",
                  },
                  firstName: { type: "string", example: "Ivan" },
                },
                required: ["login", "password", "firstName"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Користувач зареєстрований успішно",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Користувач зареєстрований успішно",
                    },
                    user: {
                      type: "object",
                      example: {
                        _id: "123",
                        firstName: "Ivan",
                        phone: "380991112233",
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Логін вже використовується" },
          500: { description: "Внутрішня помилка сервера" },
        },
      },
    },
    "/login": {
      post: {
        tags: ["Auth"],
        summary: "Логін користувача (логін + пароль)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  login: {
                    type: "string",
                    example: "380991112233 або email@test.com",
                  },
                  password: { type: "string", example: "P@ssw0rd1" },
                },
                required: ["login", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Вхід успішний",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Вхід успішний" },
                    user: {
                      type: "object",
                      example: {
                        _id: "123",
                        firstName: "Ivan",
                        phone: "380991112233",
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Невірний логін або пароль" },
          500: { description: "Внутрішня помилка сервера" },
        },
      },
    },
    "/logout": {
      post: {
        tags: ["Auth"],
        summary: "Вихід користувача, очищення cookies",
        responses: {
          200: {
            description: "Вихід виконано",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Вихід виконано" },
                  },
                },
              },
            },
          },
          500: { description: "Внутрішня помилка сервера" },
        },
      },
    },

    // --- USER ---
    "/user/me": {
      get: {
        tags: ["Users"],
        summary: "Отримати поточного авторизованого користувача",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "Дані користувача",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Інформація про користувача",
                    },
                    user: {
                      type: "object",
                      example: {
                        _id: "123",
                        firstName: "Ivan",
                        phone: "380991112233",
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Не авторизований" },
          500: { description: "Внутрішня помилка сервера" },
        },
      },
    },

    // --- BOOKING (Перенесено з components у paths) ---
    "/booking": {
      post: {
        tags: ["Booking"],
        summary: "Створити нове бронювання (для авторизованого або гостя)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  simulatorId: {
                    type: "string",
                    example: "692b26451453a98452c446eb",
                  },
                  startTime: {
                    type: "string",
                    format: "date-time",
                    example: "2025-12-01T14:00:00.000Z",
                  },
                  endTime: {
                    type: "string",
                    format: "date-time",
                    example: "2025-12-01T15:00:00.000Z",
                  },
                  comment: { type: "string", example: "Додатково" },
                  name: { type: "string", example: "Petro" },
                  email: { type: "string", example: "petro@test.com" },
                  phone: { type: "string", example: "380991112233" },
                },
                required: ["simulatorId", "startTime", "endTime"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Бронювання створено успішно",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Бронювання створено" },
                    booking: { type: "object" },
                  },
                },
              },
            },
          },
          400: { description: "Помилка валідації або перекриття бронювання" },
          404: { description: "Симулятор не знайдено" },
        },
      },
      get: {
        tags: ["Booking"],
        summary: "Отримати всі бронювання (треба бути адміністратором)",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "Список всіх бронювань",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bookings: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
          401: { description: "Не авторизований" },
          500: { description: "Внутрішня помилка сервера" },
        },
      },
    },

    "/booking/me": {
      get: {
        tags: ["Booking"],
        summary: "Отримати свої бронювання",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "Список бронювань користувача",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bookings: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
          401: { description: "Не авторизований" },
        },
      },
    },

    "/booking/{id}": {
      patch: {
        tags: ["Booking"],
        summary: "Оновити бронювання (для адміністратора)",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "Підтверджено" },
                  comment: { type: "string", example: "Змінено адміном" },
                  startTime: { type: "string", format: "date-time" },
                  endTime: { type: "string", format: "date-time" },
                  price: { type: "number", example: 300 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Бронювання оновлено",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    booking: { type: "object" },
                  },
                },
              },
            },
          },
          404: { description: "Бронювання не знайдено" },
        },
      },
    },

    "/simulators/{id}/availability-slots": {
      get: {
        tags: ["Booking"],
        summary: "Отримати слоти доступності симулятора на день",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "date",
            in: "query",
            required: true,
            schema: { type: "string", format: "date" },
          },
        ],
        responses: {
          200: {
            description: "Список слотів із позначкою зайнятості",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    date: { type: "string", format: "date" },
                    slots: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          startTime: { type: "string", format: "date-time" },
                          endTime: { type: "string", format: "date-time" },
                          booked: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Не вказано дату" },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "sessionId",
      },
    },
  },
};

export default spec;
