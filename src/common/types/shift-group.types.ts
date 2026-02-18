export interface ShiftRoom {
  id: string;
  roomName: string;
  title: string;
  description: string;
  team: string[];
  start?: string;
  end?: string;
}

export interface ShiftGroup {
  id: string;
  date: string;
  start: string;
  end: string;
  color: string;
  rooms: ShiftRoom[];
}