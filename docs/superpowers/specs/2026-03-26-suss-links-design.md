# SUSS Links — Design Spec

**Date:** 2026-03-26
**Status:** Approved
**Stack:** Vite + React 18 + React Router v6 + Tailwind CSS v3 + Lucide React
**Deploy target:** Vercel

---

## 1. Concept

A public, static link directory for SUSS students. No login, no backend, no database. All data is hardcoded in a single JS file. The site surfaces eight categories of student portals and tools, with a search bar, quick access strip, and a feedback form.

---

## 2. File Structure

```
suss-links/
├── public/
│   └── favicon.ico
├── src/
│   ├── data/
│   │   └── links.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── QuickAccess.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── LinkCard.jsx
│   │   ├── FeaturedCard.jsx
│   │   ├── FeedbackForm.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── CategoryPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vercel.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 3. Routing

React Router v6, client-side only.

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `Home.jsx` | Landing page |
| `/category/:slug` | `CategoryPage.jsx` | Generic, driven by slug |

Valid slugs: `academics`, `admin`, `library`, `career`, `financial`, `facilities`, `forms`, `notices`.

`vercel.json` rewrites all paths to `index.html` so React Router handles navigation on direct URL load or refresh.

---

## 4. Data Model (`src/data/links.js`)

### Quick Access Links

Six fixed entries rendered in the landing page strip.

```js
export const quickAccessLinks = [
  { name: "Canvas", href: "https://canvas.suss.edu.sg", icon: "BookOpen" },
  { name: "Student Portal", href: "https://portal.suss.edu.sg", icon: "LayoutDashboard" },
  { name: "MyMail", href: "https://outlook.office365.com", icon: "Mail" },
  { name: "SUSS Library", href: "https://library.suss.edu.sg", icon: "Library" },
  { name: "Career Portal", href: "https://susscareerportal.suss.edu.sg", icon: "Briefcase" },
  { name: "iSmart-Guide", href: "https://canvas.suss.edu.sg", icon: "Compass" },
]
```

### Category Shape

```js
{
  slug: String,           // URL segment
  name: String,           // Display name
  icon: String,           // Lucide icon name
  description: String,    // Short subtitle for the landing card
  links: [
    {
      name: String,
      description: String,
      href: String,        // Direct deep link, OR "https://portal.suss.edu.sg"
      portalPath: String | null,  // Non-null only when href is the portal root
    }
  ]
}
```

**Rule:** `portalPath` is `null` when a real deep link exists. When only the portal root is available, `href` is `https://portal.suss.edu.sg` and `portalPath` contains the navigation hint (e.g. `"Login → E-Services → Graduation Filing"`). Deep links will be substituted in future iterations as they are confirmed through user testing.

**Exception:** Contact/info cards (e.g. Student Support, IT Service Desk) may use `href: "https://portal.suss.edu.sg"` with `portalPath: null` when the link is a general portal entry point and the key information (phone number, hours) is in the description itself. These cards do not require a navigation path hint.

**Cross-category duplication policy:** Some links intentionally appear in multiple categories (e.g. Discussion Room Booking in both Library and Facilities; SSG Funding in both Admin and Financial). This is by design — users approaching from different mental models should find the same resource. Descriptions may differ slightly between appearances to match the context of the category. Deduplication is not required.

### Known direct deep links (confirmed)

| Link name | URL |
|-----------|-----|
| Course Timetable | `https://sims1.suss.edu.sg/EService/Student/CourseTimetable/CourseTimetableMain.aspx` |
| Personalised Exam Timetable | `https://sims1.suss.edu.sg/EService/Student/PersonalizedTimetable/StuPersonalizedTimetable.aspx` |
| View Exam Result | `https://sims1.suss.edu.sg/EService/Student/StudentAcademicProfile/ViewExamResults.aspx` |
| eCourse Registration | `https://sims1.suss.edu.sg/EService/Student/CourseRegistrationFullTime/ECRMain.aspx` |
| View Outstanding Invoice / Pay | `https://sims1.suss.edu.sg/EService/Student/BillAndAcceptePayment/ePayment.aspx` |

All others currently point to `https://portal.suss.edu.sg` with a `portalPath` hint.

**Canvas-proxied links:** iSmart-Guide and Panopto do not have standalone public URLs — they are accessed via the Canvas left navigation panel. Both intentionally link to `https://canvas.suss.edu.sg` with `portalPath: null`. Their descriptions make this clear to users.

---

## 5. Components

### `Navbar`
- Sticky, navy (`#002147`) background, white text
- Left: site name "SUSS Links"
- Right: dark mode toggle (sun/moon Lucide icon) + "Home" back button (shown on category pages only)
- Dark mode toggle writes/removes `dark` class on `document.documentElement` and persists choice to `localStorage`
- The Navbar does NOT read localStorage on mount — that init logic lives in `main.jsx` (see Section 7)

### `SearchBar`
- Rendered in the hero section on the landing page only
- Client-side filter across all categories' `links[]`, matching `name` and `description` (case-insensitive)
- Results render as a flat `LinkCard` list beneath the bar, replacing the category grid and QuickAccess strip
- **Empty query:** category grid and QuickAccess strip are shown normally (no search state active)
- **Query with no matches:** show a "No results for '[query]'" message in place of the grid; QuickAccess strip remains hidden
- Clearing the input restores the full landing view

### `QuickAccess`
- Horizontal strip of 6 large icon buttons
- Each button: Lucide icon + label, opens `href` in a new tab
- Layout: 3-column grid on mobile, single row on `md+`

### `CategoryCard`
- Used on the landing page grid
- Contains: Lucide icon, category name, short description
- Entire card is a React Router `<Link>` to `/category/:slug`
- Grid: 1 col mobile → 2 col md → 4 col lg

### `LinkCard`
- Used in category page grids
- Shows: name (bold), description (muted grey), and — if `portalPath` is non-null — a small muted pill below the description showing the portal navigation path
- Opens `href` in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Grid: 1 col mobile → 2 col md → 3 col lg

### `FeaturedCard`
- Used only at the top of the Library category page, above the link grid
- Full-width, navy background, white text
- Title: "Discussion Room Booking", subtitle: "Check live availability", CTA arrow link to `https://suss.libcal.com/spaces`
- Visually distinct — not part of the standard card grid
- `CategoryPage` renders it via a hardcoded `slug === "library"` check; no extensibility to other categories is required in this version

### `FeedbackForm`
- At the bottom of the landing page
- Fields: Name (optional text input), Suggestion or feedback (required textarea)
- POSTs to `https://formspree.io/f/REPLACE_WITH_YOUR_ID` via fetch
- Manages four UI states:
  - **idle:** form is shown, submit button enabled
  - **submitting:** submit button shows a spinner, inputs are disabled
  - **success:** form fields are hidden; show a green confirmation message "Thanks for your feedback!"
  - **error:** form fields remain visible and pre-filled; show a red error message "Something went wrong. Please try again." with the submit button re-enabled

### `Footer`
- Static text: "Made for SUSS students, by SUSS students. This is an unofficial student project and is not affiliated with SUSS."

---

## 6. Pages

### `Home.jsx`
Renders in order:
1. `Navbar`
2. Hero section — title "All your SUSS portals in one place" + `SearchBar`
3. `QuickAccess` strip
4. Category grid (8 × `CategoryCard`) — hidden when search has results
5. `FeedbackForm`
6. `Footer`

### `CategoryPage.jsx`
- Reads `slug` from `useParams()`
- Looks up matching category from `categories` in `links.js`
- Renders: `Navbar` (with back button), page title, and:
  - If slug is `library`: `FeaturedCard` then link grid
  - Otherwise: link grid only
- **Unrecognised slug:** renders `Navbar` + a centred message "Page not found" with a "Go back home" React Router `<Link>` to `/`. No HTTP 404 status is set (SPA limitation — static host always returns 200).

---

## 7. Styling

### Tailwind Config
```js
theme: {
  extend: {
    colors: {
      navy: "#002147",
      "suss-red": "#C8102E",
    },
    fontFamily: {
      sans: ["DM Sans", "sans-serif"],
    },
  },
},
darkMode: "class",
```

### Dark Mode
- Toggle in Navbar writes `dark` / removes `dark` from `document.documentElement.classList`
- Preference persisted to `localStorage` and read on initial load in `main.jsx`
- Dark palette: `gray-950` page background, `gray-900` cards, `gray-100` text
- Navbar in dark mode: `gray-900` background

### Google Fonts
DM Sans loaded via `<link>` in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 8. Vercel Config

`vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

No other Vercel configuration needed — Vite builds to `dist/` which Vercel detects automatically.

---

## 9. All Links by Category

### 1. Academics
| Name | Description | href | portalPath |
|------|-------------|------|------------|
| Canvas | Course materials, submissions, grades | https://canvas.suss.edu.sg | null |
| Canvas Calendar | Deadlines across all courses | https://canvas.suss.edu.sg/calendar | null |
| Canvas Inbox | Messages from tutors and lecturers | https://canvas.suss.edu.sg/conversations | null |
| Course Timetable | View your class schedule | https://sims1.suss.edu.sg/EService/Student/CourseTimetable/CourseTimetableMain.aspx | null |
| Personalised Exam Timetable | Your exam schedule | https://sims1.suss.edu.sg/EService/Student/PersonalizedTimetable/StuPersonalizedTimetable.aspx | null |
| View Exam Result | Check your grades | https://sims1.suss.edu.sg/EService/Student/StudentAcademicProfile/ViewExamResults.aspx | null |
| eCourse Registration | Enrol in courses | https://sims1.suss.edu.sg/EService/Student/CourseRegistrationFullTime/ECRMain.aspx | null |
| Student Academic Profile | View your academic record | https://portal.suss.edu.sg | Login → E-Services → Student Academic Profile |
| View Curriculum Plan | Track degree progress | https://portal.suss.edu.sg | Login → E-Services → View Curriculum Plan |
| Student Academic Progression | Monitor progression status | https://portal.suss.edu.sg | Login → E-Services → Student Academic Progression |
| Course Material Contents Checklist | Check materials for your courses | https://portal.suss.edu.sg | Login → Course Material Contents Checklist |
| Panopto | Replay recorded lectures | https://canvas.suss.edu.sg | null |

### 2. Admin and E-Services
| Name | Description | href | portalPath |
|------|-------------|------|------------|
| Student Portal | Central student hub | https://portal.suss.edu.sg | null |
| eCourse Offer and Confirmation | Confirm your course offer | https://portal.suss.edu.sg | Login → E-Services → eCourse Offer and Confirmation |
| Pass/Fail Conversion | Apply for S/U option | https://portal.suss.edu.sg | Login → E-Services → Pass/Fail Conversion Application |
| Appeal / Final Grade Appeal | Contest a grade | https://portal.suss.edu.sg | Login → E-Services → Appeal / Final Grade Appeal |
| Challenge Examination (CEX) Portal | Apply for CEX | https://portal.suss.edu.sg | Login → E-Services → Challenge Examination Portal |
| Special Resit Exam | Apply for resit | https://portal.suss.edu.sg | Login → E-Services → Special Resit Exam |
| Application for Mark Deduction | Submit mark deduction appeal | https://portal.suss.edu.sg | Login → E-Services → Application for Mark Deduction |
| Graduation Filing | File for graduation | https://portal.suss.edu.sg | Login → E-Services → Graduation Filing |
| Minor Declaration | Declare a minor | https://portal.suss.edu.sg | Login → E-Services → Minor Declaration |
| Restart Acknowledgement | Re-admission acknowledgement | https://portal.suss.edu.sg | Login → E-Services → Restart Acknowledgement |
| Event Service Online | Register for SUSS events | https://portal.suss.edu.sg | Login → E-Services → Event Service Online |
| Application for Overseas Examination | Sit exams overseas | https://portal.suss.edu.sg | Login → E-Services → Application for Overseas Examination |
| SSG Funding (SC/SPR Postgrad) | SkillsFuture funding | https://portal.suss.edu.sg | Login → E-Services → SSG Funding |
| Student Handbook | Rules, regulations, policies | https://portal.suss.edu.sg | Login → Student Handbook |
| Administrative Forms | All admin form submissions | https://portal.suss.edu.sg | Login → Administrative Forms |
| Survey Platform | SUSS student surveys | https://portal.suss.edu.sg | Login → Survey Platform |
| Policy and Procedures | University policies | https://portal.suss.edu.sg | Login → Policy and Procedures |

### 3. Library
| Name | Description | href | portalPath |
|------|-------------|------|------------|
| SUSS Library Home | Main library portal | https://library.suss.edu.sg | null |
| Library Search | Find articles, eBooks, physical books | https://search.library.suss.edu.sg/primo-explore/search?vid=SUSS&lang=en_US | null |
| Databases A–Z | All subscribed academic databases | https://libguides.suss.edu.sg/az/databases | null |
| Research Guides | Subject-specific research help | https://libguides.suss.edu.sg/researchguides | null |
| Discussion Room Booking | Book a group study room | https://suss.libcal.com/spaces | null |
| Library FAQs | Common library questions | https://libanswers.suss.edu.sg | null |
| Librarian Consultation | Book a 1-on-1 with a librarian | https://suss.libcal.com/appointments/suss/online-consultations | null |
| Library Events | Workshops and library events | https://suss.libcal.com/calendar/ | null |
| Document Delivery Service | Request articles from other libraries | https://search.library.suss.edu.sg/discovery/blankIll?vid=65SUSS_INST:SUSS | null |
| AI Library Search | AI-powered research assistant | https://search.library.suss.edu.sg/discovery/researchAssistant?vid=65SUSS_INST%3ASUSS | null |
| Library Blog | Library news and tips | https://libguides.suss.edu.sg/blog | null |
| Library Opening Hours | Current library hours | https://library.suss.edu.sg/opening-hours/ | null |

### 4. Career
| Name | Description | href | portalPath |
|------|-------------|------|------------|
| Career Portal | Jobs, WA tracking, resume builder | https://susscareerportal.suss.edu.sg | null |
| Resume Builder | Build an ATS-scored resume | https://susscareerportal.suss.edu.sg | Login → My Tools → Resume Builder |
| Job Portal | Browse and apply for jobs | https://susscareerportal.suss.edu.sg | Login → My Tools → Job Portal |
| Cover Letter Tool | Draft cover letters | https://susscareerportal.suss.edu.sg | Login → My Tools → Cover Letter |
| Work Attachment Progress | Track your WA milestones | https://susscareerportal.suss.edu.sg | Login → Home → Your Work Attachment |
| Career Development Info | SUSS CD team info and contacts | https://www.suss.edu.sg/cd | null |

### 5. Financial
| Name | Description | href | portalPath |
|------|-------------|------|------------|
| View Outstanding Invoice / Pay | Pay outstanding fees | https://sims1.suss.edu.sg/EService/Student/BillAndAcceptePayment/ePayment.aspx | null |
| View All Invoices / Receipts | Full payment history | https://portal.suss.edu.sg | Login → E-Services → View All Invoices / Receipts |
| Full Time Scholarship / Financial Aid | Apply for financial assistance | https://portal.suss.edu.sg | Login → E-Services → Full Time Scholarship / Financial Aid eApplication |
| SSG Funding | SkillsFuture funding application | https://portal.suss.edu.sg | Login → E-Services → SSG Funding |

### 6. Facilities and Campus
| Name | Description | href | portalPath |
|------|-------------|------|------------|
| Discussion Room Booking | Book a group study room (5 rooms, capacity 5) | https://suss.libcal.com/spaces | null |
| Sports Hall and Dance Studio Booking | Book sports facilities | https://sites.google.com/view/suss-ig/suss-facilities-booking/sports-hall-dance-studio-booking | null |
| Campus Map and Facilities | Campus navigation | https://www.suss.edu.sg/about-suss/resources/campus-location-and-facilities | null |
| Counselling and Life Coaching | Book counselling sessions | https://portal.suss.edu.sg | Login → Counselling and Life Coaching |

### 7. Forms and Admin
| Name | Description | href | portalPath |
|------|-------------|------|------------|
| Administrative Forms | All admin form submissions | https://portal.suss.edu.sg | Login → Administrative Forms |
| Survey Platform | SUSS student surveys | https://portal.suss.edu.sg | Login → Survey Platform |
| Course Material Contents Checklist | Check what materials you should have | https://portal.suss.edu.sg | Login → Course Material Contents Checklist |
| Policy and Procedures | University policies | https://portal.suss.edu.sg | Login → Policy and Procedures |

### 8. Notices and Support
| Name | Description | href | portalPath |
|------|-------------|------|------------|
| News and Notices | All school-wide announcements | https://portal.suss.edu.sg | Login → News and Notices |
| Important Deadlines | Academic calendar deadlines | https://portal.suss.edu.sg | Login → Important Deadlines |
| Advisory Notes | Official advisories | https://portal.suss.edu.sg | Login → Advisory Notes |
| Student Support | Hotline 6330 9111 press 1, Mon–Fri 8:30am–5:30pm | https://portal.suss.edu.sg | null |
| Student Support Email | Written enquiries | mailto:students@suss.edu.sg | null |
| IT Service Desk | Technical support on campus, call 6248 9090 | https://portal.suss.edu.sg | null |
| Ask The Library | Research and resource help | https://libanswers.suss.edu.sg | null |
| Librarian Consultation | Book a librarian | https://suss.libcal.com/appointments/suss/online-consultations | null |

---

## 10. Out of Scope

- Authentication / user accounts
- Backend or database
- Dark mode auto-detection (media query) — user toggles manually
- Embedded iframes of live pages
- Analytics
