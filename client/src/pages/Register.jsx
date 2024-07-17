import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BiSolidHide, BiSolidShow  } from "react-icons/bi";

const Register = () => {
    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);
    const handleChange = (event) => {
        updateRegisterInfo({...registerInfo, [event.target.name]: event.target.value})
    }
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
      
    return (
    <>
    <Form onSubmit={ registerUser }>
    <Row style={{
        height: "100vh",
        justifyContent: "center",
        paddingTop: "20%"
    }}>
    <Col xs={7}>
    <Stack gap={3}>
        <h2 className="text-center">Register</h2>
        <Form.Group controlId="name">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Form.Label style={{minWidth: '77px'}}>Name: </Form.Label>
                <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={registerInfo.name}
                    onChange={handleChange}
                />
            </div>
        </Form.Group>

        <Form.Group controlId="email">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Form.Label style={{minWidth: '77px'}}>Email: </Form.Label>
                <Form.Control
                    name="email"
                    type="email"
                    placeholder="example@email"
                    value={registerInfo.email}
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
                    value={registerInfo.password}
                    onChange={handleChange}
                />
                <Button variant="secondary" onClick={togglePasswordVisibility}>
                {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                </Button>
            </div>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isRegisterLoading}>
            {isRegisterLoading ? "Creating User" : "Register"}
        </Button>
        { registerError && (<Alert variant="danger"><p>{ registerError?.message }</p></Alert>)}
    </Stack>
    </Col>
    </Row>
    </Form>
    </>
    );
}

export default Register;