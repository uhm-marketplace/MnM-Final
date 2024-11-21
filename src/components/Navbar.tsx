'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Image, Nav, Navbar, NavDropdown, Form, FormControl, Badge } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill, PersonCircle, Cart3 } from 'react-bootstrap-icons';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentUser = session?.user?.email;
  const navbarClassName = currentUser ? 'bg-dark' : 'bg-light';
  const cartItemCount = 5;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements[0] as HTMLInputElement;
    const searchValue = searchInput.value;
    console.log('Searching for:', searchValue);
  };

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        expanded="lg"
        style={{ paddingTop: '2px', paddingBottom: '2px', fontSize: '0.9rem', borderBottom: '2px solid #ddd' }}
        className="bg-secondary"
      >
        <div className="container">
          <Nav className="me-auto">
            <Link href="/limited-time-offers" passHref>
              <Nav.Link className="text-muted" style={{ fontSize: '0.8rem', marginRight: '15px' }}>
                Limited Time Offers
              </Nav.Link>
            </Link>
            <Link href="/giftcards" passHref>
              <Nav.Link className="text-muted" style={{ fontSize: '0.8rem', marginRight: '15px' }}>
                Giftcards
              </Nav.Link>
            </Link>
            <Link href="/about-us" passHref>
              <Nav.Link className="text-muted" style={{ fontSize: '0.8rem', marginRight: '15px' }}>
                About Us
              </Nav.Link>
            </Link>
          </Nav>
          <Nav className="ms-auto">
            <Link href="/sell" passHref>
              <Nav.Link className="text-muted" style={{ fontSize: '0.8rem', marginLeft: '15px' }}>
                Sell
              </Nav.Link>
            </Link>
            <Link href="/customer-service" passHref>
              <Nav.Link className="text-muted" style={{ fontSize: '0.8rem', marginLeft: '15px' }}>
                Customer Service
              </Nav.Link>
            </Link>
          </Nav>
        </div>
      </Navbar>

      {/* Main Navbar */}
      <Navbar expanded="lg" style={{ borderBottom: '2px solid #ddd' }} className={navbarClassName}>
        <div className="container">
          <Navbar.Brand href="/" className="align-items-center">
            <span style={{ fontWeight: 800, fontSize: '24px' }}>
              <Image src="/images/logo.png" width={50} alt="Mānoa Now Marketplace" />
              Mānoa Now Marketplace
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              {currentUser && (
                <Link href="/home" passHref>
                  <Nav.Link active={pathname === '/home'}>Home</Nav.Link>
                </Link>
              )}
              <Link href="/profiles" passHref>
                <Nav.Link active={pathname === '/profiles'}>Profiles</Nav.Link>
              </Link>
              <Link href="/projects" passHref>
                <Nav.Link active={pathname === '/projects'}>Projects</Nav.Link>
              </Link>
              <Link href="/interests" passHref>
                <Nav.Link active={pathname === '/interests'}>Interests</Nav.Link>
              </Link>
            </Nav>

            {/* Search Bar */}
            <Form onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Search..."
                className="me-2"
                aria-label="Search"
              />
            </Form>

            {/* User and Cart */}
            <Nav className="justify-content-end">
              {currentUser ? (
                <NavDropdown title={currentUser}>
                  <NavDropdown.Item href="/auth/signout">
                    <BoxArrowRight />
                    {' '}
                    Sign out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown title={<PersonCircle size={20} />}>
                  <NavDropdown.Item href="/auth/signin">
                    <PersonFill />
                    {' '}
                    Sign in
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/auth/signup">
                    <PersonPlusFill />
                    {' '}
                    Sign up
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* Cart Icon */}
              <Nav.Link href="/cart" className="d-flex align-items-center position-relative">
                <Cart3 size={20} />
                {cartItemCount > 0 && (
                  <Badge pill bg="success" style={{ position: 'absolute', top: '-5px', right: '-5px' }}>
                    {cartItemCount}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default NavBar;
