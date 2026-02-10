# Page Configuration Examples

Complete examples for creating pages in Sanity Studio.

---

## Homepage Configuration

```yaml
# Basic Info
Title: Homepage
Slug: /
Page Type: Homepage
Published: true

# SEO Settings
SEO:
  Meta Title: "Enthusiast Auto | The Leading BMW Preservation Facility"
  Meta Description: "The leading BMW preservation facility. Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles. Curated vehicles and premium parts."
  OG Title: "Enthusiast Auto | The Leading BMW Preservation Facility"
  OG Description: "Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles."
  OG Image: [Upload 1200x630px image]
  Keywords: 
    - BMW
    - M-Series
    - preservation
    - Cincinnati
    - enthusiast
    - classic cars
  No Index: false

# Hero Section
Hero:
  Show Hero: true
  Size: Full Screen
  Eyebrow: ""
  Title: "The Leading BMW Preservation Facility"
  Title Highlight: ""
  Subtitle: "Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles."
  Background Image: [Upload or use URL]
  Background Image URL: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083"
  Overlay: 50
  CTAs:
    - Label: "View Inventory"
      URL: "/vehicles"
      Style: Primary
    - Label: "Our Services"
      URL: "/services"
      Style: Outline

# Sections
Sections:
  - Section ID: featured-vehicles
    Component: FeaturedVehicles
    Prompt: |
      Display the 4 most recent vehicles marked as "featuredInventory" in a 
      responsive grid (1 column mobile, 2 tablet, 4 desktop). Each vehicle 
      card shows: signature shot image with hover effects, year/make/model/
      chassis code, price (or "Call For Price"), and 3 thumbnail features. 
      Include section title "Inventory" and "View All" button linking to 
      /vehicles. Use VehicleCard component for consistency.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 10

  - Section ID: services-section
    Component: ServicesSection
    Prompt: |
      Display all 4 services in a numbered grid (01-04) on dark background. 
      Each service shows: number, title, description, and "Learn More" link 
      to service detail page. Use 2x2 grid on desktop, 1 column on mobile. 
      Services are fetched from Sanity service documents.
    Enabled: true
    Background Color: Navy Primary
    Vertical Padding: Large
    Sort Order: 20

  - Section ID: featured-blog-posts
    Component: FeaturedBlogPostsWrapper
    Prompt: |
      Show the 3 most recent blog posts marked as "featured" in a 3-column 
      grid (1 col mobile, 2 tablet, 3 desktop). Each card displays: featured 
      image, category badge, title, excerpt (truncated to 2 lines), and 
      publish date. Cards link to individual blog posts. Include section 
      title "Latest Stories" and "View All" button linking to /blog.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 30

  - Section ID: about-section
    Component: AboutSection
    Prompt: |
      Display company overview section with title "About Enthusiast Auto", 
      mission statement, and key points about the business. Include "Learn 
      More" button linking to /about page. Light gray background to 
      differentiate from white sections.
    Enabled: true
    Background Color: Neutral 50
    Vertical Padding: Large
    Sort Order: 40

# Structured Data
Structured Data:
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Enthusiast Auto Group",
  "description": "The leading BMW preservation facility. Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles.",
  "url": "https://enthusiastauto.com",
  "logo": "https://enthusiastauto.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11608 Reading Rd",
    "addressLocality": "Cincinnati",
    "addressRegion": "OH",
    "postalCode": "45241",
    "addressCountry": "US"
  },
  "telephone": "+1-513-554-1269",
  "email": "info@enthusiastauto.com"
}
```

---

## About Page Configuration

```yaml
# Basic Info
Title: About Us
Slug: /about
Page Type: About
Published: true

# SEO Settings
SEO:
  Meta Title: "About | Enthusiast Auto Group"
  Meta Description: "Learn about Enthusiast Auto Group - Cincinnati's premier destination for BMW M-Series vehicles, services, and community."
  Keywords:
    - about
    - BMW dealer
    - Cincinnati
    - M-Series
    - history
    - mission
  No Index: false

# Hero Section
Hero:
  Show Hero: true
  Size: Medium
  Eyebrow: "Enthusiast Auto Group"
  Title: "Built by Enthusiasts"
  Title Highlight: "For Enthusiasts"
  Subtitle: "Cincinnati's premier destination for BMW M-Series vehicles, expert service, and a passionate community."
  Background Image URL: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083"
  Overlay: 50
  CTAs:
    - Label: "View Inventory"
      URL: "/vehicles"
      Style: Primary
    - Label: "Our Services"
      URL: "/services"
      Style: Outline

# Sections
Sections:
  - Section ID: our-story
    Component: AboutStorySection
    Prompt: |
      Two-column layout: left side has story text (2 paragraphs about company 
      history and team), right side shows timeline cards with 3 milestones 
      (2015, 2018, 2023). Each milestone card has year, title, description, 
      and hover effects with gradient accent. Include "Get in Touch" button 
      linking to /contact.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 10

  - Section ID: mission-values
    Component: AboutMissionSection
    Prompt: |
      Dark section with section title "Our Mission", mission statement as 
      blockquote, and 3-column grid of values (Authenticity, Excellence, 
      Community). Each value card has large background number (01, 02, 03), 
      title, description, and hover effects with gradient accent at bottom.
    Enabled: true
    Background Color: Navy Primary
    Vertical Padding: Large
    Sort Order: 20

  - Section ID: differentiators
    Component: AboutDifferentiatorsSection
    Prompt: |
      Section titled "What Sets Us Apart" with 2x2 grid (1 col mobile) of 
      differentiator cards: Curated Inventory, Full Rejuvenation, Expert 
      Knowledge, Community Focus. Each card has large background number 
      (01-04), title, description, and hover effects. Include "Browse 
      Inventory" button linking to /vehicles.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 30

  - Section ID: visit-us
    Component: AboutVisitSection
    Prompt: |
      Section titled "Visit Us" with 3-column grid (1 col mobile) showing: 
      Location card (address with "Get Directions" link), Hours card 
      (Mon-Fri 8am-5pm, Sat-Sun by appointment), Contact card (phone and 
      email). Below grid, show CTA banner "Ready to find your next BMW?" 
      with "View Inventory" and "Send Message" buttons.
    Enabled: true
    Background Color: Neutral 50
    Vertical Padding: Large
    Sort Order: 40
```

---

## Contact Page Configuration

```yaml
# Basic Info
Title: Contact Us
Slug: /contact
Page Type: Contact
Published: true

# SEO Settings
SEO:
  Meta Title: "Contact Us | Enthusiast Auto"
  Meta Description: "Get in touch with Enthusiast Auto Group. Whether you're interested in buying a vehicle, scheduling service, ordering parts, or have general questions – we're here to help."
  Keywords:
    - contact
    - Cincinnati
    - BMW dealer
    - phone
    - email
    - location
  No Index: false

# Hero Section
Hero:
  Show Hero: true
  Size: Medium
  Eyebrow: "Contact Us"
  Title: "We're Here to Help"
  Title Highlight: "Let's Connect"
  Subtitle: "Whether you're shopping for your next BMW, need expert service, or have questions about parts – our team is ready to assist."
  Background Image URL: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2070"
  Overlay: 50
  CTAs: []

# Sections
Sections:
  - Section ID: quick-contact-cards
    Component: QuickContactCards
    Prompt: |
      Section titled "How Can We Help?" with 4-column grid (1 col mobile, 
      2 tablet) of quick contact cards: Vehicle Sales (links to /vehicles), 
      Service & Repair (links to /services), Parts & Accessories (links to 
      /parts), Sell Your BMW (links to /sell). Each card has icon, title, 
      description, and "Learn More" link with hover effects.
    Enabled: true
    Background Color: White
    Vertical Padding: Medium
    Sort Order: 10

  - Section ID: contact-form-section
    Component: ContactFormSection
    Prompt: |
      Two-column layout (1 col mobile): left side (60% width) has multi-step 
      contact form with fields for name, email, phone, inquiry type, vehicle 
      interest, and message. Right side (40% width) has contact info card 
      with phone, email, location, and business hours, plus embedded Google 
      Map below.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 20

  - Section ID: department-teams
    Component: DepartmentTeamsSection
    Prompt: |
      Section titled "Contact Our Teams" with 3-column grid (1 col mobile) 
      of department cards: Sales Team, Service Team, Parts Team. Each card 
      has icon, title, description, phone number, and email address with 
      gradient background accent.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 30

  - Section ID: faq-cta
    Component: FAQCTASection
    Prompt: |
      Centered CTA banner with title "Need a Quick Answer?", description 
      about FAQ, and two buttons: "Call Now: 513-554-1269" (primary) and 
      "Learn About Us" (outline, links to /about). Gradient background from 
      primary color.
    Enabled: true
    Background Color: White
    Vertical Padding: Medium
    Sort Order: 40

# Structured Data
Structured Data:
{
  "@context": "https://schema.org",
  "@type": "AutomotiveDealer",
  "name": "Enthusiast Auto Group",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11608 Reading Rd",
    "addressLocality": "Cincinnati",
    "addressRegion": "OH",
    "postalCode": "45241"
  },
  "telephone": "+1-513-554-1269",
  "email": "info@enthusiastauto.com",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ]
}
```

---

## Services Page Configuration

```yaml
# Basic Info
Title: Services
Slug: /services
Page Type: Services Overview
Published: true

# SEO Settings
SEO:
  Meta Title: "Services | Enthusiast Auto Group"
  Meta Description: "Expert BMW services including conditioning & protection, full rejuvenation, mechanical services, and cosmetic repairs. Cincinnati's BMW specialists."
  Keywords:
    - BMW services
    - restoration
    - detailing
    - mechanical
    - Cincinnati
  No Index: false

# Hero Section
Hero:
  Show Hero: true
  Size: Medium
  Eyebrow: "Services"
  Title: "Expert BMW Care"
  Title Highlight: "BMW Care"
  Subtitle: "From cosmetic touch-ups to complete restoration, our BMW specialists deliver factory-exceeding results."
  Background Image URL: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2070"
  Overlay: 60
  CTAs:
    - Label: "Request Service"
      URL: "/contact"
      Style: Primary

# Sections
Sections:
  - Section ID: services-grid
    Component: ServicesGridSection
    Prompt: |
      Display all active services from Sanity in a 2x2 grid (1 col mobile). 
      Each service card shows: icon, title, short description, key features 
      list, pricing info, and "Learn More" button linking to service detail 
      page. Cards have hover effects and gradient accents.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 10

  - Section ID: service-request-cta
    Component: ServiceRequestCTA
    Prompt: |
      Dark section with centered CTA: "Ready to Schedule Service?", 
      description about expert care, and "Request Service" button linking 
      to /contact with service inquiry pre-selected.
    Enabled: true
    Background Color: Navy Primary
    Vertical Padding: Large
    Sort Order: 20
```

---

## Sell Page Configuration

```yaml
# Basic Info
Title: Sell Your BMW
Slug: /sell
Page Type: Sell Your Car
Published: true

# SEO Settings
SEO:
  Meta Title: "Sell Your BMW | Enthusiast Auto Group"
  Meta Description: "Looking to sell, consign, or auction your BMW? We offer competitive valuations and hassle-free transactions. Get started today."
  Keywords:
    - sell BMW
    - consign
    - auction
    - valuation
    - Cincinnati
  No Index: false

# Hero Section
Hero:
  Show Hero: true
  Size: Medium
  Eyebrow: "Sell Your BMW"
  Title: "Get a Fair Offer"
  Title Highlight: "Fair Offer"
  Subtitle: "We're always looking for quality BMWs to add to our inventory. Get a competitive valuation in 24 hours."
  Background Image URL: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070"
  Overlay: 50
  CTAs:
    - Label: "Submit Your Vehicle"
      URL: "#sell-form"
      Style: Primary

# Sections
Sections:
  - Section ID: sell-options
    Component: SellOptionsSection
    Prompt: |
      Section titled "How It Works" with 3-column grid (1 col mobile) 
      explaining three options: Outright Purchase, Consignment, Auction. 
      Each card has icon, title, description, and numbered step indicator.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 10

  - Section ID: sell-form
    Component: SellSubmissionForm
    Prompt: |
      Multi-step form for vehicle submission with fields: contact info, 
      vehicle details (year, make, model, VIN, mileage), condition, 
      modifications, service history, photos upload (up to 20), and 
      additional notes. Form submits to /api/sell/submit.
    Enabled: true
    Background Color: Neutral 50
    Vertical Padding: Large
    Sort Order: 20

  - Section ID: what-we-look-for
    Component: WhatWeLookForSection
    Prompt: |
      Section titled "What We Look For" with 2x2 grid (1 col mobile) of 
      criteria: Clean History, Documented Service, Original Condition, 
      Enthusiast Owned. Each card has icon, title, and description.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 30
```

---

## Privacy Policy Configuration

```yaml
# Basic Info
Title: Privacy Policy
Slug: /privacy
Page Type: Privacy Policy
Published: true

# SEO Settings
SEO:
  Meta Title: "Privacy Policy | Enthusiast Auto"
  Meta Description: "Privacy policy for Enthusiast Auto Group. Learn how we collect, use, and protect your personal information."
  Keywords:
    - privacy policy
    - data protection
    - GDPR
  No Index: true  # Don't index legal pages

# Hero Section
Hero:
  Show Hero: true
  Size: Small
  Eyebrow: "Legal"
  Title: "Privacy Policy"
  Title Highlight: ""
  Subtitle: "Last updated: February 9, 2026"
  Background Image URL: ""
  Overlay: 0
  CTAs: []

# Sections
Sections:
  - Section ID: privacy-content
    Component: LegalContentSection
    Prompt: |
      Display privacy policy content in single-column layout with max-width 
      prose container. Content includes: introduction, information we collect, 
      how we use information, data protection, cookies, third-party services, 
      your rights, contact information. Use proper heading hierarchy (h2, h3) 
      and rich text formatting.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 10
```

---

## Terms of Service Configuration

```yaml
# Basic Info
Title: Terms of Service
Slug: /terms
Page Type: Terms of Service
Published: true

# SEO Settings
SEO:
  Meta Title: "Terms of Service | Enthusiast Auto"
  Meta Description: "Terms of service for Enthusiast Auto Group. Read our terms and conditions for using our website and services."
  Keywords:
    - terms of service
    - terms and conditions
    - legal
  No Index: true  # Don't index legal pages

# Hero Section
Hero:
  Show Hero: true
  Size: Small
  Eyebrow: "Legal"
  Title: "Terms of Service"
  Title Highlight: ""
  Subtitle: "Last updated: February 9, 2026"
  Background Image URL: ""
  Overlay: 0
  CTAs: []

# Sections
Sections:
  - Section ID: terms-content
    Component: LegalContentSection
    Prompt: |
      Display terms of service content in single-column layout with max-width 
      prose container. Content includes: acceptance of terms, use of website, 
      vehicle purchases, service agreements, intellectual property, 
      disclaimers, limitation of liability, governing law, contact. Use 
      proper heading hierarchy and rich text formatting.
    Enabled: true
    Background Color: White
    Vertical Padding: Large
    Sort Order: 10
```

---

## Tips for Writing Effective Prompts

### Be Specific About Layout
❌ "Show some vehicles"
✅ "Display 4 vehicles in a responsive grid (1 col mobile, 2 tablet, 4 desktop)"

### List Exact Data to Display
❌ "Show vehicle info"
✅ "Each card shows: image, year/make/model, price, and 3 key features"

### Mention Interactions
❌ "Cards link to pages"
✅ "Cards have hover zoom effect and link to vehicle detail pages"

### Reference Components
❌ "Use a card"
✅ "Use VehicleCard component for consistency"

### Describe CTAs
❌ "Add a button"
✅ "Include 'View All Inventory' button below grid linking to /vehicles"

### Include Context
❌ "Show blog posts"
✅ "Show the 3 most recent blog posts marked as 'featured'"

---

## Common Patterns

### Grid Layouts
```
"Display [N] [items] in a [N]-column grid (1 col mobile, 2 tablet, 
[N] desktop). Each [item] shows: [field 1], [field 2], [field 3]."
```

### Two-Column Layouts
```
"Two-column layout (1 col mobile): left side ([X]% width) has [content], 
right side ([Y]% width) has [content]."
```

### CTA Sections
```
"Centered CTA section with title '[title]', description '[description]', 
and '[button label]' button linking to [URL]."
```

### Card Grids with Hover
```
"[N]-column grid of [item] cards. Each card has [icon], [title], 
[description], and hover effects with [accent type]."
```

### Content with Sidebar
```
"Main content area with [content type] and sidebar with [sidebar content]. 
Stacks vertically on mobile."
```
