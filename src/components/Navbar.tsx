/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  Image,
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Form,
  FormControl,
} from 'react-bootstrap';
import { BoxArrowRight, PersonCircle, Cart } from 'react-bootstrap-icons'; // Using PersonCircle for the login icon
import { ComponentIDs } from '@/utilities/ids';
import Link from 'next/link'; // Use Next.js Link component

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentUser = session?.user?.email;
  const navbarClassName = currentUser ? 'bg-dark' : 'bg-light';

  const cartItemCount = 5; // Example count of items in the shopping cart, you can dynamically update this

  return (
    <>
      {/* Main Navbar with Border */}
      <Navbar expand="lg" className={`border ${navbarClassName}`}>
        <Container>
          <Navbar.Brand href="/" className="align-items-center">
            <span
              style={{
                fontWeight: 800,
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/images/manoanow1.png"
                width={50}
                style={{ marginBottom: 3, marginRight: 10 }}
                alt="Mānoa Now Marketplace"
              />
              Mānoa Now Marketplace
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
          <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
            <Nav className="me-auto justify-content-start">
              {currentUser && (
                <Nav.Link
                  active={pathname === '/home'}
                  href="/home"
                  id={ComponentIDs.homeMenuItem}
                >
                  Home
                </Nav.Link>
              )}
              <Nav.Link
                active={pathname === '/community'}
                href="/community"
                id={ComponentIDs.profilesMenuItem}
              >
                Community
              </Nav.Link>
              <Nav.Link
                active={pathname === '/products'}
                href="/products"
                id={ComponentIDs.projectsMenuItem}
              >
                Shop Products
              </Nav.Link>
              <Nav.Link
                active={pathname === '/reviews'}
                href="/reviews"
                id={ComponentIDs.reviewsMenuItem}
              >
                Reviews
              </Nav.Link>
              {currentUser && (
                <Nav.Link
                  active={pathname === '/addProducts'}
                  href="/addProducts"
                  id={ComponentIDs.addProjectMenuItem}
                >
                  Sell Here
                </Nav.Link>
              )}
            </Nav>

            {/* Right side of Navbar */}
            <Nav className="d-flex align-items-center justify-content-end">
              {/* Search Bar */}
              <Form className="d-inline me-3">
                <FormControl
                  type="text"
                  placeholder="Search..."
                  className="rounded-pill"
                  style={{ width: '200px' }}
                />
              </Form>

              {currentUser ? (
                // User Dropdown with PersonCircle icon
                <NavDropdown
                  id={ComponentIDs.currentUserDropdown}
                  title={<PersonCircle size={20} />}
                >
                  <NavDropdown.Item
                    id={ComponentIDs.currentUserDropdownSignOut}
                    href="/auth/signout"
                  >
                    <BoxArrowRight size={20} className="me-3" />
                    Sign out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // Login Dropdown
                <NavDropdown
                  id={ComponentIDs.loginDropdown}
                  title={<PersonCircle size={20} />}
                >
                  <NavDropdown.Item
                    id={ComponentIDs.loginDropdownSignIn}
                    href="/auth/signin"
                  >
                    Sign in
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id={ComponentIDs.loginDropdownSignUp}
                    href="/auth/signup"
                  >
                    Sign up
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* Cart Icon with Badge */}
              <Nav.Link
                as={Link}
                href="/cart"
                id={ComponentIDs.cartMenuItem}
                className={`position-relative ${pathname === '/cart' ? 'active' : ''}`}
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
      <Navbar
        expand="lg"
        className={`border ${currentUser ? 'bg-dark' : 'bg-light'} py-1`}
      >
        <Container>
          <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
            <Nav className="me-auto">
              {/* Browse Categories Dropdown */}
              <NavDropdown
                title="Browse Interests"
                id={ComponentIDs.browseCategoriesDropdown}
              >
                <NavDropdown.Item
                  href="/digital-hq"
                  id={ComponentIDs.digitalHQMenuItem}
                >
                  Digital HQ
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="/study-tools"
                  id={ComponentIDs.studyToolsMenuItem}
                >
                  Study Tools
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="/campus-closet"
                  id={ComponentIDs.campusClosetMenuItem}
                >
                  Campus Closet
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="/self-care"
                  id={ComponentIDs.selfCareMenuItem}
                >
                  Self-Care
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="/dorm-life"
                  id={ComponentIDs.dormLifeMenuItem}
                >
                  Dorm Life
                </NavDropdown.Item>
              </NavDropdown>

              {/* Vendors Link */}
              <Nav.Link
                active={pathname === '/vendors'}
                href="/vendors"
                id={ComponentIDs.vendorsMenuItem}
              >
                Find Vendors
              </Nav.Link>
            </Nav>

            {/* Right-aligned links: Sell and Customer Service */}
            <Nav className="justify-content-end">
              <Nav.Link
                active={pathname === '/customer-service'}
                href="/customer-service"
                id={ComponentIDs.customerServiceMenuItem}
              >
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
