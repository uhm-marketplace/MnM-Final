/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/anchor-is-valid */

'use client';

import { Badge, Card, Col } from 'react-bootstrap';
import TooltipImage from '@/components/TooltipImage';
import { ProjectCardData } from '@/lib/ProjectCardData';
import { Link } from 'react-bootstrap-icons';

const ProjectCard = ({ project }: { project: ProjectCardData }) => (
  <Col>
    <Card className="h-100 shadow-sm hover-shadow">
      {/* Image Container */}
      <div
        className="position-relative"
        style={{ height: '200px', overflow: 'hidden' }}
      >
        <Card.Img
          src={project.picture || '/images/placeholder.png'} // Add a placeholder image
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }}
          alt={project.name}
        />
      </div>

      {/* Main Content */}
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <Card.Title className="h5 mb-2 d-flex justify-content-between align-items-start">
            {project.name}
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary ms-2"
              >
                <Link size={20} />
              </a>
            )}
          </Card.Title>
          <Card.Text
            className="text-muted"
            style={{
              fontSize: '0.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {project.description}
          </Card.Text>
        </div>

        {/* Interests */}
        <div className="mb-3">
          {project.interests.slice(0, 3).map((interest) => (
            <Badge
              key={interest}
              bg="info"
              className="me-2 mb-2"
              style={{
                padding: '4px 8px',
                fontSize: '0.6rem',
                fontWeight: '500',
                borderRadius: '20px',
              }}
            >
              {interest}
            </Badge>
          ))}
          {project.interests.length > 3 && (
            <Badge
              bg="secondary"
              className="mb-2"
              style={{
                padding: '4px 8px',
                fontSize: '0.5rem',
                fontWeight: '500',
                borderRadius: '10px',
              }}
            >
              +
              {project.interests.length - 3}
            </Badge>
          )}
        </div>

        {/* Participants */}
        <div className="mt-auto">
          <small className="text-muted mb-2 d-block">Seller:</small>
          <div className="d-flex flex-wrap gap-2">
            {project.participants.map((p) => (
              <div key={p.email} style={{ marginBottom: '4px' }}>
                <TooltipImage
                  name={p.email}
                  roundedCircle
                  src={p.picture || '/images/default-avatar.png'} // Add a default avatar
                  width={35}
                  height={35}
                  style={{
                    objectFit: 'cover',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>

    <style jsx global>
      {`
        .hover-shadow {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        }
        .card {
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .card-img-top {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
      `}
    </style>
  </Col>
);

export default ProjectCard;
