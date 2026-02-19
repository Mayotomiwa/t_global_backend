import { DeepPartial } from 'typeorm';
import { ShiftGroupEntity } from '../../features/shift/entities/shift-group.entity';

export function seedShifts(): DeepPartial<ShiftGroupEntity>[] {
  return [
    {
      date: '2026-02-18',
      start: '2026-02-18T06:00:00Z',
      end: '2026-02-18T22:00:00Z',
      shifts: [
        {
          roomName: 'Room 1',
          color: '#A78BFA',
          title: 'Morning Surgery',
          description: 'General surgery procedures and post-op monitoring.',
          imageUrl: 'https://i.pravatar.cc/300?img=11',
          team: [
            { name: 'Dr. Omar Hassan', imageUrl: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Elijah Anderson', imageUrl: 'https://i.pravatar.cc/150?img=15' },
          ],
          start: '2026-02-18T06:00:00Z',
          end: '2026-02-18T12:00:00Z',
        },
        {
          roomName: 'Room 2',
          color: '#F472B6',
          title: 'Afternoon ICU',
          description: 'Intensive care unit coverage and critical patient management.',
          imageUrl: 'https://i.pravatar.cc/300?img=20',
          team: [
            { name: 'Dr. Lena Fischer', imageUrl: 'https://i.pravatar.cc/150?img=20' },
            { name: 'Nurse Sam Okafor', imageUrl: 'https://i.pravatar.cc/150?img=33' },
          ],
          start: '2026-02-18T12:00:00Z',
          end: '2026-02-18T18:00:00Z',
        },
        {
          roomName: 'Room 3',
          color: '#34D399',
          title: 'Paediatrics Morning',
          description: 'Paediatric ward rounds and outpatient consultations.',
          imageUrl: 'https://i.pravatar.cc/300?img=47',
          team: [
            { name: 'Dr. Ayasha Redcloud', imageUrl: 'https://i.pravatar.cc/150?img=47' },
            { name: 'Dr. Kimi Tanaka', imageUrl: 'https://i.pravatar.cc/150?img=44' },
          ],
          start: '2026-02-18T07:00:00Z',
          end: '2026-02-18T13:00:00Z',
        },
        {
          roomName: 'Room 4',
          color: '#60A5FA',
          title: 'Cardiology Rounds',
          description: 'Cardiac patient monitoring, ECG reviews and consultations.',
          imageUrl: 'https://i.pravatar.cc/300?img=52',
          team: [
            { name: 'Dr. James Osei', imageUrl: 'https://i.pravatar.cc/150?img=52' },
            { name: 'Nurse Priya Nair', imageUrl: 'https://i.pravatar.cc/150?img=56' },
          ],
          start: '2026-02-18T08:00:00Z',
          end: '2026-02-18T14:00:00Z',
        },
        {
          roomName: 'Room 5',
          color: '#F59E0B',
          title: 'Emergency Triage',
          description: 'A&E triage, rapid assessment and stabilisation of incoming patients.',
          imageUrl: 'https://i.pravatar.cc/300?img=60',
          team: [
            { name: 'Dr. Sofia Reyes', imageUrl: 'https://i.pravatar.cc/150?img=60' },
            { name: 'Nurse David Mensah', imageUrl: 'https://i.pravatar.cc/150?img=65' },
            { name: 'Paramedic Jana Novak', imageUrl: 'https://i.pravatar.cc/150?img=68' },
          ],
          start: '2026-02-18T00:00:00Z',
          end: '2026-02-18T08:00:00Z',
        },
        {
          roomName: 'Room 6',
          color: '#FB923C',
          title: 'Orthopaedics Afternoon',
          description: 'Post-operative orthopaedic care and physiotherapy coordination.',
          imageUrl: 'https://i.pravatar.cc/300?img=70',
          team: [
            { name: 'Dr. Marcus Webb', imageUrl: 'https://i.pravatar.cc/150?img=70' },
            { name: 'Physio Claire Duval', imageUrl: 'https://i.pravatar.cc/150?img=73' },
          ],
          start: '2026-02-18T14:00:00Z',
          end: '2026-02-18T20:00:00Z',
        },
      ],
    },
    {
      date: '2026-02-19',
      start: '2026-02-19T06:00:00Z',
      end: '2026-02-19T22:00:00Z',
      shifts: [
        {
          roomName: 'Room 1',
          color: '#34D399',
          title: 'Paediatrics Morning',
          description: 'Paediatric ward rounds and routine check-ups.',
          imageUrl: 'https://i.pravatar.cc/300?img=47',
          team: [
            { name: 'Dr. Ayasha Redcloud', imageUrl: 'https://i.pravatar.cc/150?img=47' },
            { name: 'Dr. Kimi Tanaka', imageUrl: 'https://i.pravatar.cc/150?img=44' },
          ],
          start: '2026-02-19T07:00:00Z',
          end: '2026-02-19T13:00:00Z',
        },
        {
          roomName: 'Room 2',
          color: '#A78BFA',
          title: 'Oncology Review',
          description: 'Chemotherapy administration and oncology patient assessments.',
          imageUrl: 'https://i.pravatar.cc/300?img=12',
          team: [
            { name: 'Dr. Fatima Al-Rashid', imageUrl: 'https://i.pravatar.cc/150?img=12' },
            { name: 'Nurse Chen Wei', imageUrl: 'https://i.pravatar.cc/150?img=17' },
          ],
          start: '2026-02-19T08:00:00Z',
          end: '2026-02-19T14:00:00Z',
        },
        {
          roomName: 'Room 3',
          color: '#60A5FA',
          title: 'Radiology Morning',
          description: 'MRI, CT scans and X-ray reporting sessions.',
          imageUrl: 'https://i.pravatar.cc/300?img=22',
          team: [
            { name: 'Dr. Ivan Petrov', imageUrl: 'https://i.pravatar.cc/150?img=22' },
            { name: 'Tech. Amara Diallo', imageUrl: 'https://i.pravatar.cc/150?img=25' },
          ],
          start: '2026-02-19T06:00:00Z',
          end: '2026-02-19T12:00:00Z',
        },
        {
          roomName: 'Room 4',
          color: '#F472B6',
          title: 'General Surgery Evening',
          description: 'Scheduled evening surgical procedures and recovery monitoring.',
          imageUrl: 'https://i.pravatar.cc/300?img=30',
          team: [
            { name: 'Dr. Omar Hassan', imageUrl: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Dr. Marcus Webb', imageUrl: 'https://i.pravatar.cc/150?img=70' },
            { name: 'Nurse Sam Okafor', imageUrl: 'https://i.pravatar.cc/150?img=33' },
          ],
          start: '2026-02-19T14:00:00Z',
          end: '2026-02-19T20:00:00Z',
        },
        {
          roomName: 'Room 5',
          color: '#F59E0B',
          title: 'Dermatology Clinic',
          description: 'Outpatient dermatology consultations and minor procedures.',
          imageUrl: 'https://i.pravatar.cc/300?img=36',
          team: [
            { name: 'Dr. Layla Nasser', imageUrl: 'https://i.pravatar.cc/150?img=36' },
            { name: 'Nurse Elijah Anderson', imageUrl: 'https://i.pravatar.cc/150?img=15' },
          ],
          start: '2026-02-19T09:00:00Z',
          end: '2026-02-19T15:00:00Z',
        },
        {
          roomName: 'Room 6',
          color: '#FB923C',
          title: 'Physiotherapy Sessions',
          description: 'Post-operative rehabilitation and musculoskeletal therapy.',
          imageUrl: 'https://i.pravatar.cc/300?img=40',
          team: [
            { name: 'Physio Claire Duval', imageUrl: 'https://i.pravatar.cc/150?img=73' },
            { name: 'Physio Ben Kariuki', imageUrl: 'https://i.pravatar.cc/150?img=40' },
          ],
          start: '2026-02-19T10:00:00Z',
          end: '2026-02-19T16:00:00Z',
        },
      ],
    },
  ];
}
