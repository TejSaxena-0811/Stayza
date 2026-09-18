# Stayza

Stayza is a full-stack web application for discovering, listing, and reviewing travel accommodations. It allows users to explore listings, create their own properties, and share reviews.

# A chart explaining the complete flow:
flowchart TD

subgraph group_runtime["Request Runtime"]
  node_app["Express Application<br/>application runtime"]
  node_policy["Request Policy<br/>middleware"]
end

subgraph group_accounts["Accounts"]
  node_user_routes["Account HTTP Routing<br/>router"]
  node_user_controller["Account Controller<br/>[users.js]"]
  node_user_model["User Account Model<br/>[user.js]"]
end

subgraph group_listings["Listings"]
  node_listing_routes["Listing HTTP Routing<br/>router"]
  node_listing_controller["Listing Controller<br/>[listings.js]"]
  node_listing_model["Listing Model<br/>[listing.js]"]
  node_cloud_config["Cloud Image Config<br/>upload configuration"]
end

subgraph group_reviews["Reviews"]
  node_review_routes["Review HTTP Routing<br/>router"]
  node_review_controller["Review Controller<br/>[reviews.js]"]
  node_review_model["Review Model<br/>[review.js]"]
end

subgraph group_presentation["Presentation"]
  node_account_views["Account EJS Screens<br/>server-rendered views"]
  node_listing_views["Listing EJS Screens<br/>server-rendered views"]
  node_form_validation["Browser Form Validation<br/>client script"]
end

node_browser(("Traveler/Host Browser<br/>external actor"))
node_mongo[("MongoDB<br/>database")]
node_cloudinary[("Cloudinary Image Storage<br/>external storage")]
node_mapbox{{"Mapbox Geocoding API<br/>external API"}}

node_browser -->|"HTTP requests"| node_app
node_app -->|"mounts /listings"| node_listing_routes
node_app -->|"mounts review routes"| node_review_routes
node_app -->|"mounts /"| node_user_routes
node_app -->|"connects and stores sessions"| node_mongo
node_app -->|"configures Passport"| node_user_model
node_listing_routes -->|"applies listing policy"| node_policy
node_listing_routes -->|"builds upload middleware"| node_cloud_config
node_cloud_config -->|"configures provider"| node_cloudinary
node_listing_routes -->|"dispatches handlers"| node_listing_controller
node_listing_controller -->|"geocodes locations"| node_mapbox
node_listing_controller -->|"persists listings"| node_listing_model
node_listing_controller -->|"renders pages"| node_listing_views
node_listing_views -->|"presents pages"| node_browser
node_review_routes -->|"applies review policy"| node_policy
node_review_routes -->|"dispatches handlers"| node_review_controller
node_review_controller -->|"updates references"| node_listing_model
node_review_controller -->|"saves reviews"| node_review_model
node_policy -->|"checks ownership"| node_listing_model
node_policy -->|"checks authorship"| node_review_model
node_policy -->|"uses request context"| node_app
node_user_controller -->|"registers accounts"| node_user_model
node_user_controller -->|"renders forms"| node_account_views
node_account_views -->|"presents forms"| node_browser

click node_app "https://github.com/tejsaxena-0811/stayza/blob/main/app.js"
click node_policy "https://github.com/tejsaxena-0811/stayza/blob/main/middleware.js"
click node_user_routes "https://github.com/tejsaxena-0811/stayza/blob/main/routes/user.js"
click node_user_controller "https://github.com/tejsaxena-0811/stayza/blob/main/controllers/users.js"
click node_user_model "https://github.com/tejsaxena-0811/stayza/blob/main/models/user.js"
click node_account_views "https://github.com/tejsaxena-0811/stayza/blob/main/views/users/login.ejs"
click node_listing_routes "https://github.com/tejsaxena-0811/stayza/blob/main/routes/listing.js"
click node_listing_controller "https://github.com/tejsaxena-0811/stayza/blob/main/controllers/listings.js"
click node_listing_model "https://github.com/tejsaxena-0811/stayza/blob/main/models/listing.js"
click node_cloud_config "https://github.com/tejsaxena-0811/stayza/blob/main/cloudConfig.js"
click node_listing_views "https://github.com/tejsaxena-0811/stayza/blob/main/views/listings/index.ejs"
click node_review_routes "https://github.com/tejsaxena-0811/stayza/blob/main/routes/review.js"
click node_review_controller "https://github.com/tejsaxena-0811/stayza/blob/main/controllers/reviews.js"
click node_review_model "https://github.com/tejsaxena-0811/stayza/blob/main/models/review.js"
click node_form_validation "https://github.com/tejsaxena-0811/stayza/blob/main/public/js/script.js"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_app,node_policy,node_browser toneBlue
class node_user_routes,node_user_controller,node_user_model,node_mongo,node_cloudinary toneAmber
class node_listing_routes,node_listing_controller,node_listing_model,node_cloud_config,node_mapbox toneMint
class node_review_routes,node_review_controller,node_review_model toneRose
class node_account_views,node_listing_views,node_form_validation toneIndigo

---

## Features

- Browse and explore property listings
- Add new listings with images
- Edit and delete listings
- Add and manage reviews
- User authentication (login and registration)
- Flash messages for user feedback
- Image upload using Cloudinary
- Location integration using Mapbox
- Secure session management with MongoDB store

---

## Tech Stack

### Frontend
- EJS (Embedded JavaScript Templates)
- CSS and static assets

### Backend
- Node.js
- Express.js

### Database
- MongoDB with Mongoose

### Authentication
- Passport.js (Local Strategy)

### Libraries and Tools
- Cloudinary (image storage)
- Multer (file uploads)
- Joi (data validation)
- Connect-Flash (notifications)
- Express-Session and Connect-Mongo (session storage)
- Method-Override

---

### Deployed Link
https://stayza-omega.vercel.app/listings
