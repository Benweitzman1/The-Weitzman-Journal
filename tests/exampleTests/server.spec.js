// @ts-check
const { test, expect } = require("@playwright/test");
const { baseUrl } = require('../../constants');

test("Server - should add the new post successfully with status 200", async ({ request }) => {
  const posts = await request.post(`${baseUrl.server}/posts`, {
    data: { post : { id: "18", title: "Example Title 18", content: "Example content 18" } },
    headers: {
      Cookie: "userId=11"
    }
  });
  expect(posts.ok()).toBeTruthy();
  expect(posts.status()).toBe(200);
});
