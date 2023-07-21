import { List } from '@mui/material';
import FloatingMenu from '../components/FloatingMenu';
import TagsCloud from '../components/TagsCloud';
import Post from '../components/Post';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  selectedTagQuery,
  selectedTagQueryToFilter,
  validClap
  // selectedPostIdAfterUpdate,
  // postsAfterUpdate
  //got till here, show Daniel
}) {

  const [searchParams, setSearchParams] = useSearchParams();

  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedPostId, setSelectedPostId] = useState(null);

  // const [selectedTagQuery, setSelectedTagQuery] = useState('');


  ///////////////////////////////////// handle query param /////////////////////////////////////
  searchParams.get('popularity');

  useEffect(() => {
    const searchParams = new URLSearchParams();
  
    if (selectedPopularityQuery !== '') {
      searchParams.set('popularity', selectedPopularityQuery);
    }
  
    if (selectedTagQuery !== '') {
      searchParams.set('tag', selectedTagQuery);
    }
  
    setSearchParams(searchParams.toString());
  }, [selectedPopularityQuery, selectedTagQuery, setSearchParams]);


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
  // const handleClapsClick = (selectedPostId) => {
  //   console.log("11111111111111111111111111")
  //   console.log(selectedPostId)
  //   handleAddClapToPost(selectedPostId);
  // };
  
  
  const handleClapsClick = (selectedPostId) => {
      console.log({selectedPostId})
      handleAddClapToPost(selectedPostId);
  };
    


  
  const handleTagClick = (tagName, tagId) => {
    // console.log(tagName)
    // setSelectedTagQuery(tagName);
    selectedTagQueryToFilter(tagName)
    // setSelectedTagQuery('');
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
