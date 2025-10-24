# Invoice App

A modern, full-stack web application for creating, managing, and tracking invoices with user authentication, role-based access, and comprehensive invoice management features.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Components](#components)
- [Utilities & Helpers](#utilities--helpers)
- [State Management](#state-management)
- [Development](#development)
- [Scripts](#scripts)

---

## Features

### User Authentication
- **User Registration**: Create new accounts with email, name, and password
- **Login**: Secure login using NextAuth.js with JWT sessions
- **Password Validation**: Strong password requirements with real-time validation feedback
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (!@#$%^&*)
- **Session Management**: JWT-based sessions with 30-day expiration
- **Password Security**: Passwords hashed using bcryptjs (12 salt rounds)

### Invoice Management
- **Create Invoices**: Full invoice creation with multiple items, addresses, and payment terms
- **Draft Invoices**: Save invoices as drafts before finalizing
- **View Invoices**: List all invoices with filtering by status (draft, pending, paid)
- **Edit Invoices**: Modify draft invoices
- **Delete Invoices**: Remove invoices from the system
- **Mark as Paid**: Change invoice status from pending to paid
- **Invoice Status Tracking**: Track invoice status through draft → pending → paid workflow

### Invoice Details
- **Automatic ID Generation**: Unique invoice IDs in format INV-XXXXXX
- **Client Information**: Store client name, email, and address details
- **Sender Information**: Store business address details
- **Line Items**: Add multiple items with quantity, price, and automatic total calculation
- **Payment Terms**: Configurable payment terms (1, 7, 14, or 30 days)
- **Automatic Due Date**: Payment due date calculated from creation date and payment terms
- **Item Totals**: Automatic calculation of item totals and invoice totals
- **Description**: Project or service description for each invoice

### Data Filtering & Search
- **Status Filtering**: Filter invoices by status (all, draft, pending, paid)
- **User Isolation**: Each user only sees their own invoices
- **Sorting**: Invoices sorted by creation date (newest first)

### Form Validation
- **Client-Side Validation**: Real-time form validation with error messages
- **Server-Side Validation**: All inputs validated on the backend
- **Password Strength Checker**: Real-time feedback on password criteria
- **Email Validation**: RFC-compliant email format validation
- **Invoice Validation**: Complete invoice data validation before submission

---

## Tech Stack

### Frontend
- **Next.js 16.0.0**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5**: Type safety
- **Sass 1.93.2**: CSS preprocessing with SCSS modules
- **React Query 5.90.5**: Data fetching and caching
- **React Hot Toast 2.6.0**: Toast notifications
- **React Icons 5.5.0**: Icon library
- **NextAuth.js 4.24.11**: Authentication and authorization

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB 8.19.2**: NoSQL database
- **Mongoose 8.19.2**: MongoDB object modeling
- **Bcryptjs 3.0.2**: Password hashing and security
- **NextAuth.js 4.24.11**: Authentication middleware

### Development
- **ESLint 9**: Code linting
- **tsx 4.7.0**: TypeScript execution for scripts
- **Node 20+**: Runtime environment

---

## Project Structure

```
invoiceapp/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts       # NextAuth configuration
│   │   ├── invoices/
│   │   │   ├── route.ts                     # GET, POST invoices
│   │   │   └── [id]/route.ts                # GET, PUT, PATCH, DELETE single invoice
│   │   └── register/route.ts                # POST user registration
│   ├── auth/
│   │   ├── login/page.tsx                   # Login page
│   │   └── register/page.tsx                # Registration page
│   ├── invoices/
│   │   ├── page.tsx                         # Invoices list page
│   │   ├── [id]/page.tsx                    # Invoice detail page
│   │   ├── new/page.tsx                     # New invoice page
│   │   └── layout.tsx                       # Invoices layout with header
│   ├── layout.tsx                           # Root layout with providers
│   ├── page.tsx                             # Root page (redirects to /invoices)
│   └── globals.css                          # Global styles
├── components/
│   ├── auth/
│   │   ├── RegisterForm.tsx                 # Registration form with password validation
│   │   ├── LoginForm.tsx                    # Login form
│   │   └── form.module.css                  # Auth form styles
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx                   # Reusable button component
│   │   │   └── Button.module.scss           # Button styles
│   │   ├── Modal/
│   │   │   ├── Modal.tsx                    # Modal component
│   │   │   └── Modal.module.scss            # Modal styles
│   │   └── Other common components...
│   ├── invoice/
│   │   ├── CreateInvoiceModal/
│   │   │   ├── CreateInvoiceModal.tsx       # Invoice creation modal
│   │   │   └── CreateInvoiceModal.module.scss
│   │   ├── InvoiceList/                     # Invoices list display
│   │   ├── InvoiceDetail/                   # Single invoice detail view
│   │   ├── InvoiceFilter/                   # Status filter component
│   │   └── Other invoice components...
│   └── layout/
│       └── Header/
│           ├── Header.tsx                   # App header with filter and new button
│           └── Header.module.scss           # Header styles
├── context/
│   ├── ThemeContext.tsx                     # Theme context (light/dark mode)
│   └── InvoicesContext.tsx                  # Invoices data context
├── hooks/
│   ├── useInvoices.ts                       # React Query hooks for invoices
│   └── useFormValidation.ts                 # Form validation hook
├── lib/
│   ├── api.ts                               # API client with error handling
│   ├── mongodb.ts                           # MongoDB connection management
│   ├── queryClient.ts                       # React Query client
│   └── react-query-provider.tsx             # React Query provider component
├── models/
│   ├── Invoice.ts                           # Invoice Mongoose schema and model
│   └── User.ts                              # User Mongoose schema and model
├── types/
│   ├── invoice.ts                           # Invoice TypeScript interfaces
│   ├── user.ts                              # User TypeScript interfaces
│   ├── api.ts                               # API response interfaces
│   └── next-auth.d.ts                       # NextAuth type declarations
├── utils/
│   ├── validation.ts                        # Form and invoice validation logic
│   └── formatters.ts                        # Date, currency, and ID formatting utilities
├── styles/
│   ├── theme.css                            # CSS theme variables
│   ├── variables.scss                       # SCSS variables
│   └── mixins.scss                          # SCSS mixins
├── public/                                  # Static assets
├── scripts/
│   └── seed.ts                              # Database seeding script
├── package.json                             # Dependencies and scripts
├── tsconfig.json                            # TypeScript configuration
├── next.config.ts                           # Next.js configuration
├── eslint.config.mjs                        # ESLint configuration
└── README.md                                # This file
```

---

## Getting Started

### Prerequisites

- **Node.js 18+** (tested with Node 20)
- **npm or yarn** package manager
- **MongoDB** (local or Atlas cloud database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoiceapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   See [Environment Variables](#environment-variables) section for required variables.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoiceapp?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# (Optional) API base URL for production
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Environment Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NEXTAUTH_URL` | Your application's URL | `http://localhost:3000` or `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth JWT signing | Any random string (generate with `openssl rand -base64 32`) |

---

## Database Schema

### User Schema

```typescript
{
  _id: ObjectId,
  name: String (required, 2-50 characters),
  email: String (required, unique, valid email format),
  password: String (required, hashed with bcryptjs, 6+ characters),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes**: Email is unique and indexed for faster lookups.

### Invoice Schema

```typescript
{
  _id: ObjectId,
  invoiceId: String (required, unique, e.g., "INV-ABC123"),
  userId: String (required, indexed for user isolation),
  createdAt: String (ISO format),
  paymentDue: String (ISO format, calculated from terms),
  description: String (required, max 500 characters),
  paymentTerms: Number (required, enum: [1, 7, 14, 30]),
  clientName: String (required),
  clientEmail: String (required, valid email),
  status: String (enum: ["draft", "pending", "paid"], default: "draft"),
  
  senderAddress: {
    street: String (required),
    city: String (required),
    postCode: String (required),
    country: String (required)
  },
  
  clientAddress: {
    street: String (required),
    city: String (required),
    postCode: String (required),
    country: String (required)
  },
  
  items: [
    {
      name: String (required),
      quantity: Number (required, min: 1),
      price: Number (required, min: 0),
      total: Number (auto-calculated: quantity × price)
    }
  ],
  
  total: Number (auto-calculated sum of all item totals),
  timestamps: {
    createdAt: Date,
    updatedAt: Date
  }
}
```

**Indexes**:
- `{ userId: 1, status: 1 }` - For filtering invoices by user and status
- `{ createdAt: -1 }` - For sorting by creation date

**Pre-save Middleware**: Automatically calculates item totals and invoice total before saving.

---

## API Documentation

All API endpoints require authentication (JWT token via NextAuth.js).

### Invoice Endpoints

#### Get All Invoices
```http
GET /api/invoices?status=pending
```

**Query Parameters:**
- `status` (optional): Filter by status - "all", "draft", "pending", or "paid" (default: "all")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "invoiceId": "INV-ABC123",
      "clientName": "John Doe",
      "status": "pending",
      "total": 1500.00,
      "createdAt": "2024-01-15",
      "paymentDue": "2024-02-15",
      ...
    }
  ]
}
```

#### Get Single Invoice
```http
GET /api/invoices/{id}
```

**Parameters:**
- `id` (path): MongoDB invoice ID

**Response:**
```json
{
  "success": true,
  "data": { /* full invoice object */ }
}
```

#### Create Invoice
```http
POST /api/invoices
Content-Type: application/json

{
  "description": "Web Design Services",
  "paymentTerms": 30,
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "status": "draft",
  "createdAt": "2024-01-15",
  "senderAddress": {
    "street": "19 Union Terrace",
    "city": "London",
    "postCode": "E1 3EZ",
    "country": "United Kingdom"
  },
  "clientAddress": {
    "street": "123 Main St",
    "city": "New York",
    "postCode": "10001",
    "country": "USA"
  },
  "items": [
    {
      "name": "Design Work",
      "quantity": 10,
      "price": 150.00,
      "total": 1500.00
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created invoice with generated ID */ },
  "message": "Invoice created successfully"
}
```

**Status Code**: 201 Created

#### Update Invoice
```http
PUT /api/invoices/{id}
Content-Type: application/json

{
  "clientName": "Jane Doe",
  "items": [ /* updated items */ ],
  ...
}
```

**Notes**:
- Only draft invoices can be edited
- Validation runs on all provided fields
- Totals are automatically recalculated

**Response:**
```json
{
  "success": true,
  "data": { /* updated invoice */ },
  "message": "Invoice updated successfully"
}
```

#### Update Invoice Status
```http
PATCH /api/invoices/{id}
Content-Type: application/json

{
  "status": "paid"
}
```

**Status Transitions:**
- `draft` → `pending` (when finalized)
- `pending` → `paid` (when payment received)

**Response:**
```json
{
  "success": true,
  "data": { /* updated invoice */ },
  "message": "Invoice status updated successfully"
}
```

#### Delete Invoice
```http
DELETE /api/invoices/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

**Status Code**: 200 OK

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules**:
- Name: 2-50 characters
- Email: Valid email format, unique
- Password: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Registration successful"
}
```

**Status Code**: 201 Created

#### Login (via NextAuth)
Handled by NextAuth.js at `/api/auth/signin` with provider-specific credentials.

### Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Descriptive error message",
  "data": null
}
```

**Common Status Codes**:
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing authentication
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., duplicate email)
- `500 Internal Server Error`: Server error

---

## Authentication

### NextAuth.js Configuration

- **Provider**: Credentials (email/password)
- **Session Strategy**: JWT
- **Session Duration**: 30 days
- **Password Hashing**: bcryptjs with 12 salt rounds

### Session Flow

1. **User registers** → Password hashed → User stored in MongoDB
2. **User logs in** → Password verified with bcryptjs → JWT token generated
3. **JWT token** → Stored in secure HTTP-only cookie
4. **Subsequent requests** → Cookie automatically included → Verified on protected routes

### Protected Routes

All `/api` routes except `/api/register` and `/api/auth/*` require authentication.

Frontend pages protected:
- `/invoices` - Requires active session
- `/invoices/[id]` - Requires active session and ownership
- `/invoices/new` - Requires active session

Public pages:
- `/auth/login` - Login page
- `/auth/register` - Registration page

---

## Components

### Authentication Components

#### RegisterForm
**Location**: `components/auth/RegisterForm.tsx`

Displays a registration form with:
- Name input
- Email input
- Password input with real-time strength validation
- Confirm password input
- Password strength checklist showing:
  - ✓ At least 8 characters
  - ✓ At least one uppercase letter
  - ✓ At least one lowercase letter
  - ✓ At least one number
  - ✓ At least one special character
- Submit button

**Props**: None (standalone component)

#### LoginForm
**Location**: `components/auth/LoginForm.tsx`

Displays a login form with:
- Email input
- Password input
- Submit button with loading state

### Invoice Components

#### CreateInvoiceModal
**Location**: `components/invoice/CreateInvoiceModal/CreateInvoiceModal.tsx`

Modal form for creating invoices with:
- Bill From section (sender address)
- Bill To section (client details and address)
- Invoice Details section (date, payment terms, description)
- Item List section (dynamic items with add/remove)
- Action buttons (Discard, Save as Draft, Save & Send)
- Real-time form validation
- Auto-calculation of item totals

**Props**:
```typescript
interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (invoice: CreateInvoiceInput) => void;
  isSubmitting?: boolean;
  onSuccess?: () => void;
}
```

#### InvoiceList
**Location**: `components/invoice/InvoiceList/`

Displays invoices in a list/card view with:
- Invoice ID, client name, amount, status
- Status badge with color coding
- Click to view details

#### InvoiceFilter
**Location**: `components/invoice/InvoiceFilter/`

Dropdown filter for invoice status selection:
- All invoices
- Draft invoices
- Pending invoices
- Paid invoices

#### Header
**Location**: `components/layout/Header/Header.tsx`

Main app header with:
- Invoice count display
- Status filter
- New Invoice button

### Common Components

#### Button
**Location**: `components/common/Button/Button.tsx`

Reusable button component with props:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "dark" | "tertiary";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}
```

#### Modal
**Location**: `components/common/Modal/Modal.tsx`

Reusable modal component with customizable title, size, and close button.

---

## Utilities & Helpers

### Validation Utilities
**Location**: `utils/validation.ts`

**Functions**:

- `validateEmail(email: string): boolean` - Check if email format is valid
- `validateRegistration(email, password, name): ValidationResult` - Validate user registration input
- `validateLogin(email, password): ValidationResult` - Validate login credentials
- `validateInvoiceInput(input): ValidationResult` - Validate complete invoice data
- `validateAddress(address, prefix): ValidationError[]` - Validate address fields
- `validateInvoiceItem(item, index): ValidationError[]` - Validate invoice items
- `validatePasswordStrength(password): PasswordStrengthCriteria` - Check password strength criteria
- `isPasswordStrong(criteria): boolean` - Check if password meets all criteria

**Password Strength Criteria**:
```typescript
interface PasswordStrengthCriteria {
  minLength: boolean;        // 8+ characters
  uppercase: boolean;        // A-Z
  lowercase: boolean;        // a-z
  number: boolean;           // 0-9
  specialChar: boolean;      // !@#$%^&*()_+...
}
```

### Formatter Utilities
**Location**: `utils/formatters.ts`

**Functions**:

- `generateInvoiceId(): string` - Generate unique invoice ID (INV-XXXXXX)
- `calculatePaymentDue(createdAt, paymentTerms): string` - Calculate due date from terms
- `calculateTotal(items): number` - Sum all item totals
- `formatCurrency(amount): string` - Format number as USD currency
- `formatDate(dateString): string` - Format date as "January 1, 2024"
- `getInitials(name): string` - Extract name initials (max 2 characters)

---

## State Management

### React Query (TanStack Query)

**Location**: `lib/queryClient.ts`, `hooks/useInvoices.ts`

Used for server state management with:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

**Hooks**:

#### useInvoices(status?: string)
Fetch all invoices with optional status filter
```typescript
const { data, isLoading, error } = useInvoices('pending');
```

#### useInvoice(id: string)
Fetch single invoice by ID
```typescript
const { data: invoice, isLoading, error } = useInvoice(invoiceId);
```

#### useCreateInvoice()
Create new invoice
```typescript
const { mutateAsync: createInvoice, isPending } = useCreateInvoice();
await createInvoice(invoiceData);
```

#### useUpdateInvoice()
Update existing invoice
```typescript
const { mutateAsync: updateInvoice } = useUpdateInvoice();
await updateInvoice({ id, data: updatedData });
```

#### useDeleteInvoice()
Delete invoice
```typescript
const { mutateAsync: deleteInvoice } = useDeleteInvoice();
await deleteInvoice(invoiceId);
```

#### useMarkAsPaid()
Change invoice status to paid
```typescript
const { mutateAsync: markAsPaid } = useMarkAsPaid();
await markAsPaid(invoiceId);
```

### Context API

#### ThemeContext
**Location**: `context/ThemeContext.tsx`

Manages light/dark theme:
- `useTheme()` hook for accessing theme
- `theme` - Current theme ("light" or "dark")
- `toggleTheme()` - Switch between themes

---

## Development

### Code Style

- **Language**: TypeScript (strict mode)
- **Styling**: SCSS modules for components
- **Naming**: camelCase for variables/functions, PascalCase for components
- **API**: RESTful conventions

### Linting

Run ESLint:
```bash
npm run lint
```

### Type Checking

TypeScript compilation:
```bash
npm run build
```

### Database Seeding

Seed initial data:
```bash
npm run seed
```

---

## Scripts

### Development
```bash
npm run dev
```
Start development server on http://localhost:3000

### Build
```bash
npm run build
```
Build application for production

### Start
```bash
npm start
```
Run production build

### Lint
```bash
npm run lint
```
Check code quality with ESLint

### Seed Database
```bash
npm run seed
```
Populate database with sample data

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Self-Hosted

1. Set up Node.js environment
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Set environment variables
5. Start: `npm start`

### Database

- **MongoDB Atlas** (recommended): Free tier available
- **Self-hosted MongoDB**: Docker or local installation

---

## Troubleshooting

### Connection Issues

**"MongoDB connection error"**
- Check `MONGODB_URI` in `.env.local`
- Verify network access in MongoDB Atlas
- Check database credentials

**"Unauthorized" on API calls**
- Verify `NEXTAUTH_SECRET` is set
- Check session cookie in browser
- Log out and log back in

### Build Errors

**"Type error in TypeScript"**
```bash
npm run build
```

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Form Submission Issues

**"Invoice not creating"**
- Check browser console for error messages
- Verify all required fields are filled
- Check network tab for API response

---

## License

This project is private and not licensed for public use.

## Support

For issues or questions, contact the development team or create an issue in the project repository.
