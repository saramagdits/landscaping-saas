# Firestore Indexes Setup

This document provides instructions for creating the necessary Firestore indexes to support the proposal and job system queries.

## Required Indexes

### 1. Jobs Collection Index

**Collection:** `jobs`

**Fields to index:**
- `userId` (Ascending)
- `start` (Ascending)

**Purpose:** This index is required for the main jobs query that filters by user and orders by start date.

### 2. Jobs Collection Index (with Status)

**Collection:** `jobs`

**Fields to index:**
- `userId` (Ascending)
- `status` (Ascending)
- `start` (Ascending)

**Purpose:** This index is required for filtering jobs by status while maintaining user isolation.

### 3. Jobs Collection Index (with Priority)

**Collection:** `jobs`

**Fields to index:**
- `userId` (Ascending)
- `priority` (Ascending)
- `start` (Ascending)

**Purpose:** This index is required for filtering jobs by priority while maintaining user isolation.

### 4. Jobs Collection Index (with Date Range)

**Collection:** `jobs`

**Fields to index:**
- `userId` (Ascending)
- `start` (Ascending)
- `end` (Ascending)

**Purpose:** This index is required for date range queries on jobs.

### 5. Proposals Collection Index

**Collection:** `proposals`

**Fields to index:**
- `userId` (Ascending)
- `createdAt` (Descending)

**Purpose:** This index is required for the main proposals query that filters by user and orders by creation date.

### 6. Proposals Collection Index (with Status)

**Collection:** `proposals`

**Fields to index:**
- `userId` (Ascending)
- `status` (Ascending)
- `createdAt` (Descending)

**Purpose:** This index is required for filtering proposals by status while maintaining user isolation.

## How to Create Indexes

### Option 1: Using the Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`landscaping-saas`)
3. Go to "Firestore Database" in the left sidebar
4. Click on the "Indexes" tab
5. Click "Create Index"

#### For Jobs Indexes:

**Jobs - User and Start Date:**
- **Collection ID:** `jobs`
- **Fields:**
  - Field path: `userId`, Order: `Ascending`
  - Field path: `start`, Order: `Ascending`
- Click "Create"

**Jobs - User, Status, and Start Date:**
- **Collection ID:** `jobs`
- **Fields:**
  - Field path: `userId`, Order: `Ascending`
  - Field path: `status`, Order: `Ascending`
  - Field path: `start`, Order: `Ascending`
- Click "Create"

**Jobs - User, Priority, and Start Date:**
- **Collection ID:** `jobs`
- **Fields:**
  - Field path: `userId`, Order: `Ascending`
  - Field path: `priority`, Order: `Ascending`
  - Field path: `start`, Order: `Ascending`
- Click "Create"

**Jobs - User, Start, and End Date:**
- **Collection ID:** `jobs`
- **Fields:**
  - Field path: `userId`, Order: `Ascending`
  - Field path: `start`, Order: `Ascending`
  - Field path: `end`, Order: `Ascending`
- Click "Create"

#### For Proposals Indexes:

**Proposals - User and Created Date:**
- **Collection ID:** `proposals`
- **Fields:**
  - Field path: `userId`, Order: `Ascending`
  - Field path: `createdAt`, Order: `Descending`
- Click "Create"

**Proposals - User, Status, and Created Date:**
- **Collection ID:** `proposals`
- **Fields:**
  - Field path: `userId`, Order: `Ascending`
  - Field path: `status`, Order: `Ascending`
  - Field path: `createdAt`, Order: `Descending`
- Click "Create"

### Option 2: Using the Direct Link

You can use the direct link provided in the error message to create the specific index that's failing:

```
https://console.firebase.google.com/v1/r/project/landscaping-saas/firestore/indexes?create_composite=Ck1wcm9qZWN0cy9sYW5kc2NhcGluZy1zYWFzL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9qb2JzL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGgkKBXN0YXJ0EAEaDAoIX19uYW1lX18QAQ
```

### Option 3: Using Firebase CLI

If you have Firebase CLI installed, you can create indexes using the `firestore:indexes` command:

1. Create a `firestore.indexes.json` file in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "jobs",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "start",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "jobs",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "start",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "jobs",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "priority",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "start",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "jobs",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "start",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "end",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "proposals",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "proposals",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

2. Deploy the indexes:
```bash
firebase deploy --only firestore:indexes
```

## Index Status

After creating the indexes, you can monitor their status in the Firebase Console:

1. Go to the "Indexes" tab in Firestore
2. Look for your newly created indexes
3. The status will show as "Building" initially, then "Enabled" when ready

**Note:** Index creation can take several minutes to complete, especially for large collections.

## Troubleshooting

### Index Still Building
- Wait for the index to finish building (can take 5-10 minutes)
- Check the Firebase Console for progress

### Query Still Failing
- Ensure the index is fully built (status shows "Enabled")
- Clear browser cache and try again
- Check that the field names in your queries match exactly

### Performance Considerations
- Indexes consume storage space
- Too many indexes can slow down write operations
- Monitor index usage in the Firebase Console

## Alternative Solution

If you continue to have issues with indexes, the application has been updated to handle sorting on the client side when status filters are applied. This reduces the need for complex composite indexes but may not be as efficient for very large datasets.

## Verification

To verify that indexes are working correctly:

1. Create a test job
2. Navigate to the jobs page
3. Try filtering by different statuses and priorities
4. Check that jobs are displayed in the correct order (by start date)

If everything works without errors, your indexes are properly configured. 