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
  res.send('Welcome to The Weitzman Journal!');
});

app.get('/user', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId || uuidv4();
  res.cookie('userId', userId).send({ id: userId });
});

///////////////////////////////////// Posts /////////////////////////////////////
app.get('/posts', cors(corsOptions), (req, res) => {
  console.log(req.query)
  const popularity = Number(req.query.popularity);
  const tags = req.query.tags;
  console.log(tags)
  
  let filteredPosts = Posts

  if (popularity) {
    console.log({popularity})
    filteredPosts = filteredPosts.filter(post => post.postClapsCount >= popularity)
  }
  if (tags) {
    if (Array.isArray(tags)) {
      filteredPosts = filteredPosts.filter((post) => {
        return tags.every((tag) => Tags[tag] && Tags[tag][post.id]);
      });
    } else {
      filteredPosts = filteredPosts.filter((post) => Tags[tags] && Tags[tags][post.id]);
    }
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
      newPost = Posts.filter(post => post.id === selectedPostId)[0]
      newPostInd = Posts.indexOf(newPost)
      console.log("----------------------------------------------------------")
      console.log({selectedPostId})
      console.log("----------------------------------------------------------")
      console.log({newPost})
      console.log("----------------------------------------------------------")
      console.log({newPostInd})
      console.log("----------------------------------------------------------")
      console.log(Posts)
      console.log("----------------------------------------------------------")
      console.log(Posts[newPostInd])
      console.log("----------------------------------------------------------")
      console.log(Posts[newPostInd].postClapsCount)
      console.log("----------------------------------------------------------")
      Posts[newPostInd].postClapsCount += 1;
    }
  }
  else {
    Users.set(userId, {
      userPostClap: [selectedPostId],
      clapsCount: 1
    })
    newPostInd = Posts.indexOf(Posts.filter(post => post.id === selectedPostId)[0])
    Posts[newPostInd].postClapsCount += 1;
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

  strNewId = '' + newId
  console.log({strNewId})
  
  const newPost = {id: strNewId, title: title, content: content, userId: userId, postClapsCount: 0};
  Posts.push(newPost);
  console.log(Posts)
  
  if (!Tags[selectedTag]) {
    Tags[selectedTag] = {}; // Create the inner object if it doesn't exist
  }

  if (selectedTag){
    console.log({selectedTag})
    console.log({newId})
    Tags[selectedTag][newId] = true;
    console.log(Tags)
  }
 

  res.send({Posts}).status(200).end();
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
