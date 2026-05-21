const request = require("supertest");

const app = require("../src/app");

describe("Listings API", () => {

    test("GET /listings should return listings", async () => {

        const response = await request(app)
            .get("/listings");

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

    });

});