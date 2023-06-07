import {
  ListItem,
  ListItemButton,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import ClappingIcon from './assets/ClappingIcon';
import AddTagButton from './AddTagButton';
import Tag from './Tag';
import { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3080';

function Post({
  postId,
  postTitle,
  postContent,
  Tags,
  handleAddTagClick,
  handleTagClick,
  selectedTagId,
  userId,
  clapNum
}) {
  const getTagsByPostId = (postID) => {
    const tagsArr = [];
    for (const tagName in Tags) {
      if (Tags[tagName][postID]) {
        tagsArr.push(tagName);
      }
    }
    return tagsArr;
  };
  const [clapNumber, setClapNumber] = useState(0);



  const caculateClaps = (clapArr) => {
      console.log("clpas Arr: ", clapArr)
      let claps = Object.values(clapArr).reduce((prevVal, currVal) => prevVal + currVal, 0)
      setClapNumber(claps)
    }


  useEffect(() => {
    caculateClaps(clapNum);
  },[clapNum])



  const clickClap = () => {
    axios
    .post(`${baseURL}/posts/${postId}/clap`)
    .then((response) => {
      console.log(response.data)
      caculateClaps(response.data.Posts)
      // setTags({ ...response.data['Tags'] });
      // const tagsList = [];
      // for (const tagName in response.data['Tags']) {
      //   tagsList.push(tagName);
      // }
      // setTagsList(tagsList);
      // handleAlert('Tag was added successfully', true, 'success');
    })
    .catch((error) => {
      // handleAlert(error.message, true, 'error');
    });
  }

  const tagsNameArr = getTagsByPostId(postId);
  const isTag = tagsNameArr.length > 0 ? true : false;
  const didUserClappedOnPost = false;

  return (
    <ListItem
      alignItems='flex-start'
      key={postId}
      className='post'
      data-testid={`post-${postId}`}
    >
      <Card className='post'>
        <ListItemButton disableGutters>
          <CardContent>
            <Typography
              variant='h5'
              gutterBottom
              data-testid={`postTitle-${postId}`}
            >
              {postTitle}
            </Typography>
            <Typography
              variant='body1'
              gutterBottom
              data-testid={`postContent-${postId}`}
            >
              {postContent}
            </Typography>
          </CardContent>
        </ListItemButton>
        <CardActions>
          <AddTagButton
            dataTestId={`postAddTagBtn-${postId}`}
            onClick={(e) => handleAddTagClick(e, postId)}
          />
          {isTag &&
            tagsNameArr.map((tagName) => (
              <Tag
                tagName={tagName}
                postId={postId}
                handleTagClick={handleTagClick}
                selectedTagId={selectedTagId}
              />
            ))}
          <IconButton
            aria-label='clapping'
            size='small'
            data-testid={`postClapsBtn-${postId}`}
            onClick={() => clickClap()}
          >
            <ClappingIcon
              didUserClappedOnPost={didUserClappedOnPost}
              dataTestId={`postClappingIcon-${postId}`}
            />
          </IconButton>
          <Typography variant='string' data-testid={`postClapsNum-${postId}`}>
            {clapNumber}
          </Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
}

export default Post;
