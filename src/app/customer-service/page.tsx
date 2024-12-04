import React from 'react';

interface StaffMember {
  name: string;
  role: string;
  email: string;
}

const staffMembers: StaffMember[] = [
  { name: 'Joanne Oshiro', role: 'Leader & Front-End', email: 'joanne21@hawaii.edu' },
  { name: 'Josef Leander Del Rosario', role: 'Back-End', email: 'josef4@hawaii.edu' },
  { name: 'Lionel Derrick Roxas', role: 'Back-End', email: 'ldroxas@hawaii.edu' },
  { name: 'Naomi Toloumu', role: 'Front-End', email: 'ntoloumu@gmail.com' },
  { name: 'Alex Cornwell', role: 'Back-End', email: 'ac336@hawaii.edu' },
];

const CSPage: React.FC = () => (
  <div style={{ padding: '0 20px', borderLeft: '5px solid #ccc', borderRight: '5px solid #ccc' }}>
    <h2>Contact Us</h2>

    <h5>Need Help or Encountered an Issue?</h5>
    <p>
      If you experience any errors or need assistance navigating the site,
      do not hesitate to contact our team. We are here to help and ensure
      you have the best experience possible. Simply reach out to one of our
      staff members below!
    </p>

    {/* Staff Members Container */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px', // Space between the boxes
        marginTop: '20px',
      }}
    >
      {staffMembers.map((staff) => (
        <div
          key={staff.email}
          style={{
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            backgroundColor: '#f9f9f9', // Light background color for contrast
          }}
        >
          <h4>{staff.name}</h4>
          <p>{staff.role}</p>
          <p>
            <a href={`mailto:${staff.email}`} style={{ color: '#007BFF' }}>
              {staff.email}
            </a>
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default CSPage;
