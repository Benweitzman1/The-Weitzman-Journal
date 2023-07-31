import { Fab } from '@mui/material';
import { useState } from 'react';

function Tag({ tagName, postId, handleTagClick, selectedTagId }) {
  const dataTestId = postId ? `tag-${tagName}-${postId}` : `tag-${tagName}`;

  // const [tagColor, setTagColor] = useState('default');

  // const handleMarkedTag = (tagName, dataTestId) => {
  //   setTagColor((prevColor) => (prevColor === 'default' ? 'primary' : 'default'));
  //   handleTagClick(tagName, dataTestId)
  // }

  const [tagColor, setTagColor] = useState('transparent');

  const handleMarkedTag = (tagName, dataTestId) => {
    setTagColor((prevColor) =>
      prevColor === 'transparent' ? 'var(--tag-transparent-color)' : 'transparent'
    );
    handleTagClick(tagName, dataTestId);
  };

  return (
    <Fab
      key={tagName}
      variant='extended'
      size='small'
      disableRipple
      className='Badge'
      onClick={() => handleMarkedTag(tagName, dataTestId)}
      // color={tagColor}
      style={{
        backgroundColor: tagColor,
        border: tagColor === 'transparent' ? '1px solid rgba(255, 100, 175, 0.8)' : 'none',
        boxShadow: 'none',
      }}
      data-testid={dataTestId}
    >
      {tagName}
    </Fab>
  );
}


export default Tag;
