# Jodhpur Darshan

Jodhpur Darshan is a web application that provides a comprehensive guide to the beautiful city of Jodhpur. Explore the city's attractions, culture, and history through our interactive platform.

## Tech Stack

- **Frontend:**
  - Next.js
  - Tailwind CSS
- **Backend:**
  - Next.js
- **Database:**
  - NeonDB - Postgresql with Prisma (ORM)
- **Authentication:**
  - Clerk (fully customized)
- **UI Library:**
  - ShadCn UI Library (for pre-build components)

## Features

- Explore various attractions in Jodhpur
- Detailed information about each attraction
- User authentication and profile management
- Customizable user experience
- Reactions on post
- comments on post
- Create your own Vault for store the posts
- All liked posts shown in the dashboard
- Only Admin can post the posts

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/jodpur-darshan.git
   cd jodpur-darshan
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables.

   ```bash
   DATABASE_URL=

    #Clerk's Credientials
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    WEBHOOK_SECRET=


    #Cloudinary Credientials
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
   ```

4. Run the development server:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Customizing Clerk

This project uses Clerk for authentication, which has been fully customized to fit our needs. For more information on how to customize Clerk, refer to the [Clerk documentation](https://clerk.dev/docs).

## Contributing

We welcome contributions from the community.
