import { DeepPartial } from 'typeorm';
import { PublicationEntity } from '../../features/publications/entities/publication.entity';

export function seedPublications(): DeepPartial<PublicationEntity>[] {
  return [
    {
      title: 'AI in Modern Healthcare',
      summary: 'A short overview of AI\'s role in diagnostics.',
      content:
        'Artificial Intelligence is revolutionizing healthcare by enabling faster, more accurate diagnoses. Machine learning models trained on vast datasets can detect anomalies in medical imaging, predict patient deterioration, and assist clinicians in treatment planning. This article explores the current state and future potential of AI tools in hospitals worldwide.',
      tags: ['AI', 'Healthcare'],
      author: 'Mayotomiwa Oluseyi',
      date: '2026-02-18',
      readTime: '4 mins',
      imageUrl: 'https://picsum.photos/seed/ai-health/800/400',
    },
    {
      title: 'The Future of Telemedicine',
      summary: 'How remote care is reshaping patient-doctor relationships.',
      content:
        'Telemedicine has seen exponential growth, particularly following the global pandemic. Patients can now consult specialists from the comfort of their homes, reducing travel burdens and wait times. This article examines how telehealth platforms are evolving, the regulatory landscape, and what the next decade holds for virtual care delivery.',
      tags: ['Telemedicine', 'Digital Health'],
      author: 'Dr. Lena Hartmann',
      date: '2026-02-15',
      readTime: '5 mins',
      imageUrl: 'https://picsum.photos/seed/telemedicine/800/400',
    },
    {
      title: 'Surgical Robotics: Precision at Scale',
      summary:
        'Robotic systems are making minimally invasive surgery more accessible.',
      content:
        'Robotic-assisted surgery has moved from experimental to mainstream. Systems like the da Vinci platform allow surgeons to perform complex procedures with sub-millimeter precision through tiny incisions. This piece covers the clinical outcomes, cost considerations, and training requirements for surgical robotics adoption.',
      tags: ['Robotics', 'Surgery'],
      author: 'Prof. James Okafor',
      date: '2026-02-10',
      readTime: '6 mins',
    },
  ];
}
