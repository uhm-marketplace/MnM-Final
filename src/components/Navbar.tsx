'use client';

import { useSession } from 'next-auth/react';
import { Image, Nav, Navbar, NavDropdown, Container, Form, FormControl } from 'react-bootstrap';
import { BoxArrowRight, PersonCircle, Cart } from 'react-bootstrap-icons';
import { ComponentIDs } from '@/utilities/ids';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const [isClient, setIsClient] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    // Initial cart count
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItemCount(cart.length);

    // Listen for cart updates
    const updateCartCount = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItemCount(updatedCart.length);
    };

    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  if (!isClient) {
    return null; // Return nothing during initial server-side render
  }

  return (
    <>
      {/* Main Navbar with Border */}
      <Navbar expand="lg" className="border bg-light">
        <Container>
          <Navbar.Brand href="/" className="align-items-center">
            <span style={{ fontWeight: 800, fontSize: '24px', display: 'flex', alignItems: 'center' }}>
              <Image
                src="/images/manoanow1.png"
                width={50}
                height={50}
                style={{ marginRight: 10 }}
                alt="Mānoa Now Marketplace"
              />
              Mānoa Now Marketplace
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
          <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
            <Nav className="me-auto justify-content-start">
              {currentUser && (
                <Nav.Link href="/home" id={ComponentIDs.homeMenuItem}>
                  Home
                </Nav.Link>
              )}
              <Nav.Link href="/community" id={ComponentIDs.profilesMenuItem}>
                Community
              </Nav.Link>
              <Nav.Link href="/products" id={ComponentIDs.projectsMenuItem}>
                Shop Products
              </Nav.Link>
              <Nav.Link href="/reviews" id={ComponentIDs.reviewsMenuItem}>
                Reviews
              </Nav.Link>
              {currentUser && (
                <Nav.Link href="/addProducts" id={ComponentIDs.addProjectMenuItem}>
                  Sell Here
                </Nav.Link>
              )}
            </Nav>

            <Nav className="d-flex align-items-center justify-content-end">
              <Form className="d-inline me-3">
                <FormControl
                  type="text"
                  placeholder="Search..."
                  className="rounded-pill"
                  style={{ width: '200px' }}
                />
              </Form>

              {currentUser ? (
  <NavDropdown id={ComponentIDs.currentUserDropdown} title={<PersonCircle size={20} />}>
    <NavDropdown.Item href="/account">View Account</NavDropdown.Item>
    <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} href="/auth/signout">
      <BoxArrowRight /> Sign out
    </NavDropdown.Item>
  </NavDropdown>
) : (
  <NavDropdown id={ComponentIDs.loginDropdown} title={<PersonCircle size={20} />}>
    <NavDropdown.Item id={ComponentIDs.loginDropdownSignIn} href="/auth/signin">
      Sign in
    </NavDropdown.Item>
    <NavDropdown.Item id={ComponentIDs.loginDropdownSignUp} href="/auth/signup">
      Sign up
    </NavDropdown.Item>
  </NavDropdown>
)}


              <Nav.Link
                as={Link}
                href="/cart"
                id={ComponentIDs.cartMenuItem}
                className="position-relative"
              >
                <Cart size={20} />
                {cartItemCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                    style={{
                      fontSize: '12px',
                      padding: '3px 8px',
                      color: '#fff',
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Smaller Navbar with Border */}
      <Navbar expand="lg" className="border bg-light py-1">
        <Container>
          <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
            <Nav className="me-auto">
              <NavDropdown title="Browse Interests" id={ComponentIDs.browseCategoriesDropdown}>
                <NavDropdown.Item href="/digital-hq" id={ComponentIDs.digitalHQMenuItem}>
                  Digital HQ
                </NavDropdown.Item>
                <NavDropdown.Item href="/study-tools" id={ComponentIDs.studyToolsMenuItem}>
                  Study Tools
                </NavDropdown.Item>
                <NavDropdown.Item href="/campus-closet" id={ComponentIDs.campusClosetMenuItem}>
                  Campus Closet
                </NavDropdown.Item>
                <NavDropdown.Item href="/self-care" id={ComponentIDs.selfCareMenuItem}>
                  Self-Care
                </NavDropdown.Item>
                <NavDropdown.Item href="/dorm-life" id={ComponentIDs.dormLifeMenuItem}>
                  Dorm Life
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="/vendors" id={ComponentIDs.vendorsMenuItem}>
                Find Vendors
              </Nav.Link>
            </Nav>

            <Nav className="justify-content-end">
              <Nav.Link as={Link} href="/customer-service" id={ComponentIDs.customerServiceMenuItem}>
                Customer Service
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
