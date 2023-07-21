import axios from 'axios';
import './App.css';
import Home from './pages/Home';
import AddNewPost from './pages/AddNewPost';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  ButtonGroup,
  Alert,
  Snackbar,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HomeIcon from '@mui/icons-material/Home';
import FloatingMenu from './components/FloatingMenu';

function App() {
  const baseURL = 'http://localhost:3080';
  const popularityOptions = [1, 5, 20, 100];
  // const navigate = useNavigate();
  
  const [userId, setUserId] = useState('');
  
  const [selectedPopularityQuery, setSelectedPopularityQuery] = useState('');
  const [selectedTagQuery, setSelectedTagQuery] = useState('');
  
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  const [tags, setTags] = useState({});
  const [tagsList, setTagsList] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState('');
  const [validClap, setValidClap] = useState('');
  
  const [anchorEl, setAnchorEl] = useState(null);
  
  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        handleAlert('', false, '');
      }, 3500);
    }
  }, [showAlert]);

  const handleAlert = (message, isShow, type) => {
    setAlertMsg(message);
    setShowAlert(isShow);
    setAlertType(type);
  };

  ///////////////////////////////////// data request /////////////////////////////////////
  axios.defaults.withCredentials = true;
  ///////////////////// get request /////////////////////

  // sets a userId cookie
  const getUser = useCallback(() => {
    axios
      .get(`${baseURL}/user`)
      .then((response) => {
        setUserId(response.data.id);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getPosts = useCallback(() => {
    axios
      .get(`${baseURL}/posts`)
      .then((response) => {
        setAllPosts([...response.data['Posts']]);
        setFilteredPosts([...response.data['Posts']]);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getFilteredPosts = (popularity, tag) => {
    console.log("got here")
    console.log(popularity, tag)
    
    axios
      .get(`${baseURL}/posts`, {params: {
        popularity: popularity,
        tag: tag}
      })
      .then((response) => {
        setFilteredPosts([...response.data['Posts']]);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  const getTags = useCallback(() => {
    axios
      .get(`${baseURL}/tags`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  useEffect(() => {
    getPosts();
    getTags();
    getUser();
  }, [getPosts, getTags, getUser]);

  ///////////////////// post request /////////////////////


  const addPost = ( title, content, selectedTag) => {
    console.log("here2: ", title, content, selectedTag)
    axios
      .post(`${baseURL}/posts`,
        {
          post: {
            title,
            content,
            selectedTag,
          },
        },
        {
          headers: {
            // to send a request with a body as json you need to use this 'content-type'
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        const { Posts } = response.data;
        console.log(Posts)
        setAllPosts([...Posts]);
        setFilteredPosts([...Posts]);
        
        handleAlert('post was made successfully', true, 'success');});
        // navigate('/');
  };

  const addNewTag = (tagName) => {
    axios
      .post(`${baseURL}/tags/tagName/${tagName}`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
        handleAlert('Tag was added successfully', true, 'success');
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  ///////////////////////////////////// handle click events /////////////////////////////////////
  const handlePopularityClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSelectedPopularityQuery(selectedPopularityQuery);

  };

  const handleMenuClose = (selectedOption) => {
    setAnchorEl(null);
    filterPostsByPopularity(selectedOption);
  };

  const handleHomeClick = () => {
    setFilteredPosts(allPosts);
    setSelectedPopularityQuery('');
    setSelectedTagId('');
  };

  const handleAddTagToPost = (selectedPostId, selectedTag) => {

    axios
      .post(`${baseURL}/tags/${selectedPostId}/${selectedTag}`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
        handleAlert('Tag was added successfully', true, 'success');
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }

  const handleAddClapToPost = (selectedPostId) => {
    axios
      .post(`${baseURL}/posts/clap/${selectedPostId}`)
      .then((response) => {
        const { posts, userClapsCount, isMoreThanFiveClaps, isNewClap} = response.data;
        console.log(posts, userClapsCount)
        console.log({isMoreThanFiveClaps}, {isNewClap})
        setAllPosts([...posts]);
        setFilteredPosts([...posts]);
        
        if(isMoreThanFiveClaps === false && isNewClap === true){
          handleAlert('clap was made successfully', true, 'success');
        }
        else if(isMoreThanFiveClaps === true && isNewClap === true){
          console.log("more than 5")
          handleAlert('You have reached the maximum number of claps.\nYou cannot clap for more than 5 posts', true, 'error');
        }
        console.log("App.js - handleAddClapToPost: ", { isMoreThanFiveClaps });
        setValidClap(!isMoreThanFiveClaps)
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }


  ///////////////////////////////////// filters /////////////////////////////////////
  const filterPostsByPopularity = (minClapsNum) => {
    setSelectedPopularityQuery(`${minClapsNum}`);
    getFilteredPosts(minClapsNum, selectedTagQuery);
  };


  const selectedTagQueryToFilter = (selectedTagQueryToFilter) => {
    setSelectedTagQuery(selectedTagQueryToFilter)
    getFilteredPosts(selectedPopularityQuery, selectedTagQueryToFilter)
  }
  ///////////////////////////////////// render components /////////////////////////////////////
  const renderToolBar = () => {
    return (
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              href='/'
              size='large'
              onClick={handleHomeClick}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              href='/add-new-post'
              size='large'
              startIcon={<AddCircleIcon />}
            >
              Add A New Post
            </Button>
          </ButtonGroup>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Enter 2023 Blog Exam
          </Typography>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              size='large'
              startIcon={<FilterAltIcon />}
              onClick={(e) => handlePopularityClick(e)}
              data-testid='popularityBtn'
              className={
                window.location.href !== 'http://localhost:3000/add-new-post'
                  ? ''
                  : 'visibilityHidden'
              }
            >
              filter by Popularity
            </Button>
          </ButtonGroup>
          <FloatingMenu
            menuOptions={popularityOptions}
            anchorElement={anchorEl}
            handleMenuClose={handleMenuClose}
          />
        </Toolbar>
      </AppBar>
    );
  };

  return (
    <div className='App'>
      {renderToolBar()}
      {showAlert && (
        <Snackbar open={true} data-testid='alert-snackbar'>
          <Alert severity={alertType} data-testid='alert'>
            {alertMsg}
          </Alert>
        </Snackbar>
      )}
      <Router>
        <Routes>
          <Route
            path='/add-new-post'
            element={<AddNewPost
              handleAddPost={addPost}
              addPost={addPost}
              />}
          />
          <Route
            path='/'
            element={
              <Home
                Posts={filteredPosts}
                Tags={tags}
                tagsList={tagsList}
                handleAddNewTag={addNewTag}
                selectedTagId={selectedTagId}
                selectedPopularityQuery={selectedPopularityQuery}
                userId={userId}
                handleAddTagToPost={handleAddTagToPost}
                handleAddClapToPost={handleAddClapToPost}
                selectedTagQueryToFilter={selectedTagQueryToFilter}
                validClap={validClap}
                // selectedPostId={selectedPostId}
                // posts={posts}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
