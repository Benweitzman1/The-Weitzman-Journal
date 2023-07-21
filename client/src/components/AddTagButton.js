import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function AddTagButton({ dataTestId, onClick }) {
  return (
    <Fab
      variant='extended'
      size='small'
      disableRipple
      className='Badge'
      onClick={onClick}
      data-testid={dataTestId}
    >
      <Tooltip title='add a tag' arrow placement='top'>
        <AddIcon color='action' />
      </Tooltip>
    </Fab>
  );
}

export default AddTagButton;
