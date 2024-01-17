import Container from '@mui/material/Container';
import LoginForm from './login-form';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '600px',
    height: '90svh',
    maxHeight: '700px'
  }
}

const page = () => {
  return (
    <Container disableGutters maxWidth={false} sx={styles.root}>
      <LoginForm/>
    </Container>
  )
}

export default page