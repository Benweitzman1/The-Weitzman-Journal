// @ts-check
const { test, expect } = require("@playwright/test");
const { baseUrl } = require('../../constants');
   
test("should render a new post with data-testid", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${baseUrl.client}/add-new-post`);
    await context.addCookies([{ name: "userId", value: "12", url: `${baseUrl.client}`}]);
        
    await page.locator("#addNewPost-postTitleInput").fill("Example Title For The Test");
    await page.locator("#addNewPost-postContentInput").fill("Example Content For The Test");
    await page.getByTestId('addNewPost-submitBtn').click();

    await page.goto(`${baseUrl.client}`);

    const newPost = page.getByRole('listitem').last();
    await expect(newPost).toHaveAttribute("data-testid", /post-/);
        
    const title = page.getByText('Example Title For The Test');
    await expect(title).toHaveAttribute("data-testid", /postTitle-/);
        
    const content = page.getByText('Example Content For The Test');
    await expect(content).toHaveAttribute("data-testid", /postContent-/);
});
    
test("should render a read more button with data-testid", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(baseUrl.client);
    await context.addCookies([{ name: "userId", value: "12", url: `${baseUrl.client}`}]);
        
    await expect(page.getByTestId('postContent-readMoreButton')).toBeVisible();
});
    
test("should render a My Claps button with data-testid", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(baseUrl.client);
    await context.addCookies([{ name: "userId", value: "12", url: `${baseUrl.client}`}]);
        
    await expect(page.getByTestId('myClapsBtn')).toBeVisible();
});