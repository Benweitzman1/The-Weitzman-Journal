# Welcome to your Wix Enter exam

## Prerequisites:
- NPM (version 8 or 9)
- Node (version 18)

## Instructions
- open a terminal and navigate to this project's dir
- run `npm install` (in case of errors check the troubleshooting section of this README)
- run `npm start`
- to check out example tests run `npm test` while your app is running

## Submitting exam instructions
When you're ready to submit your exam:
1. Open the project's directory in your terminal
2. Delete `node_modules`
   1. run `rm -rf node_modules`
   2. run `rm -rf client/node_modules`
   3. run `rm -rf server/node_modules`
3. zip your project's directory
4. email your zip file to `wixenter@wix.com`
   1. You should preferably send this email from the email you used to apply to Wix Enter
   2. The title should be `Wix Enter exam submission - {Your full name}`
   3. The content should include `email: {The email address you used for your application}`

## Requirements:

### Tags:

1. Implement the add tag functionality to a post. You'll notice that currently the “+” sign to add a tag to a post will open a Select component with hardcoded options, but clicking on them will do nothing. 
> you can look at the tags list implementation (for both the **client** and **server** side) for an example. 

### Claps - Part 1:
1. Implement claps behavior - up to 5 claps per user are allowed
> note that the `userId` of any api call is already available for you as a cookie on the **server** side.
### Filter:

1. By popularity - clicking on popularity from the menu should change the url and show only posts with higher popularity (claps). Currently clicking on a dropdown item will redirect but no filtering will occur
2. By tag - Clicking on a tag from the tags list, or from a post's tags should change the url and show only posts with the selected tag. Currently clicking on them does nothing
3. Support filtering by both tag and popularity by url, for example `tag=frontend&popularity=20`. If a user clicks on a tag from the tags list, and then on popularity, both should be in the url
4. Mark the selected tag and/or popularity option using the components' apis, selected tag color should be `primary`.

### Add post:

1. Clicking on the submit button should not submit anything if required fields are empty. Instead an empty required field should indicate an error
2. Use actual tags instead of hardcoded ones
3. Should submit when all required fields are filled, and then redirect to the home page
4. Bonus - limit the title to 100 characters and show an error message for longer values

### Claps - Part 2:

1. Add a `My Claps` button to the header menu, should have `data-testid=myClapsBtn`. Clicking on that button will filter only posts that the user clapped for, and not other users. To simulate multiple users, you can just browse the app from different browsers, or clear the user cookie
2. Bonus - claps button should support debounce behavior with 500ms
3. Bonus - provide an ellipsis solution for content longer than 300 characters with a read more button. Read more button should have `data-testid=postContent-readMoreButton`
