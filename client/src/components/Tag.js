import { Fab } from '@mui/material';
import { useState } from 'react';

function Tag({ tagName, postId, handleTagClick, selectedTagId }) {
  const dataTestId = postId ? `tag-${tagName}-${postId}` : `tag-${tagName}`;

  const [tagColor, setTagColor] = useState('default');

  const handleMarkedTag = (tagName, dataTestId) => {
    setTagColor((prevColor) => (prevColor === 'default' ? 'primary' : 'default'));
    handleTagClick(tagName, dataTestId)
  }

  return (
    <Fab
      key={tagName}
      variant='extended'
      size='small'
      disableRipple
      className='Badge'
      onClick={() => handleMarkedTag(tagName, dataTestId)}
      color={tagColor}
      data-testid={dataTestId}
    >
      {tagName}
    </Fab>
  );
}


export default Tag;
