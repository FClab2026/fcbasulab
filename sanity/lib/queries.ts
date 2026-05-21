import {groq} from 'next-sanity'

// Filled in during Phase 1 as each content type is swapped. One exported
// query per public-site read in `lib/load_data/*`.

export const HOME_LATEST_PUBLICATIONS = groq`
  *[_type == "publication"] | order(year desc, _createdAt desc)[0...$limit] {
    "id": _id, body, category, year, "createdAt": _createdAt
  }
`

export const HOME_LATEST_PROJECTS = groq`
  *[_type == "project"] | order(_createdAt desc)[0...$limit] {
    "id": _id, title, description, status, type, completedOn, "createdAt": _createdAt
  }
`

export const HOME_LATEST_EQUIPMENTS = groq`
  *[_type == "equipment"] | order(installedOn desc)[0...$limit] {
    "id": _id, name, manufacturer, model, serialNumber, installedOn, category
  }
`

export const HOME_STATS = groq`{
  "publications": count(*[_type == "publication"]),
  "projects": count(*[_type == "project"]),
  "members": count(*[_type == "groupMember"]),
  "equipments": count(*[_type == "equipment"]),
  "alumni": count(*[_type == "alumni"]),
  "researchAreas": count(*[_type == "researchArea"])
}`

export const PUBLICATIONS_BY_CATEGORY = groq`{
  "items": *[_type == "publication" && category == $category]
    | order(year desc, _createdAt desc)[$start...$end] {
    "id": _id, body, category, year, "createdAt": _createdAt
  },
  "total": count(*[_type == "publication" && category == $category])
}`

export const MEMBERS_BY_CATEGORY = groq`{
  "items": *[_type == "groupMember" && category == $category]
    | order(name asc)[$start...$end] {
    "id": _id, name, email, designation, researchAreas, category,
    profileImage, profileLink, phoneNumber
  },
  "total": count(*[_type == "groupMember" && category == $category])
}`

export const ALL_RESEARCH_AREAS = groq`
  *[_type == "researchArea"] | order(_createdAt desc) {
    "id": _id, name, body, image
  }
`

export const GALLERY_PAGE = groq`{
  "items": *[_type == "galleryItem"] | order(_createdAt desc)[$start...$end] {
    "id": _id, title, description, image
  },
  "total": count(*[_type == "galleryItem"])
}`

export const ALL_AWARDS = groq`
  *[_type == "award"] | order(_createdAt desc) {
    "id": _id, body, type, "createdAt": _createdAt
  }
`

export const ALL_ALUMNI = groq`
  *[_type == "alumni"] | order(name asc) {
    "id": _id, name, body, "createdAt": _createdAt
  }
`

export const ALL_NEWS = groq`
  *[_type == "news"] | order(_createdAt desc) {
    "id": _id, title, body, type, "createdAt": _createdAt
  }
`
