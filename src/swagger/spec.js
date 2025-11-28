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
  ],
  paths: {
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
