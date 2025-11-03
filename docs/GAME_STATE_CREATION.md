# Game State Creation Feature

## Overview

This document describes the game state creation feature that ensures all users have a valid game state to play with.

## Problem Statement

The system needed to handle cases where:
1. Users registered before the game state system was implemented
2. Game state creation failed during registration
3. Users need to manually create or check their game state

## Solution

We implemented a multi-layered approach:

### 1. Automatic Creation (Recommended)

When a user performs any game action (via `/api/action`), the system automatically checks if they have a game state. If not, it creates one immediately using their username.

**Location**: `server/api/action.post.ts`

```typescript
// Get user's game state, create if not exists
let gameState = await GameState.findOne({ userId })

if (!gameState) {
  // Auto-create game state if it doesn't exist
  gameState = await GameState.create(
    createInitialGameState(userId, session.user.username || 'Người chơi')
  )
}
```

### 2. Manual Creation (Optional)

Users can visit the `/create-character` page to manually check and create their game state.

**Features**:
- Checks if game state already exists
- Shows preview of initial stats
- Creates new game state on user request
- Redirects to game after creation

**Location**: `pages/create-character.vue`

### 3. Registration Creation

New users automatically get a game state when they register.

**Location**: `server/api/auth/register.post.ts`

## API Endpoints

### Check Game State
- **URL**: `GET /api/gamestate/check`
- **Auth**: Required
- **Response**: `{ exists: boolean, userId: string }`

### Create Game State
- **URL**: `POST /api/gamestate/create`
- **Auth**: Required
- **Response**: `{ success: boolean, message: string, player: Object }`
- **Error**: 409 if game state already exists

## Initial Player Stats

All new characters start with:
- **Level**: 0 (Phàm Nhân - Mortal)
- **Age**: 1
- **Attack**: 10
- **Defense**: 10
- **Health**: 100/100
- **Cultivation**: 0/100
- **Money**: 0
- **Empty inventory**

See `server/utils/gameState.ts` for complete initial state.

## User Flow

### New User Registration
1. User registers → Account created
2. System automatically creates game state
3. User logs in → Can immediately play

### Existing User (No Game State)
1. User logs in → No game state
2. **Option A**: User navigates to `/home` → Game state auto-created
3. **Option B**: User clicks "Tạo nhân vật" → Manual creation page

### User with Game State
1. User logs in → Game state exists
2. User plays normally
3. If they visit `/create-character`, they see "Already have character" message

## Testing

To test the feature:

1. **Test auto-creation**:
   - Delete a user's game state from database
   - Log in as that user
   - Navigate to `/home`
   - Verify game state is auto-created

2. **Test manual creation**:
   - Delete a user's game state from database
   - Log in as that user
   - Navigate to `/create-character`
   - Click "Tạo nhân vật"
   - Verify game state is created

3. **Test duplicate prevention**:
   - Try to create game state when one already exists
   - Verify 409 error is returned

## Code Locations

- **Helper Function**: `server/utils/gameState.ts`
- **Auto-create Logic**: `server/api/action.post.ts`
- **Create Endpoint**: `server/api/gamestate/create.post.ts`
- **Check Endpoint**: `server/api/gamestate/check.get.ts`
- **UI Page**: `pages/create-character.vue`
- **Registration**: `server/api/auth/register.post.ts`

## Benefits

1. **Zero User Friction**: Users never see errors about missing game state
2. **Data Consistency**: All initial states use the same helper function
3. **Backward Compatible**: Works with existing users who lack game state
4. **User Control**: Optional manual creation page for transparency
5. **Fail-Safe**: Multiple creation points ensure users can always play
