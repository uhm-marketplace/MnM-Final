import React from 'react';
import { Form, Button, Col, Container, Card, Row } from 'react-bootstrap';

interface AddProjectFormProps {
  title: string;
  description: string;
  price: number;
  buyer: string | null;
  seller: string | null;
  interests: { id: number; name: string }[];
  participants: { id: number; email: string }[];
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({
  title,
  description,
  price,
  buyer,
  seller,
  interests,
  participants,
}) => (
  <Container>
    <Card>
      <Card.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={description} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" value={price} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formBuyer">
                <Form.Label>Buyer</Form.Label>
                <Form.Control type="text" value={buyer || ''} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formSeller">
                <Form.Label>Seller</Form.Label>
                <Form.Control type="text" value={seller || ''} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formInterests">
                <Form.Label>Interests</Form.Label>
                <Form.Control
                  as="textarea"
                  value={interests.map((interest) => interest.name).join(', ')}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formParticipants">
                <Form.Label>Participants</Form.Label>
                <Form.Control
                  as="textarea"
                  value={participants.map((participant) => participant.email).join(', ')}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  </Container>
);

export default AddProjectForm;
