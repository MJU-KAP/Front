export type PurposeType = 'CERTIFICATION' | 'CONTEST' | 'INTERNSHIP' | 'ACTIVITY' | 'ETC';

export interface Purpose {
  purposeId: number;
  name: string;
  date: string;
  link: string;
  type: PurposeType;
  goal: string;
  createdAt: string;
}

export interface PurposeListResponse {
  count: number;
  items: Purpose[];
}

export interface CalendarEvent {
  calendarId: number;
  eventDate: string;
  title: string;
  description: string;
  link: string;
  createdAt: string;
}

export interface CalendarEventListResponse {
  count: number;
  items: CalendarEvent[];
}

export interface CreatePurposeBody {
  name: string;
  date: string;
  link: string;
  type: PurposeType;
  goal: string;
}

export interface CreateCalendarEventBody {
  eventDate: string;
  title: string;
  description: string;
  link: string;
}

export interface StudyLink {
  type: 'youtube' | 'blog';
  url: string;
  title: string;
}

export interface StudySchedule {
  scheduleId: number;
  date: string;
  topic: string;
  description: string;
  links: StudyLink[];
}