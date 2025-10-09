# TranXact Donor Workflow Guide

## Overview
TranXact is a blockchain-based donation platform built on Algorand that supports two types of donors: **Private Donors** (individual contributors) and **Public Donors** (organizations/institutions managing large-scale funding).

---

## 🔐 Authentication & User Types

### Login Process
1. **Landing Page** (`/`) → **Get Started** (`/get-started`) → **Login** (`/login`)
2. Users select their donor type:
   - **Private Donor**: Individual contributors making personal donations
   - **Public Donor**: Organizations managing large-scale funding and NGO partnerships

### Wallet Connection
- Both user types must connect their Algorand wallet
- Supported wallets: Pera Wallet, MyAlgo Wallet, etc.
- Real-time balance display and transaction capabilities

---

## 👤 Private Donor Dashboard

### Navigation Structure
```
Dashboard Layout (/dashboard)
├── Overview Tab (Default)
├── Reports Tab
├── History Tab
└── Settings Tab
```

### Overview Tab Features
- **Welcome Section**
  - Personalized greeting with user name
  - Real-time wallet balance display
  - Wallet address (truncated for security)

- **Quick Actions**
  - `Make Donation` button → Redirects to `/send`

- **Impact Statistics**
  - Total Donations: Cumulative ALGO donated
  - Projects Supported: Number of projects funded
  - Lives Impacted: Estimated beneficiaries

- **Recent Donations**
  - Transaction history with amounts
  - Project descriptions and categories
  - Donation dates and status badges
  - `View Details` buttons (opens development dialog)

### Reports Tab Features
- **Donation Tracking**
  - Complete donation history with project allocations
  - Organization-wise fund distribution
  - Project details (organization, category, location)
  - Allocation status tracking (completed/pending)

- **Debug Tools** (Development Mode)
  - Debug log button for donation data
  - Clear data functionality

- **Empty State**
  - Encourages first donation with call-to-action
  - Direct link to donation page

### History Tab Features
- **Real-time Blockchain Transactions**
  - Live transaction feed from connected wallet
  - Transaction types (sent/received)
  - Amount, fees, and gas usage
  - Transaction notes and timestamps
  - Blockchain confirmation status

- **Search & Filter**
  - Search transactions by various criteria
  - Real-time updates every 5 seconds

### Settings Tab Features
- **Profile Management**
  - Avatar display with user initials
  - Editable name, email, and phone
  - Profile picture upload capability

- **Account Information**
  - Email and phone number management
  - Wallet address display
  - Current balance information

- **Quick Actions**
  - Send funds button
  - Receive funds modal (under development)

- **Privacy Settings**
  - Data sharing preferences
  - Privacy policy access

- **App Preferences**
  - Language selection (English default)
  - Theme toggle (Light/Dark mode)

---

## 🏢 Public Donor Dashboard

### Navigation Structure
```
Dashboard Layout (/dashboard)
├── Overview Tab (Default)
│   ├── Main Dashboard View
│   ├── Manage Programs View
│   └── Allocate Funds View
├── Reports Tab
├── History Tab
└── Settings Tab
```

### Overview Tab Features

#### Main Dashboard View
- **Welcome Section**
  - Personalized greeting for organization
  - Available funds display
  - Wallet address information

- **Quick Actions**
  - `Send Funds` → Redirects to `/send`
  - `Manage Programs` → Toggle to program management
  - `Allocate Funds` → Toggle to fund allocation

- **Funding Impact Statistics**
  - Total Funding: Cumulative ALGO managed
  - NGOs Supported: Number of partner organizations
  - Lives Impacted: Estimated total beneficiaries

- **Top Funded Projects**
  - Real-time project rankings by funding amount
  - Project details (title, raised amount, backers)
  - Category and status badges
  - `View Project` buttons

- **NGO Performance Dashboard**
  - Visual performance metrics
  - High Performance (60%) - Green indicator
  - Medium Performance (30%) - Yellow indicator
  - Needs Attention (10%) - Red indicator

#### Manage Programs View
- **Program Creation**
  - `Create New Project` button with comprehensive form
  - Project details: title, description, category, location
  - Target amount and duration settings
  - Automatic NGO wallet assignment

- **Project Management Grid**
  - Visual project cards with images
  - Real-time wallet balance tracking
  - Progress bars showing funding status
  - Project status badges (Active/Completed/Urgent)
  - Edit and delete functionality
  - Backer count and location display

- **NGO Wallet Integration**
  - Pre-configured wallet addresses for major NGOs:
    - Rural Development
    - Emergency Food Supplies
    - Child Healthcare

#### Allocate Funds View
- **Available Donations Panel**
  - List of unallocated donations from private donors
  - Remaining amounts after partial allocations
  - Donation reasons and sources

- **Fund Allocation Interface**
  - Dropdown selection for donations and projects
  - Amount input with validation
  - Real-time blockchain transaction processing
  - Automatic project funding updates

### Reports Tab Features
- **Public Funding Summary**
  - Total private funding received
  - Total allocated to projects
  - Active projects count

- **Contribution Analytics**
  - Interactive pie chart showing funding by project
  - Bar chart comparing funded vs allocated amounts
  - Project-wise funding breakdown

- **Real-time Data Integration**
  - Blockchain transaction analysis
  - Automatic project funding calculations
  - NGO wallet balance monitoring

### History Tab Features
- **Comprehensive Transaction History**
  - All wallet transactions with detailed information
  - Transaction types, amounts, and fees
  - Organization names and project allocations
  - Real-time blockchain confirmations

### Settings Tab Features
- **Same as Private Donor Settings**
  - Profile management
  - Account information
  - Privacy settings
  - App preferences

---

## 🔄 Navigation Flow

### Primary Navigation Paths
```
Landing (/) 
    ↓
Get Started (/get-started)
    ↓
Login (/login) → Select User Type
    ↓
Dashboard (/dashboard) → Tab-based Navigation
    ├── Overview (Main functionality)
    ├── Reports (Analytics & tracking)
    ├── History (Transaction history)
    └── Settings (Profile & preferences)
```

### Secondary Navigation Paths
```
Dashboard → Send Funds (/send)
Dashboard → Check Balance (/balance)
Dashboard → Explore Projects (/explore)
Dashboard → View All Projects (/projects)
Dashboard → Get Assistance (/assistance)
```

### Transaction Flow
```
Send Funds (/send)
    ↓
Transaction Processing
    ↓
Transaction Successful (/success)
    ↓
Return to Dashboard
```

---

## 🎯 Key Features Summary

### Private Donors
- **Personal Impact Tracking**: Monitor individual donation history and impact
- **Project Discovery**: Browse and support various charitable projects
- **Blockchain Transparency**: Real-time transaction verification
- **Allocation Visibility**: See how donations are distributed to projects

### Public Donors
- **Program Management**: Create and manage funding programs
- **Fund Allocation**: Distribute received donations to specific projects
- **NGO Partnerships**: Manage relationships with multiple NGOs
- **Performance Analytics**: Track NGO and project performance
- **Large-scale Impact**: Monitor cumulative funding impact

### Shared Features
- **Algorand Integration**: Secure blockchain transactions
- **Real-time Updates**: Live balance and transaction monitoring
- **Responsive Design**: Works on desktop and mobile devices
- **Theme Support**: Light and dark mode options
- **Profile Management**: Customizable user profiles

---

## 🔧 Technical Implementation

### Context Providers
- **AuthProvider**: User authentication and profile management
- **WalletProvider**: Algorand wallet integration
- **ProjectProvider**: Project data management
- **DonationProvider**: Donation tracking and allocation

### Key Components
- **DashboardLayout**: Main navigation and tab structure
- **PrivateDashboard**: Individual donor interface
- **PublicDashboard**: Organization donor interface
- **ManagePrograms**: Project creation and management
- **AllocateToProjects**: Fund distribution interface

### Blockchain Integration
- **AlgorandService**: Wallet operations and transactions
- **TransactionService**: Blockchain data retrieval
- **Real-time Balance Updates**: Automatic wallet monitoring

---

## 🚀 Future Enhancements

### Under Development
- Advanced reporting and analytics
- Multi-signature wallet support
- Mobile app development
- Enhanced NGO verification system
- Automated impact reporting
- Integration with external charity databases


this is the workflow of my project, generate a ER diagram according to this flow