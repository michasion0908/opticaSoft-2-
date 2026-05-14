import './css/Navbar.css'; // Archivo de estilos personalizado
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom'; 

function OffcanvasNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand={false} fixed="top">
      <Container fluid>
        <Navbar.Brand href="#">Optica Mayren</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="bg-dark text-light"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* Barra de búsqueda 
            <form className="mb-3">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                aria-label="Buscar"
              />
            </form> */}

            {/* Menú scrollable con categorías */}
            <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
              <h5>Categorías</h5>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/">Login</Nav.Link>
                <Nav.Link as={Link} to="/home">Inicio</Nav.Link>
                <Nav.Link as={Link} to="/Pacientes">Ver Pacientes</Nav.Link>
                <Nav.Link as={Link} to="/Optometrista">Optometrista</Nav.Link>
              </Nav>

              <hr />

              <h5>Inventario</h5>
              <Nav className="flex-column">
              <Nav.Link as={Link} to="/Inventario">Armazones</Nav.Link>

              
              </Nav>

              <hr />

              <h5>Otros</h5>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/Edificio">..</Nav.Link>
                <Nav.Link as={Link} to="/Aula">..</Nav.Link>
              </Nav>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default OffcanvasNavbar;
