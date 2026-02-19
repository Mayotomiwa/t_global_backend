import { DeepPartial } from 'typeorm';
import { ShiftGroupEntity } from '../../features/shift/entities/shift-group.entity';

export function seedShifts(): DeepPartial<ShiftGroupEntity>[] {
  return [
    {
      date: '2026-02-18',
      start: '2026-02-18T08:00:00Z',
      end: '2026-02-18T16:00:00Z',
      shifts: [
        {
          roomName: 'Room1',
          color: '#A78BFA',
          title: 'Morning Surgery Shift',
          description: 'Main operating shift',
          team: ['Dr. Omar', 'Elijah A.'],
          start: '2026-02-18T08:00:00Z',
          end: '2026-02-18T12:00:00Z',
        },
        {
          roomName: 'Room2',
          color: '#F472B6',
          title: 'Afternoon ICU',
          description: 'Intensive care unit coverage',
          team: ['Dr. Lena', 'Nurse Sam'],
          start: '2026-02-18T12:00:00Z',
          end: '2026-02-18T16:00:00Z',
        },
      ],
    },
    {
      date: '2026-02-19',
      start: '2026-02-19T07:00:00Z',
      end: '2026-02-19T15:00:00Z',
      shifts: [
        {
          roomName: 'Room3',
          color: '#34D399',
          title: 'Pediatrics Morning',
          description: 'Pediatric ward rounds',
          team: ['Dr. Ayasha', 'Dr. Kimi'],
        },
      ],
    },
  ];
}
