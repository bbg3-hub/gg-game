# Game Builder Guide

## Overview

The Game Builder is a powerful system for creating custom escape room experiences with multiple phases and dynamic questions.

## Features

### Question Types

1. **Text Answer**
   - Players type a text answer
   - Exact match (case-insensitive)
   - Perfect for puzzles with specific answers

2. **Multiple Choice**
   - Multiple options with one or more correct answers
   - Click to select
   - Great for knowledge checks

3. **Open Response**
   - Free text entry
   - Always marked correct
   - Perfect for narrative moments or exploration

### Question Configuration

Each question can be configured with:

- **Title**: Short name for the question
- **Content**: Full question text or description
- **Solution**: The correct answer
- **Difficulty**: Easy, Medium, or Hard
- **Points**: Base points awarded (with penalty for multiple attempts)
- **Time Limit**: Optional countdown timer (in seconds)
- **Max Attempts**: Optional limit on number of tries
- **Hints**: Up to 2 progressive hints players can reveal

### Phase Management

- Create unlimited phases
- Drag and drop to reorder
- Each phase has:
  - Name
  - Description
  - Ordered list of questions
- Players progress sequentially through phases

## Getting Started

### Creating a New Game

1. Navigate to Admin Dashboard
2. Click **[GAME BUILDER]**
3. Click **New Game**
4. Enter game title and description in Overview tab

### Adding Phases

1. Go to **Phases** tab
2. Click **+ Add Phase**
3. Click on a phase to select it
4. Edit phase name and description
5. Drag phases to reorder

### Adding Questions

1. Select a phase in the Phases tab
2. Go to **Questions** tab
3. Click **+ Add Question**
4. Configure question settings:
   - Set title and content
   - Choose question type
   - Set solution/correct answer
   - Configure difficulty and points
   - Optionally set time limit and max attempts
   - Add hints if desired
5. Click **Save Question**

### Saving and Exporting

- Click **Save Game** to persist to server
- Click **Export JSON** to download game configuration
- Games auto-save to localStorage as drafts

## Player Experience

When players join a builder game:

1. They see the game title and description
2. Progress bar shows overall completion
3. Current phase and question are displayed
4. Questions show:
   - Title and content
   - Timer (if configured)
   - Attempts remaining
   - Available hints
5. Players progress sequentially through questions
6. Score is calculated with penalties for multiple attempts

## API Endpoints

- `POST /api/admin/save-game` - Save game configuration
- `POST /api/admin/phase` - Add phase
- `PUT /api/admin/phase` - Update phase
- `DELETE /api/admin/phase` - Delete phase
- `POST /api/admin/question` - Add question
- `PUT /api/admin/question` - Update question
- `DELETE /api/admin/question` - Delete question
- `POST /api/game/submit-answer` - Submit answer during gameplay

## Backward Compatibility

The game builder system is fully backward compatible:

- Existing games without phases continue to work in legacy mode
- Legacy mode uses the original Morse → Meaning → Mini-game → Bonus flow
- New builder games are detected by presence of `phases` array
- Player interface auto-detects and renders appropriate mode

## Technical Details

### Data Structure

```typescript
interface Question {
  id: string;
  type: 'text' | 'multiple-choice' | 'open-response';
  title: string;
  content: string;
  solution: string;
  options?: Array<{text: string; isCorrect: boolean}>;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number;
  maxAttempts?: number;
  hints?: string[];
}

interface GamePhase {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  order: number;
}
```

### Persistence

- Client-side: localStorage for drafts
- Server-side: File-based persistence to `data/sessions.json`
- Use `updateSessionWithBuilder` to save to server

### Validation

Use built-in validation helpers:
- `validateQuestion(question)` - Returns array of error messages
- `validatePhase(phase)` - Validates phase and all questions
- `validateGameSession(session)` - Validates entire game

## Best Practices

1. **Progressive Difficulty**: Start with easy questions, increase difficulty
2. **Clear Instructions**: Use content field for detailed explanations
3. **Meaningful Points**: Award more points for harder questions
4. **Balanced Time Limits**: Allow enough time for problem-solving
5. **Helpful Hints**: First hint should nudge, second should nearly give it away
6. **Test Your Game**: Play through before deploying to players
7. **Phase Grouping**: Group related questions into logical phases

## Troubleshooting

**Build fails**: Run `npm run build` to check for TypeScript errors

**Questions not saving**: Check browser console for API errors

**Players can't progress**: Verify questions have correct solutions configured

**Timer not showing**: Ensure `timeLimit` is set and greater than 0

**Max attempts not working**: Verify `maxAttempts` is configured

## Future Enhancements

Potential improvements for future versions:
- Image support in questions
- Audio/video content
- Collaborative questions (require multiple players)
- Branching paths based on answers
- Dynamic question generation
- Team scoring modes
- Real-time player collaboration
