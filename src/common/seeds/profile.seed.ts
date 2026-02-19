import { DeepPartial } from 'typeorm';
import { ProfileEntity } from '../../features/profile/entities/profile.entity';

export function seedProfile(): DeepPartial<ProfileEntity> {
  return {
    name: 'Dr. Omar Hassan',
    role: 'Surgeon',
    department: 'Surgery',
    email: 'omar.hassan@tglobal.med',
    phone: '+234-905-3210-011',
    bio: 'Board-certified general surgeon with 12 years of experience in minimally invasive procedures.',
    avatarUrl: null,
  };
}
