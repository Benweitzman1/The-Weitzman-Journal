const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');

const { baseUrl, maxNumOfClapsPerUserPerPost } = require('../constants');
const { Posts } = require('./model/Posts');
const { Tags, updatedTags } = require('./model/Tags');
const { Users } = require('./model/Users');

const app = express();
const port = 3080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const corsOptions = {
  origin: `${baseUrl.client}`,
  credentials: true,
};

app.get('/', cors(corsOptions), (req, res) => {
  res.send('Welcome to your Wix Enter exam!');
});

app.get('/user', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId || uuidv4();
  res.cookie('userId', userId).send({ id: userId });
});

///////////////////////////////////// Posts /////////////////////////////////////
app.get('/posts', cors(corsOptions), (req, res) => {
  console.log(req.query)
  const popularity = Number(req.query.popularity);
  const tag = req.query.tag;
  let filteredPosts = Posts

  if (popularity) {
    // TODO - implement popularity filter functionality here
    console.log({popularity})
    filteredPosts = filteredPosts.filter(post => post.postClapsCount >= popularity)
    // End of TODO
  }
  if(tag){
    console.log({tag})
    filteredPosts = filteredPosts.filter(post => Tags[tag][post.id] === true)
  }

  res.send({ Posts: filteredPosts });
});


///////////////////////////////////// Tags /////////////////////////////////////
app.get('/tags', cors(corsOptions), (req, res) => {
  res.send({ Tags });
});

app.post('/tags/tagName/:tagName', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { tagName } = req.params;
  if (Tags[tagName]) {
    res.status(400).end();
    return;
  }
  Tags[tagName] = {};
  res.send({ Tags }).status(200).end();
});

app.post('/tags/:postId/:tagName', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { postId, tagName } = req.params;
  if (Tags[tagName]) {
    if(Tags[tagName][postId]){
      res.status(400).end();
      return;
    }
    else{
      Tags[tagName][postId] = true;
    }
  }
  else{
    res.status(403).end();
  }

  res.send({ Tags }).status(200).end();
});

// app.post('/posts/:postId', cors(corsOptions), (req, res) => {
//   console.log("11111111111111111")
//   const userId = req.cookies?.userId;
//   if (!userId) {
//     res.status(403).end();
//     return;
//   }
//   const { postId } = req.params;
//   const indexOfThePost = Posts.findIndex(post => post.id === postId);
//   Posts[indexOfThePost].claps = Object.assign(Posts[indexOfThePost].claps, {userId : 4})
//   console.log(Posts[indexOfThePost].claps)
  
//   if (!currPost) {
//     res.status(400).end();
//     return;
//   }
//   if (Posts[indexOfThePost].claps.userId){
//     if(Number(Posts[indexOfThePost].claps.userId) >= 5){
//       res.status(400).end();
//     }
//     else{
//       console.log(Posts[indexOfThePost][claps][userId]);
//       Posts[indexOfThePost][claps][userId] = Number(Posts[indexOfThePost][claps][userId]) + 1;
//       console.log(Posts[indexOfThePost][claps][userId]);
//     }
//   }

//   res.send({ Posts }).status(200).end();
// });

app.post('/posts/clap/:selectedPostId', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  console.log(userId)
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { selectedPostId } = req.params;
  const user = Users.get(userId);
  const currPost = Posts.find(post => post.id === selectedPostId);
  let isMoreThanFiveClaps = false;
  let isNewClap = true;

  if (user) {
    if (user.userPostClap.includes(selectedPostId)){
      currPost.postClapsCount -= 1;
      const index = user.userPostClap.indexOf(selectedPostId);
      if (index > -1) { // only splice array when item is found
        Users.get(userId).userPostClap.pop(selectedPostId)
      }
      Users.get(userId).clapsCount -= 1;
      isNewClap = false;
    }   

    else if (user.clapsCount >= 5) {
      console.log("More than 5")
      isMoreThanFiveClaps = true;
    }

    else{
      Users.get(userId).clapsCount += 1
      Users.get(userId).userPostClap.push(selectedPostId)
      postInd = Posts.indexOf(Posts.filter(post => post.id === selectedPostId)[0])
      Posts[postInd].postClapsCount += 1;
    }
  }
  else {
    Users.set(userId, {
      userPostClap: [selectedPostId],
      clapsCount: 1
    })
    postInd = Posts.indexOf(Posts.filter(post => post.id === selectedPostId)[0])
    Posts[postInd].postClapsCount += 1;
  }

  console.log(Users)
  
  res.send({posts : Posts, userClapsCount: Users.get(userId).clapsCount, isMoreThanFiveClaps, isNewClap }).status(200).end();
});


app.post('/posts', cors(corsOptions), (req, res) => {
  console.log("we are here")

  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  console.log("in the server")
  
  const {title, content, selectedTag} = req.body.post;
  
  let newId = 1;
  const postsIds = Posts.map(post => post.id);
  
  if (Posts.length > 0){
    const maxId = Math.max(...postsIds);
    newId = maxId + 1
  }
  
  const newPost = {id: newId, title: title, content: content, userId: userId, postClapsCount: 0};
  Posts.push(newPost);
  console.log(Posts)
  
  if (!Tags[selectedTag]) {
    Tags[selectedTag] = {}; // Create the inner object if it doesn't exist
  }

  if (selectedTag){
    console.log("selectedTag", selectedTag)
    console.log("newId",newId)
    Tags[selectedTag][newId] = true;
    console.log(Tags)
  }
 

  res.send({Posts}).status(200).end();
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
