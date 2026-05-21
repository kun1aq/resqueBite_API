const request = require("supertest");

const app = require("../src/app");

describe("Auth API", () => {

    test("GET / should return status 200", async () => {

        const response = await request(app)
            .get("/");

        expect(response.statusCode).toBe(200);

    });

    test("POST /auth/register should fail with invalid data", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                email: "wrong-email",
                password: "123"
            });

        expect(response.statusCode).toBe(422);

    });

    test("POST /auth/login should fail without credentials", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({});

        expect(response.statusCode).toBe(422);

    });

});