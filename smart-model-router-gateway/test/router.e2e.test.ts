import test from "node:test";
import assert from "node:assert";
import {createServer} from "../src/server.ts";
import { config } from "../src/config.ts";
import { type LLMResponse, OpenRouterService } from "../src/openrouterService.ts";


console.assert(process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY is not set in environment variables");

test("routes to cheapest model by default", async () => {
    const customConfig = {
        ...config,
        provider:{
            ...config.provider,
            sort:{
                ...config.provider.sort,
                by:"price",
            }
        }
    }
    const routerService = new OpenRouterService(customConfig);
    const app = createServer(routerService);

    const response = await
    app.inject({
        method: 'POST',
        url: '/chat',
        body:{ question: "What is the capital of France?" }
    })

    assert.equal(response.statusCode, 200, "Expected status code 200");
    const responseBody =response.json() as LLMResponse;
    assert.ok(responseBody.model, "Response should contain a model field");
    assert.ok(responseBody.content, "Response should contain a content field");

    assert.equal(responseBody.model, "openrouter/hunter-alpha", "Expected model to be openrouter/hunter-alpha");
});


test.todo("routes to highest throughput model by default")