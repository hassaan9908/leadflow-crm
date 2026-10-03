# LeadFlow CRM

A modern multi-tenant Sales CRM built with **Next.js, TypeScript, Supabase, and Tailwind CSS**.

LeadFlow helps sales teams manage leads, companies, deals, activities, workspaces, and team members from a single dashboard.

## Live Demo

**Live Application:**  
https://leadflow-crm-black.vercel.app

**GitHub Repository:**  
https://github.com/hassaan9908/leadflow-crm

---

## Features

### Dashboard & Analytics

- Sales performance dashboard
- Total leads and qualified leads
- Active deals and pipeline value
- Won revenue
- Deal conversion rate
- Deals by stage chart
- Leads by status chart
- Recent activity feed

### Lead Management

- Create, view, edit, and delete leads
- Search leads by name or email
- Filter by status and country
- Lead scoring
- Lead status tracking
- Associate leads with companies
- Activity timeline for each lead

### Company Management

- Create, view, edit, and delete companies
- Store industry, country, website, and company size
- View leads associated with each company
- Company-specific CRM information

### Sales Pipeline

- Kanban-style deal pipeline
- Drag-and-drop deal stages
- Optimistic UI updates
- Track deal value
- Expected close dates
- Associate deals with leads and companies
- Deal activity timeline

Pipeline stages include:

- New
- Contacted
- Qualified
- Proposal
- Negotiation
- Won
- Lost

### Activities

Track sales interactions including:

- Calls
- Emails
- Meetings
- Notes
- Follow-ups

Activities can be associated with leads and deals.

### Multi-Workspace Architecture

LeadFlow supports multiple isolated workspaces.

Users can:

- Create their own workspace automatically on signup
- Join additional workspaces through invitations
- Switch between workspaces
- Keep CRM data isolated per workspace

### Team Management

Workspace roles:

- **Owner**
- **Admin**
- **Member**

Role-based permissions control actions such as:

- Inviting team members
- Updating member roles
- Deleting CRM records
- Renaming workspaces
- Managing workspace data

### Workspace Invitations

- Invite users using email addresses
- Accept pending workspace invitations
- Assign invited users as Admin or Member
- View invitations directly from the Team section

### Authentication

Authentication is powered by Supabase Auth.

The application supports:

- User signup
- Login
- Logout
- Protected dashboard routes
- Automatic profile creation
- Automatic workspace creation for new users

### Security

LeadFlow uses **PostgreSQL Row Level Security (RLS)** with Supabase.

Security includes:

- Workspace-level data isolation
- Role-based database policies
- Authenticated-only CRM access
- Workspace membership verification
- Restricted delete operations
- Secure invitation acceptance
- Profile visibility limited to workspace members

### Form Validation

Forms use **Zod** validation for:

- Leads
- Companies
- Deals

Validation includes required fields, valid URLs/emails, number ranges, UUID validation, and enum validation.

### UX Features

- Success and error toast notifications
- Delete confirmations
- Loading skeletons
- Empty states
- Responsive navigation
- Active sidebar highlighting
- Mobile navigation
- Optimistic pipeline updates

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Base UI
- Lucide Icons

### Backend & Database

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security
- Server Actions

### Libraries

- dnd-kit — drag-and-drop pipeline
- Recharts — dashboard analytics
- Zod — form validation
- Sonner — toast notifications

### Deployment

- Vercel
- Supabase Cloud

---

## Architecture

LeadFlow follows a multi-tenant workspace architecture.

```text
User
 │
 ├── Profile
 │
 └── Workspace Membership
        │
        └── Workspace
             ├── Companies
             ├── Leads
             ├── Deals
             ├── Activities
             ├── Members
             └── Invitations
```

Every CRM record contains a `workspace_id`.

Database RLS policies ensure users can only access records belonging to workspaces where they are members.

---

## Role Permissions

| Feature | Owner | Admin | Member |
|---|---|---|---|
| View CRM data | ✅ | ✅ | ✅ |
| Create CRM records | ✅ | ✅ | ✅ |
| Edit CRM records | ✅ | ✅ | ✅ |
| Delete Leads / Companies / Deals | ✅ | ✅ | ❌ |
| Invite Members | ✅ | ✅ | ❌ |
| Manage Members | ✅ | Limited | ❌ |
| Promote Member to Admin | ✅ | ❌ | ❌ |
| Manage Admins | ✅ | ❌ | ❌ |
| Rename Workspace | ✅ | ❌ | ❌ |

---

## Database Tables

The main PostgreSQL tables include:

```text
profiles
workspaces
workspace_members
workspace_invitations
companies
leads
deals
activities
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/hassaan9908/leadflow-crm.git
cd leadflow-crm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not commit `.env.local` to GitHub.

### 4. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Production Build

Run:

```bash
npm run build
```

Then:

```bash
npm start
```

---

## Deployment

The project is deployed using Vercel.

Required production environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The Supabase Authentication Site URL should point to the production Vercel domain.

---

## Project Structure

```text
src/
├── app/
│   ├── auth/
│   ├── dashboard/
│   │   ├── activities/
│   │   ├── companies/
│   │   ├── invitations/
│   │   ├── leads/
│   │   ├── pipeline/
│   │   ├── settings/
│   │   └── team/
│   ├── login/
│   └── signup/
│
├── components/
│   ├── dashboard/
│   ├── pipeline/
│   ├── shared/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   └── validations/
│
└── types/
    └── database.ts
```

---

## Key Engineering Concepts Demonstrated

This project demonstrates practical experience with:

- Full-stack Next.js development
- React Server Components
- Next.js Server Actions
- TypeScript
- PostgreSQL relational modeling
- Supabase authentication
- Row Level Security
- Multi-tenant SaaS architecture
- Role-based access control
- Optimistic UI updates
- Drag-and-drop interfaces
- Form validation
- Responsive UI development
- Production deployment

---

## Future Improvements

Potential future additions include:

- Email notifications for invitations
- Pipeline forecasting
- Advanced analytics
- Activity filtering
- Pagination
- CSV lead import/export
- Audit logs
- Custom deal stages
- Dark mode
- CRM integrations

---

## Author

**Muhammad Hassaan**

GitHub:  
https://github.com/hassaan9908

---

## License

This project was created as a portfolio and learning project.
