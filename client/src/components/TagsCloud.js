import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Container,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
} from '@mui/material';
import Tag from '../components/Tag';
import AddTagButton from '../components/AddTagButton';
import { useState } from 'react';

function TagsCloud({
  tagsList,
  handleAddNewTag,
  selectedTagId,
  handleTagClick,
}) {
  const [isNewTag, setIsNewTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  ///////////////////////////////////// handle new tag /////////////////////////////////////
  const handleNewTagClick = () => {
    setIsNewTag(true);
  };

  const handleSubmit = () => {
    handleAddNewTag(newTag);
    setIsNewTag(false);
    setNewTag('');
  };

  ///////////////////////////////////// render components /////////////////////////////////////
  return (
    <Container
      maxWidth='xs'
      className='tagsListContainer'
      data-testid='tagList'
    >
      <Typography variant='h5' data-testid='tagList-title'>
        Tags List
      </Typography>
      <Divider />
      <Box className='tagsList'>
        {tagsList.map((tagName) => (
          <Tag
            tagName={tagName}
            postId=''
            handleTagClick={handleTagClick}
            selectedTagId={selectedTagId}
          />
        ))}
        <AddTagButton
          dataTestId={`tagList-AddTagBtn`}
          onClick={handleNewTagClick}
        />
        {isNewTag && (
          <Card
            component='form'
            sx={{ minWidth: '100%' }}
            data-testid='tagList-newTag-card'
          >
            <CardContent className='formFields'>
              <FormControl sx={{ minWidth: '90%' }}>
                <InputLabel
                  htmlFor='new-tag-field'
                  data-testid='tagList-newTag-inputLabel'
                >
                  Tag
                </InputLabel>
                <OutlinedInput
                  id='tagList-newTagInput'
                  label='Tag'
                  fullWidth
                  value={newTag}
                  onChange={(event) => {
                    setNewTag(event.target.value);
                  }}
                  data-testid='tagList-newTag-input'
                />
              </FormControl>
            </CardContent>
            <CardActions>
              <Button
                variant='contained'
                size='large'
                onClick={handleSubmit}
                data-testid='tagList-newTag-submitBtn'
              >
                submit
              </Button>
            </CardActions>
          </Card>
        )}
      </Box>
    </Container>
  );
}

export default TagsCloud;
