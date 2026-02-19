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
          roomName: 'Room 5',
          color: '#F59E0B',
          title: 'Emergency Triage',
          description: 'A&E triage, rapid assessment and stabilisation of incoming patients.',
          imageUrl: 'https://i.pravatar.cc/300?img=60',
          team: [
            { name: 'Dr. Sofia Reyes', imageUrl: 'https://i.pravatar.cc/150?img=60', notes: 'Emergency physician. Triages and leads resuscitation efforts.' },
            { name: 'Nurse David Mensah', imageUrl: 'https://i.pravatar.cc/150?img=65', notes: 'Triage nurse. Performs initial assessments and pain scoring.' },
            { name: 'Paramedic Jana Novak', imageUrl: 'https://i.pravatar.cc/150?img=68', notes: 'Paramedic liaison. Coordinates handovers from ambulance teams.' },
          ],
          start: '2026-02-18T00:00:00Z',
          end: '2026-02-18T08:00:00Z',
        },
        {
          roomName: 'Room 1',
          color: '#A78BFA',
          title: 'Morning Surgery',
          description: 'General surgery procedures and post-op monitoring.',
          imageUrl: 'https://i.pravatar.cc/300?img=11',
          team: [
            { name: 'Dr. Omar Hassan', imageUrl: 'https://i.pravatar.cc/150?img=11', notes: 'Lead surgeon. Oversees all procedures and final sign-off.' },
            { name: 'Elijah Anderson', imageUrl: 'https://i.pravatar.cc/150?img=15', notes: 'Scrub nurse. Responsible for instrument handling and sterile field.' },
          ],
          start: '2026-02-18T06:00:00Z',
          end: '2026-02-18T12:00:00Z',
        },
        {
          roomName: 'Room 3',
          color: '#34D399',
          title: 'Paediatrics Morning',
          description: 'Paediatric ward rounds and outpatient consultations.',
          imageUrl: 'https://i.pravatar.cc/300?img=47',
          team: [
            { name: 'Dr. Ayasha Redcloud', imageUrl: 'https://i.pravatar.cc/150?img=47', notes: 'Senior paediatrician. Leads ward rounds and family consultations.' },
            { name: 'Dr. Kimi Tanaka', imageUrl: 'https://i.pravatar.cc/150?img=44', notes: 'Paediatric resident. Documents case notes and assists with assessments.' },
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
            { name: 'Dr. James Osei', imageUrl: 'https://i.pravatar.cc/150?img=52', notes: 'Cardiologist. Reviews ECGs and manages arrhythmia cases.' },
            { name: 'Nurse Priya Nair', imageUrl: 'https://i.pravatar.cc/150?img=56', notes: 'Cardiac nurse. Monitors telemetry and assists with catheter care.' },
          ],
          start: '2026-02-18T08:00:00Z',
          end: '2026-02-18T14:00:00Z',
        },
        {
          roomName: 'Room 2',
          color: '#F472B6',
          title: 'Afternoon ICU',
          description: 'Intensive care unit coverage and critical patient management.',
          imageUrl: 'https://i.pravatar.cc/300?img=20',
          team: [
            { name: 'Dr. Lena Fischer', imageUrl: 'https://i.pravatar.cc/150?img=20', notes: 'Attending intensivist. Manages ventilator settings and treatment plans.' },
            { name: 'Nurse Sam Okafor', imageUrl: 'https://i.pravatar.cc/150?img=33', notes: 'ICU nurse. Monitors vitals and administers medications.' },
          ],
          start: '2026-02-18T12:00:00Z',
          end: '2026-02-18T18:00:00Z',
        },
        {
          roomName: 'Room 6',
          color: '#FB923C',
          title: 'Orthopaedics Afternoon',
          description: 'Post-operative orthopaedic care and physiotherapy coordination.',
          imageUrl: 'https://i.pravatar.cc/300?img=70',
          team: [
            { name: 'Dr. Marcus Webb', imageUrl: 'https://i.pravatar.cc/150?img=70', notes: 'Orthopaedic surgeon. Reviews post-op X-rays and wound healing.' },
            { name: 'Physio Claire Duval', imageUrl: 'https://i.pravatar.cc/150?img=73', notes: 'Physiotherapist. Guides mobility exercises and discharge planning.' },
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
          roomName: 'Room 3',
          color: '#60A5FA',
          title: 'Radiology Morning',
          description: 'MRI, CT scans and X-ray reporting sessions.',
          imageUrl: 'https://i.pravatar.cc/300?img=22',
          team: [
            { name: 'Dr. Ivan Petrov', imageUrl: 'https://i.pravatar.cc/150?img=22', notes: 'Radiologist. Reports on imaging studies and liaises with clinical teams.' },
            { name: 'Tech. Amara Diallo', imageUrl: 'https://i.pravatar.cc/150?img=25', notes: 'Radiography technician. Operates MRI and CT equipment.' },
          ],
          start: '2026-02-19T06:00:00Z',
          end: '2026-02-19T12:00:00Z',
        },
        {
          roomName: 'Room 1',
          color: '#34D399',
          title: 'Paediatrics Morning',
          description: 'Paediatric ward rounds and routine check-ups.',
          imageUrl: 'https://i.pravatar.cc/300?img=47',
          team: [
            { name: 'Dr. Ayasha Redcloud', imageUrl: 'https://i.pravatar.cc/150?img=47', notes: 'Senior paediatrician. Leads morning rounds and reviews overnight cases.' },
            { name: 'Dr. Kimi Tanaka', imageUrl: 'https://i.pravatar.cc/150?img=44', notes: 'Paediatric resident. Updates care plans and liaises with families.' },
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
            { name: 'Dr. Fatima Al-Rashid', imageUrl: 'https://i.pravatar.cc/150?img=12', notes: 'Oncologist. Reviews blood results and adjusts chemotherapy protocols.' },
            { name: 'Nurse Chen Wei', imageUrl: 'https://i.pravatar.cc/150?img=17', notes: 'Oncology nurse. Administers chemotherapy and monitors for adverse reactions.' },
          ],
          start: '2026-02-19T08:00:00Z',
          end: '2026-02-19T14:00:00Z',
        },
        {
          roomName: 'Room 5',
          color: '#F59E0B',
          title: 'Dermatology Clinic',
          description: 'Outpatient dermatology consultations and minor procedures.',
          imageUrl: 'https://i.pravatar.cc/300?img=36',
          team: [
            { name: 'Dr. Layla Nasser', imageUrl: 'https://i.pravatar.cc/150?img=36', notes: 'Dermatologist. Conducts consultations and performs biopsies.' },
            { name: 'Nurse Elijah Anderson', imageUrl: 'https://i.pravatar.cc/150?img=15', notes: 'Clinic nurse. Prepares patients and assists with minor procedures.' },
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
            { name: 'Physio Claire Duval', imageUrl: 'https://i.pravatar.cc/150?img=73', notes: 'Senior physiotherapist. Leads rehabilitation programmes and progress reviews.' },
            { name: 'Physio Ben Kariuki', imageUrl: 'https://i.pravatar.cc/150?img=40', notes: 'Physiotherapist. Conducts individual therapy sessions and documents outcomes.' },
          ],
          start: '2026-02-19T10:00:00Z',
          end: '2026-02-19T16:00:00Z',
        },
        {
          roomName: 'Room 4',
          color: '#F472B6',
          title: 'General Surgery Evening',
          description: 'Scheduled evening surgical procedures and recovery monitoring.',
          imageUrl: 'https://i.pravatar.cc/300?img=30',
          team: [
            { name: 'Dr. Omar Hassan', imageUrl: 'https://i.pravatar.cc/150?img=11', notes: 'Lead surgeon. Performs scheduled procedures and reviews recovery notes.' },
            { name: 'Dr. Marcus Webb', imageUrl: 'https://i.pravatar.cc/150?img=70', notes: 'Assisting surgeon. Supports complex cases and manages post-op care.' },
            { name: 'Nurse Sam Okafor', imageUrl: 'https://i.pravatar.cc/150?img=33', notes: 'Circulating nurse. Coordinates theatre resources and patient handovers.' },
          ],
          start: '2026-02-19T14:00:00Z',
          end: '2026-02-19T20:00:00Z',
        },
      ],
    },
  ];
}
