export const ResearchStatus = {
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  PLANNED: 'PLANNED',
} as const
export type ResearchStatus = (typeof ResearchStatus)[keyof typeof ResearchStatus]

export const ResearchProjectType = {
  FUNDED: 'FUNDED',
  NON_FUNDED: 'NON_FUNDED',
} as const
export type ResearchProjectType = (typeof ResearchProjectType)[keyof typeof ResearchProjectType]

export const NewsAndAnnouncementsType = {
  Vacancy: 'Vacancy',
  Event: 'Event',
} as const
export type NewsAndAnnouncementsType = (typeof NewsAndAnnouncementsType)[keyof typeof NewsAndAnnouncementsType]

export const GroupCategory = {
  POSTDOC: 'POSTDOC',
  PHD: 'PHD',
  MASTERS: 'MASTERS',
  UNDERGRADUATE: 'UNDERGRADUATE',
  FACULTY: 'FACULTY',
  FACULTY_FELLOW: 'FACULTY_FELLOW',
  ALUMNI: 'ALUMNI',
  STAFF: 'STAFF',
  RESEARCH_SCHOLAR: 'RESEARCH_SCHOLAR',
  COLLABORATOR: 'COLLABORATOR',
  OTHER: 'OTHER',
} as const
export type GroupCategory = (typeof GroupCategory)[keyof typeof GroupCategory]

export const AwardType = {
  GROUP_LEADER: 'GROUP_LEADER',
  GROUP_MEMBER: 'GROUP_MEMBER',
} as const
export type AwardType = (typeof AwardType)[keyof typeof AwardType]

export const PublicationCategory = {
  PATENTS: 'PATENTS',
  JOURNAL: 'JOURNAL',
  CONFERENCE: 'CONFERENCE',
  PRESENTATION: 'PRESENTATION',
  NATIONAL_REPORT: 'NATIONAL_REPORT',
  INVITED_TALK: 'INVITED_TALK',
  BOOK: 'BOOK',
  OTHER: 'OTHER',
  PUBLICATION: 'PUBLICATION',
} as const
export type PublicationCategory = (typeof PublicationCategory)[keyof typeof PublicationCategory]

export const NewsType = NewsAndAnnouncementsType
export type NewsType = NewsAndAnnouncementsType
