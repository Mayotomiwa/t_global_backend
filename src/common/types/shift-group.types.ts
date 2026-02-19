export interface TeamMember {
  name: string;
  imageUrl: string | null;
  notes: string | null;
}

export interface ShiftRoom {
  id: string;
  roomName: string;
  color: string;
  title: string;
  description: string;
  team: TeamMember[];
  imageUrl: string | null;
  start?: string;
  end?: string;
}

export interface ShiftGroup {
  id: string;
  date: string;
  start: string;
  end: string;
  shifts: ShiftRoom[];
}
