RescueBite API
Backend API for the RescueBite platform — a food waste reduction system where merchants can publish food listings with dynamic lifecycle states and users can reserve discounted food items safely.

Tech Stack

1.Node.js
2.Express.js
3.PostgreSQL
4.Prisma ORM
5.Redis
6.JWT Authentication
7.Zod Validation
8.Docker

Features:
Authentication & Authorization
User registration
Login with JWT access token
Refresh token flow
Logout with token revocation
Password hashing with bcrypt
RBAC (USER / MERCHANT / ADMIN)
Protected routes
Rate limiting on auth endpoints

Food Listings

Merchants can:

Create food listings
Manage inventory quantity
Track food lifecycle states

Users can:

Browse active listings
Food State Machine

Listings automatically transition between states:
FRESH → DISCOUNTED → FREE → COMPOST
_________________________________________________________________

Allergy Parser

Users can save allergy profiles.

The API validates ingredient arrays against user allergies and returns:

safe = true/false
matched allergens

Supported allergens:

MILK
EGGS
WHEAT
GLUTEN
PEANUTS
TREE_NUTS
SOY
FISH
SHELLFISH
SESAME

__________________________________________________________________

Reservation System

Redis-based reservation system prevents overselling.

Features:

Redis locking
Temporary stock reservation
Reservation expiration
Inventory reduction


___________________________________________________________________

src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── utils/
├── jobs/

prisma/
tests/

________________________________________

AUTH

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |
| POST   | /auth/refresh  |
| POST   | /auth/logout   |

USERS

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /users/me        |
| GET    | /users/admin     |
| PUT    | /users/allergies |

LISTINGS

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /listings               |
| GET    | /listings               |
| PATCH  | /listings/:id/status    |
| POST   | /listings/allergy-check |


RESERVATIONS

| Method | Endpoint      |
| ------ | ------------- |
| POST   | /reservations |

http://localhost:3000/docs

_________________________________________

Security
JWT authentication
Refresh token revocation
Password hashing
RBAC authorization
Rate limiting
Environment validation
CORS configuration



# resqueBite_API
