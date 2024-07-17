import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BiSolidHide, BiSolidShow  } from "react-icons/bi";

const Login = () => {
    const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading  } = useContext(AuthContext);
    const handleChange = (event) => {
        updateLoginInfo({...loginInfo, [event.target.name]: event.target.value})
    }
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    return (
        <>
        <Form onSubmit={loginUser}>
        <Row style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "20%"
        }}>
        <Col xs={7}>
        <Stack gap={3}>
            <h2 className="text-center">Login</h2>
            <Form.Group controlId="email">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Form.Label style={{minWidth: '77px'}}>Email: </Form.Label>
                <Form.Control
                    name="email"
                    type="email"
                    placeholder="example@email"
                    value={loginInfo.email}
                    onChange={handleChange}
                />
                </div>
            </Form.Group>

            <Form.Group controlId="password">
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Form.Label style={{minWidth: '77px'}}>Password: </Form.Label>
                    <Form.Control
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="********"
                        value={loginInfo.password}
                        onChange={handleChange}
                    />
                    <Button variant="secondary" onClick={togglePasswordVisibility}>
                        {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                    </Button>
                </div>
            </Form.Group>



            <Button variant="primary" type="submit" disabled={isLoginLoading}>
            {isLoginLoading ? "Logging in" : "Login"}
            </Button>
            { loginError && (<Alert variant="danger"><p>{ loginError?.message }</p></Alert>)}
        </Stack>
        </Col>
        </Row>
        </Form>
        </>
    );
}
 
export default Login;