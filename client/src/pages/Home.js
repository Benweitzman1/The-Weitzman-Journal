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
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [anchorEl, setAnchorEl] = useState(null);

  ///////////////////////////////////// handle query param /////////////////////////////////////
  searchParams.get('popularity');

  useEffect(() => {
    if (selectedPopularityQuery !== '') {
      setSearchParams({ popularity: `${selectedPopularityQuery}` });
    }
  }, [selectedPopularityQuery, setSearchParams]);

  ///////////////////////////////////// handle tag click /////////////////////////////////////
  const handleAddTagClick = (event, selectedPostId) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (selectedOption) => {
    setAnchorEl(null);
  };

  const handleTagClick = (tagName, tagId) => {};

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
