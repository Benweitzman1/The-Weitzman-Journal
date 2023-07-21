import { MenuItem, Menu } from '@mui/material';

function FloatingMenu({ menuOptions, anchorElement, handleMenuClose }) {
  const open = Boolean(anchorElement);

  const handleClose = (selectedOption, optionId) => {
    const option = menuOptions.includes(selectedOption) ? selectedOption : '';
    handleMenuClose(option);
  };

  return (
    <Menu
      id='positioned-menu'
      data-testid='positioned-menu'
      aria-labelledby='positioned-button'
      anchorEl={anchorElement}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {menuOptions.map((option) => {
        const optionId = `positioned-menu-${option}`;
        return (
          <MenuItem
            selected={false}
            key={option}
            value={option}
            onClick={() => handleClose(option, optionId)}
            data-testid={optionId}
          >
            {option}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

export default FloatingMenu;
