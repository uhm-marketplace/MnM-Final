/* eslint-disable import/extensions */
import { Container } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import AddProjectForm from '@/components/AddProjectForm';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { authOptions } from '@/lib/auth';

const AddProjectPage = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  const interests = await prisma.interest.findMany();
  const participants = await prisma.user.findMany();

  return (
    <Container>
      <AddProjectForm interests={interests} participants={participants} userEmail={session?.user?.email || ''} />
    </Container>
  );
};

export default AddProjectPage;
