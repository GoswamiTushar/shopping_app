import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function loading() {

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: 999 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}