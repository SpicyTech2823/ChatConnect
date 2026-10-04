# ChatConnect

## Authentication setup

The backend uses MySQL and reads its settings from `Backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=chatconnect
DB_PORT=3306
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES=7d
```

Create the database and `users` table by running `Backend/src/database/schema.sql` in MySQL. It stores name, email, optional phone, a bcrypt password hash, and creation time. Add the DB settings and a long random `JWT_SECRET` to `Backend/.env` alongside `PORT`. Start the backend with `npm run dev` from `Backend`, then start the frontend with `npm run dev` from `Frontend`. Set `VITE_API_URL` only if the API is not at `http://localhost:5000/api`.

Registration and login return a JWT and public user details. The frontend saves the token locally, verifies it on reload through `/api/auth/me`, and protects `/chat` from unauthenticated visits.
