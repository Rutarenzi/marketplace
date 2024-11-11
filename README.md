# 🛒 MARKETPLACE CHALLENGE

The **Marketplace Challenge** project is an industrial-grade API implementation for a marketplace application built using NestJS. This project is designed to showcase best practices in modern API development with a robust stack of tools and technologies.

## 🚀 Technology Stack

- **NestJS**: Backend framework for building efficient, reliable, and scalable server-side applications.
- **Swagger**: API documentation and testing interface.
- **Bull**: Queueing system for background jobs and task scheduling.
- **Gmail and Nodemailer**: For sending email notifications.
- **Docker**: Containerization for easy setup and deployment.
- **Redis**: In-memory data structure store for caching and message brokering.
- **PostgreSQL**: Relational database for data persistence.
- **KafkaJS**: Apache Kafka client for Node.js, used for handling message streaming.
- **JWT**: JSON Web Tokens for authentication.
- **Prisma**: ORM for database management.
- **WebSocket**: Real-time, bidirectional communication.

## 📋 Features

- **User Management**: Registration, login, and JWT-based authentication and authorization.
- **Product and Order Management**: APIs for creating and view all category and products, placing orders, and updating order statuses.
- **Cart Functionality**: Add, update, view items in the cart.
- **Email Processing**: Background job handling with Bull and Redis for sending verification email and order status update.
- **Notification Service**: Real-time WebSocket notifications and email notifications for order status updates.
- **API Documentation**: Interactive API documentation with Swagger.
- **Event Streaming**: Order processing and status updates using Kafka for real-time data streaming.

## 📦 Installation

### Prerequisites

- Docker 

### Setup
### Environment variable

- DATABASE_URL=postgres://marketplace:awesomity@postgres:5432/marketplacedb
- JWT_SECRET= your_jwt_secret
- EMAIL_USER=your_gmail_username
- EMAIL_PASS=your_gmail_password( this APP PASSWORD for send email with nodemailer-gmail- )
- HOST = 'localhost'
- PORT = 3400 (if you change also change it in dockerfiles)
- KAFKA_BROKER=kafka:9092

1. **Clone the Repository**:
```
   
   git clone https://github.com/Rutarenzi/marketplace.git

   cd marketplace

   docker-compose up --build

   after building  successfully!!!! 

   browse http://localhost:3400/api/docs for swagger doc 

```
 ## Access database 
 ```
 docker-compose exec app yarn prisma studio 

```
## Run the any script in package.json
 ```
 docker-compose exec app yarn {script name}
 ```
### Database schemas
  - Product
  - User
  - Profile
  - Address
  - Product
  - Category
  - Order
  - OrderItem
  - Review
  - WishlistItem
  - CartItem
  - Payment


### Endpoints
 ## User
- `/user/register`: - Register
- `/user/profile/create`: - Create profile
- ` /user/profile `: - View your profile (Authenticated user)
  ## Auth
- ` auth/login `: Login
  
  ## Products

- `/products/create `: - Create product (Authenticated Admin)
- ` /products `: Get all products
- ` products/search `: Search product
- `products/category/{categoryId}`: Get products by category
- ` products/mark-featured`: Mark product as featured (Authenticated Admin)
 ## Cart
 -` /cart/{productId }` : Add product to cart (Authenticated)
 -` /cart`: View your own cart (Authenticated)
 
## Order

- `/orders/address`: Create address before you order (Authenticated)
- ` /orders/address`: Get your addresses (Authenticated)
- `/orders/place-order`: Place the order (authenticated USER ROLE)
- `/orders/{orderId}`: Get your order(USER ROLE) and any order (ADMIN ROLE)
- `/orders`: Get your orders(USER ONLY) and all orders (ADMIN ROLE)
- `/orders/{orderId}/status`: updated order status (ADMIN ROLE)
  ## CATEGORIES
 - `/categories` : create category (ADMIN)
 - `/categories` :get all category
## Reviews
-`/reviews/{productId}` : review the product you bought
