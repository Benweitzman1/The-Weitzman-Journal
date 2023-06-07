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

function Post({
  postId,
  postTitle,
  postContent,
  Tags,
  handleAddTagClick,
  handleTagClick,
  selectedTagId,
  userId,
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
          >
            <ClappingIcon
              didUserClappedOnPost={didUserClappedOnPost}
              dataTestId={`postClappingIcon-${postId}`}
            />
          </IconButton>
          <Typography variant='string' data-testid={`postClapsNum-${postId}`}>
            0
          </Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
}

export default Post;
