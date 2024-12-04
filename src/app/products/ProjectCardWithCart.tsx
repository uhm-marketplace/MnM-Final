'use client';

import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Cart as CartIcon } from 'react-bootstrap-icons';
import ProjectCard from '@/components/ProjectCard';
import { ProjectCardData } from '@/lib/ProjectCardData';

const ProjectCardWithCart = ({
  projectData,
}: {
  projectData: ProjectCardData;
}) => {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setIsInCart(
      cart.some((item: ProjectCardData) => item.name === projectData.name),
    );
  }, [projectData.name]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (isInCart) {
      const newCart = cart.filter(
        (item: ProjectCardData) => item.name !== projectData.name,
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      setIsInCart(false);
    } else {
      cart.push(projectData);
      localStorage.setItem('cart', JSON.stringify(cart));
      setIsInCart(true);
    }

    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="position-relative h-100">
      <ProjectCard project={projectData} />
      <div className="position-absolute bottom-0 end-0 me-4 mb-3">
        <Button
          variant={isInCart ? 'outline-danger' : 'outline-success'}
          onClick={handleAddToCart}
          className="d-flex align-items-center gap-1"
          size="sm"
          style={{
            transition: 'all 0.2s ease',
            borderRadius: '6px',
            padding: '4px 8px',
            backgroundColor: 'white',
            color: isInCart ? '#dc3545' : '#198754', // Red for danger, green for success
            borderColor: isInCart ? '#dc3545' : '#198754',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = isInCart
              ? '#dc3545'
              : '#198754';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = isInCart ? '#dc3545' : '#198754';
          }}
        >
          <CartIcon size={14} />
          {isInCart ? 'Remove' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default ProjectCardWithCart;
