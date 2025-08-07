# Discord Clone

A full-stack Discord clone built with modern web technologies, featuring real-time messaging, server management, and a sleek user interface that closely mimics Discord's design and functionality.

## 🌟 Features

- **🔐 Authentication & Authorization**: Secure user authentication with Clerk
- **🏠 Server Management**: Create and manage Discord-like servers
- **👥 Member Roles**: Admin, Moderator, and Guest role system
- **💬 Multiple Channel Types**: Text, Audio, and Video channels
- **🎨 Modern UI/UX**: Discord-inspired interface with dark/light theme support
- **📱 Responsive Design**: Works seamlessly across all devices
- **⚡ Real-time Updates**: Built for real-time messaging (implementation ready)
- **🔍 Type Safety**: Full TypeScript implementation

## 🚀 Tech Stack

### **Frontend**

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components built on Radix UI
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon library
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Theme management

### **Backend & Database**

- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Reliable relational database
- **[Clerk](https://clerk.com/)** - Complete authentication solution

### **Form Management & Validation**

- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with minimal re-renders
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolvers

### **UI & Styling**

- **[Radix UI](https://www.radix-ui.com/)** - Low-level UI primitives
- **[Class Variance Authority](https://cva.style/docs)** - Component variant management
- **[clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Conditional class utilities

### **Development Tools**

- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[tw-animate-css](https://github.com/tailwindlabs/tailwindcss-animate)** - Animation utilities

## 📊 Database Schema

### **Entity Relationship Diagram**

```mermaid
erDiagram
    Profile ||--o{ Server : creates
    Profile ||--o{ Member : "belongs to"
    Profile ||--o{ Channel : creates
    Server ||--o{ Member : contains
    Server ||--o{ Channel : has

    Profile {
        string id PK
        string userId UK "Clerk User ID"
        string name
        string imageUrl
        string email
        datetime createdAt
        datetime updatedAt
    }

    Server {
        string id PK
        string name
        string imageUrl
        string inviteCode
        string profileId FK
        datetime createdAt
        datetime updatedAt
    }

    Member {
        string id PK
        MemberRole role "ADMIN|MODERATOR|GUEST"
        string profileId FK
        string serverId FK
        datetime createdAt
        datetime updatedAt
    }

    Channel {
        string id PK
        string name
        ChannelType type "TEXT|AUDIO|VIDEO"
        string profileId FK
        string serverId FK
        datetime createdAt
        datetime updatedAt
    }
```

### **Database Relations**

#### **Profile Model**

```prisma
model Profile {
  id       String @id @default(uuid())
  userId   String @unique  // Clerk User ID
  name     String
  imageUrl String @db.Text
  email    String @db.Text

  // Relations
  servers  Server[]   // Servers created by this user
  members  Member[]   // Server memberships
  channels Channel[]  // Channels created by this user

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### **Server Model**

```prisma
model Server {
  id         String @id @default(uuid())
  name       String
  imageUrl   String @db.Text
  inviteCode String @db.Text

  // Foreign Key
  profileId String
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  // Relations
  members  Member[]
  channels Channel[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([profileId])
}
```

#### **Member Model**

```prisma
model Member {
  id   String     @id @default(uuid())
  role MemberRole @default(GUEST)

  // Foreign Keys
  profileId String
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  serverId String
  server   Server @relation(fields: [serverId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([profileId])
  @@index([serverId])
}

enum MemberRole {
  ADMIN
  MODERATOR
  GUEST
}
```

#### **Channel Model**

```prisma
model Channel {
  id   String      @id @default(uuid())
  name String
  type ChannelType @default(TEXT)

  // Foreign Keys
  profileId String
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  serverId String
  server   Server @relation(fields: [serverId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([profileId])
  @@index([serverId])
}

enum ChannelType {
  TEXT
  AUDIO
  VIDEO
}
```

### **Key Relationships**

1. **Profile ↔ Server**: One-to-Many (A user can create multiple servers)
2. **Profile ↔ Member**: One-to-Many (A user can be a member of multiple servers)
3. **Server ↔ Member**: One-to-Many (A server can have multiple members)
4. **Server ↔ Channel**: One-to-Many (A server can have multiple channels)
5. **Profile ↔ Channel**: One-to-Many (A user can create multiple channels)

## 🏗️ Project Structure

```
discord-clone/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── (routes)/
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── sign-up/
│   │   └── layout.tsx            # Auth layout (centered)
│   ├── (setup)/                  # Initial setup
│   │   └── page.tsx              # Server creation flow
│   ├── globals.css               # Global styles & CSS variables
│   └── layout.tsx                # Root layout
├── components/                   # Reusable components
│   ├── modals/
│   │   └── initial-modal.tsx     # Server creation modal
│   ├── providers/
│   │   └── theme-provider.tsx    # Theme context provider
│   ├── ui/                       # Shadcn/ui components
│   └── mod-toggle.tsx            # Theme toggle component
├── lib/                          # Utility functions
│   ├── generated/prisma/         # Generated Prisma client
│   ├── db.ts                     # Database connection
│   ├── initial-profile.ts        # User profile management
│   └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
└── public/                       # Static assets
```

## 🚦 Getting Started

### **Prerequisites**

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/discord-clone.git
   cd discord-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/discord_clone"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push

   # (Optional) Open Prisma Studio
   npx prisma studio
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Application Flow

### **User Journey**

1. **Authentication**
   - New users are redirected to `/sign-up`
   - Existing users go to `/sign-in`
   - Clerk handles the entire authentication flow

2. **Profile Creation**
   - After authentication, `initialProfile()` function runs
   - Creates a new profile in the database if it doesn't exist
   - Links Clerk user data with the application's user profile

3. **Server Setup**
   - Checks if the user belongs to any servers
   - If yes → Redirects to the first server
   - If no → Shows the server creation modal

4. **Server Creation**
   - Modal form with server name and image upload
   - Form validation using Zod schema
   - Creates a new server and adds the user as an admin

### **Route Protection**

- **Middleware**: `middleware.ts` runs on every request
- **Public Routes**: Sign-in, Sign-up pages
- **Protected Routes**: All other routes require authentication
- **Automatic Redirects**: Based on authentication status

## 🎨 Theming System

### **Theme Configuration**

- **Provider**: Next-themes for theme management
- **Themes**: Light, Dark, and System preference
- **CSS Variables**: Comprehensive color system
- **Components**: All UI components support both themes

### **Color Scheme**

```css
/* Light Theme */
--background: oklch(1 0 0); /* Pure white */
--foreground: oklch(0.147 0.004 49.25); /* Dark text */
--primary: oklch(0.216 0.006 56.043); /* Discord blue */

/* Dark Theme */
--background: oklch(0.147 0.004 49.25); /* Dark background */
--foreground: oklch(0.985 0.001 106.423); /* Light text */
--primary: oklch(0.923 0.003 48.717); /* Light accent */
```

## 🧩 Component Architecture

### **Form Components**

- **React Hook Form**: Performance-optimized forms
- **Zod Validation**: Type-safe schema validation
- **Error Handling**: Accessible error messages
- **Loading States**: Proper UX during submissions

### **Modal System**

- **Radix Dialog**: Accessible modal primitives
- **Custom Styling**: Discord-like appearance
- **Form Integration**: Seamless form handling within modals

### **UI Components**

- **Shadcn/ui**: Pre-built, customizable components
- **Radix Primitives**: Accessible, unstyled components
- **Tailwind Styling**: Utility-first styling approach

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma studio    # Open database GUI
npx prisma migrate   # Create and run migrations
```

## 📦 Environment Variables

```env
# Required
DATABASE_URL=                              # PostgreSQL connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=         # Clerk public key
CLERK_SECRET_KEY=                          # Clerk secret key

# Optional (with defaults)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 🚀 Deployment

### **Vercel (Recommended)**

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### **Other Platforms**

- **Railway**: Great for database + app hosting
- **PlanetScale**: Serverless MySQL database
- **Supabase**: PostgreSQL with real-time features

## 🎯 Upcoming Features

- [ ] **Real-time Messaging**: WebSocket or Socket.io integration
- [ ] **File Uploads**: Image and file sharing in channels
- [ ] **Voice Channels**: WebRTC for voice communication
- [ ] **Video Calls**: Screen sharing and video chat
- [ ] **Message Reactions**: Emoji reactions to messages
- [ ] **Direct Messages**: Private messaging between users
- [ ] **Server Invites**: Invite links and member management
- [ ] **Notifications**: Real-time notifications system
- [ ] **Mobile App**: React Native implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Discord** - For the amazing platform that inspired this project
- **Vercel** - For the incredible Next.js framework
- **Clerk** - For the seamless authentication solution
- **Shadcn** - For the beautiful UI component library
- **Prisma** - For the excellent database toolkit

---

**Built with ❤️ by [Your Name]**

_Star ⭐ this repository if you found it helpful!_
