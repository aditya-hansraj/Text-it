import { useContext } from 'react';
import { Container, Nav, Navbar, Stack, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import Notification from './chat/Notification';

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    return (
        <Navbar bg='dark' className='mb-4' style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to='/' className='link-light text-decoration-none'>Text-it</Link>
                </h2>
                {user && <span className='text-warning'>Logged in as {user?.name}</span>}
                <Nav>
                    <Stack direction='horizontal' gap="3">
                        {
                            !user && (<>
                            <Link to='/login' className='link-light text-decoration-none'>Login</Link>
                            <Link to='/register' className='link-light text-decoration-none'>Register</Link>
                            </>)
                        }
                        {user && <Notification />}
                        {user && <Button onClick={() => {logoutUser()}} className='btn-warning'>logout</Button>}
                    </Stack>
                </Nav>
            </Container>
        </Navbar> 
    );
}
 
export default NavBar;