import { List } from '@mui/material';
import FloatingMenu from '../components/FloatingMenu';
import TagsCloud from '../components/TagsCloud';
import Post from '../components/Post';
import { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';

function Home({
  Posts,
  Tags,
  tagsList,
  handleAddNewTag,
  selectedTagId,
  selectedPopularityQuery,
  userId,
  handleAddTagToPost,
  handleAddClapToPost,
  selectedTagQueryToFilter,
  validClap,
  // selectedTagQuery
  // selectedPostIdAfterUpdate,
  // postsAfterUpdate
  //got till here, show Daniel
}) {

  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedPostId, setSelectedPostId] = useState(null);

  const navigate = useNavigate();

  const [selectedTagQuery, setSelectedTagQuery] = useState('');


  ///////////////////////////////////// handle query param /////////////////////////////////////


  //########################################################
  //this one is work for one tag
  //########################################################
  // useEffect(() => {
  //   if (selectedPopularityQuery !== '' || selectedTagQuery !== '') {
  //     const newSearchParams = new URLSearchParams();
  
  //     if (selectedPopularityQuery !== '') {
  //       newSearchParams.set('popularity', `${selectedPopularityQuery}`);
  //     }
  
  //     if (selectedTagQuery !== '') {
  //       newSearchParams.set('tag', `${selectedTagQuery}`);
  //     }
  
  //     // Update the URL with the new search parameters
  //     navigate('?' + newSearchParams.toString(), { replace: true });
  //   }
  // }, [selectedPopularityQuery, selectedTagQuery, navigate]);

  useEffect(() => {
    if (selectedPopularityQuery !== '' || selectedTagQuery.length > 0) {
      const searchParams = new URLSearchParams();
      if (selectedPopularityQuery !== '') {
        searchParams.set('popularity', selectedPopularityQuery);
      }
      if (selectedTagQuery.length > 0) {
        selectedTagQuery.forEach((tag) => searchParams.append('tag', tag));
      }

      navigate(`/?${searchParams.toString()}`, { replace: true });
    }

    selectedTagQueryToFilter(selectedTagQuery);
  }, [selectedPopularityQuery, selectedTagQuery, navigate]);


  const createSearchParams = () => {
    const searchParams = new URLSearchParams();
    if (selectedPopularityQuery !== '') {
      searchParams.set('popularity', selectedPopularityQuery);
    }
    if (selectedTagQuery.length > 0) {
      selectedTagQuery.forEach((tag) => searchParams.append('tag', tag));
    }
    return searchParams.toString();
  };


  ///////////////////////////////////// handle tag click /////////////////////////////////////
  const handleAddTagClick = (event, selectedPostId) => {
    setAnchorEl(event.currentTarget);
    console.log("post id: ", selectedPostId);
    setSelectedPostId(selectedPostId);
  };
  
  const handleMenuClose = (selectedOption) => {
    setAnchorEl(null);
    console.log("selectedOption: ", selectedOption);
    handleAddTagToPost(selectedPostId, selectedOption);
    setSelectedPostId(null);

  };
  
  
  const handleClapsClick = (selectedPostId) => {
      console.log({selectedPostId})
      handleAddClapToPost(selectedPostId);
  };
    

  
  const handleTagClick = (tagName) => {
    const index = selectedTagQuery.indexOf(tagName); // Check if the tag is already selected
    if (index === -1) {
      setSelectedTagQuery((prevTags) => [...prevTags, tagName]); // Add the selected tag to the array
    } else {
      setSelectedTagQuery((prevTags) => prevTags.filter((tag) => tag !== tagName)); // Remove the tag from the array if already selected
    }
    // selectedTagQueryToFilter(selectedTagQuery); // Call selectedTagQueryToFilter after updating selectedTagQuery
  
    // Check if selectedTagQuery becomes empty after updating
    if (selectedTagQuery.length === 1 && index !== -1) {
    // If selectedTagQuery becomes empty, remove the 'tag' parameter from the URL
    navigate('/', { replace: true });
    } else {
    // If selectedTagQuery still has tags, update the URL with the new search parameters
    navigate(`/?${createSearchParams()}`, { replace: true });
    }
  };

  ///////////////////////////////////// render components /////////////////////////////////////
  return (
    <div className='container'>
      <List sx={{ width: '650px' }}>
        {Posts.map((post) => (
          <Post
            postId={post.id}
            postTitle={post.title}
            postContent={post.content}
            Tags={Tags}
            handleAddTagClick={handleAddTagClick}
            userId={userId}
            handleTagClick={handleTagClick}
            selectedTagId={selectedTagId}
            handleClapsClick={handleClapsClick}
            clapsCount={post.postClapsCount}
            validClap={validClap}
          />
        ))}
      </List>
      <TagsCloud
        tagsList={tagsList}
        handleAddNewTag={handleAddNewTag}
        selectedTagId={selectedTagId}
        handleTagClick={handleTagClick}
      />
      <FloatingMenu
        menuOptions={tagsList}
        anchorElement={anchorEl}
        handleMenuClose={handleMenuClose}
      />
    </div>
  );
}

export default Home;
