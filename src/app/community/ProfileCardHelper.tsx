import { ProfileCardData } from '@/lib/ProfileCardData';
import ProfileCard from '../../components/ProfileCard';

const ProfileCardHelper = ({ profile }: { profile: ProfileCardData }) => <ProfileCard profile={profile} />;

export default ProfileCardHelper;
