# System Flow Diagram & Schema Overview

## 1. Flow Diagram (Mermaid)

```mermaid
graph TD
    User(User Registration) -->|1. Sign Up/Login| Auth[Authentication System]
    Auth -->|Success| Dashboard[User Dashboard]
    
    subgraph "Role Onboarding (Provider)"
    Dashboard -->|2. Apply as Partner| Choice{Select Role}
    Choice -->|Auto/Taxi| P1[Provide Vehicle & License]
    Choice -->|Dukandar| P2[Shop Details & Permit]
    Choice -->|Labour| P3[Skills, Rates & Availability]
    Choice -->|Delivery| P4[Vehicle & Delivery Zone]
    Choice -->|Farmer| P5[Land/Crop Details]
    Choice -->|Electrician/Plumber| P6[Certifications & Experience]
    
    P1 & P2 & P3 & P4 & P5 & P6 -->|3. Submit Profile| Verify[Verification Queue]
    Verify -->|Admin Review| Status{Decision}
    Status -->|Approved| Live[Profile Live & Searchable]
    Status -->|Rejected| Edit[Update & Resubmit]
    end

    subgraph "Service Interaction Loop"
    Consumer[Consumer User] -->|4. Search Services| Search[Search Engine]
    Live -->|Indexed| Search
    Search -->|Filter by Category| List[Provider List]
    List -->|Select| ViewProfile[View Provider Profile]
    ViewProfile -->|5. Request Service| Booking[Create Interaction Request]
    
    Booking -->|Notify| Provider[Provider Dashboard]
    Provider -->|6. Accept| ActiveJob[Job In Progress]
    ActiveJob -->|7. Complete| History[Transaction History]
    History -->|8. Rate & Review| Reputation[Provider Rating Updated]
    end

    subgraph "Benefits & Schemes"
    Live -->|Check Eligibility| Benefits[Special Benefits Panel]
    Benefits -->|Based on Category| SchemesList[Available Schemes]
    SchemesList -->|Apply| SchemeReq[Scheme Application]
    SchemeReq -->|Grant| Subsidy[Benefits/Subsidy Received]
    end
```

## 2. Refined Schema Architecture

We have transitioned from a generic `Company` model to a more specific `Provider` model that better represents individual workers and small business owners.

### Updated Schemas

1.  **User Schema** (`user.schema.ts`)
    *   **Unified Identity**: Serves as the base login for everyone.
    *   **Roles**: Added `roles: ['user', 'provider', 'admin']` to allow a single account to act as both a consumer and a provider.

2.  **Provider Schema** (`provider.schema.ts`)
    *   **Replaces**: `Company` schema.
    *   **Categories**: Strictly typed to `Auto / Taxi`, `Dukandar`, `Labour`, `Delivery`, `Farmer`, `Electrician / Plumber`.
    *   **Fields**: Includes `skills`, `vehicleNumber`, `shopCategory` to accommodate diverse roles.
    *   **Location**: Geospatial indexing (`2dsphere`) for map-based searching (e.g., "Find Electrician near me").

3.  **Interaction Schema** (`interaction.schema.ts`)
    *   **Purpose**: Tracks the lifecycle of a service (Requested -> Accepted -> Completed).
    *   **Feedback**: Built-in rating and review system.

## 3. Usage Guide

*   **For Consumers**: Query the `Provider` collection by `location` and `category`.
*   **For Providers**: Users create a `Provider` document linked to their `userId`.
*   **For Benefits**: Query the `Scheme` collection where `category` matches the Provider's category.
