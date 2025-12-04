# Entity Validation Schemas

This directory contains Zod validation schemas for all entities in the application. Each validation file provides comprehensive type-safe validation with helper functions for common operations.

## Overview

All validation schemas follow a consistent pattern:
- Base schema for the complete entity
- Create schema for new entity creation
- Update schema for entity updates
- ID validation schema
- SafeParse functions for validation
- Helper functions for common checks

## Available Validation Schemas

### 1. UserValidation

Validates user entities and operations.

**Schemas:**
- `userSchema` - Full user object validation
- `createUserSchema` - New user creation (auto-generates name from firstName + lastName)
- `updateUserSchema` - User updates
- `isUserActiveSchema` - Checks if user is active (not deleted/locked/blocked)
- `userIdSchema` - User ID validation

**Usage:**
```typescript
import { validateUser, validateCreateUser, isUserActive } from './entities';

// Validate complete user object
const result = validateUser(userData);
if (result.success) {
  console.log('Valid user:', result.data);
}

// Create new user
const newUserResult = validateCreateUser({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
});

// Check if user is active
if (isUserActive(userData)) {
  console.log('User is active');
}
```

### 2. ApplicationValidation

Validates job application entities.

**Schemas:**
- `applicationSchema` - Full application validation
- `createApplicationSchema` - New application creation
- `updateApplicationSchema` - Application updates
- `updateApplicationStatusSchema` - Status-only updates
- `isApplicationActiveSchema` - Active check
- `platformEnum` - Platform validation (linkedin, glassdoor, other)
- `applicationStatusEnum` - Status validation (applied, interviewing, accepted, rejected)

**Usage:**
```typescript
import { 
  validateCreateApplication, 
  validateUpdateApplicationStatus,
  isValidStatusTransition 
} from './entities';

// Create application
const result = validateCreateApplication({
  employer: 'Tech Corp',
  jobTitle: 'Software Engineer',
  location: 'San Francisco, CA',
  platform: 'linkedin',
  status: 'applied',
});

// Update status
const statusResult = validateUpdateApplicationStatus({
  status: 'interviewing',
});

// Check valid status transition
const canTransition = isValidStatusTransition('applied', 'interviewing'); // true
```

### 3. ResumeValidation

Validates resume file entities.

**Schemas:**
- `resumeSchema` - Full resume validation
- `createResumeSchema` - New resume creation
- `updateResumeSchema` - Resume updates
- `resumeUploadSchema` - Resume file upload
- `resumeFileSchema` - File validation (type, size)

**File Constraints:**
- Max size: 10MB
- Allowed types: PDF, DOC, DOCX, TXT

**Usage:**
```typescript
import { 
  validateCreateResume, 
  validateResumeFile,
  isValidFileExtension 
} from './entities';

// Validate resume creation
const result = validateCreateResume({
  name: 'My Resume',
  filename: 'resume.pdf',
  url: 'https://storage.example.com/resume.pdf',
  filetype: 'application/pdf',
  filesize: 1024000,
});

// Validate file
const fileResult = validateResumeFile({
  filename: 'resume.pdf',
  filetype: 'application/pdf',
  filesize: 1024000,
});

// Check extension
if (isValidFileExtension('resume.pdf')) {
  console.log('Valid extension');
}
```

### 4. CoverletterValidation

Validates cover letter file entities (same structure as Resumes).

**Schemas:**
- `coverletterSchema` - Full coverletter validation
- `createCoverletterSchema` - New coverletter creation
- `updateCoverletterSchema` - Coverletter updates
- `coverletterUploadSchema` - Coverletter file upload
- `coverletterFileSchema` - File validation

**Usage:**
```typescript
import { validateCreateCoverletter, validateCoverletterFile } from './entities';

const result = validateCreateCoverletter({
  name: 'Tech Corp Cover Letter',
  filename: 'coverletter.pdf',
  url: 'https://storage.example.com/coverletter.pdf',
  filetype: 'application/pdf',
  filesize: 512000,
});
```

### 5. ChatSessionValidation

Validates chat session entities for AI interactions.

**Schemas:**
- `chatSessionSchema` - Full chat session validation
- `createChatSessionSchema` - New session creation
- `updateChatSessionSchema` - Session updates
- `resourceTypeEnum` - Resource type validation (resume, coverletter)
- `resourceReferenceSchema` - Resource reference validation

**Usage:**
```typescript
import { validateCreateChatSession, isValidResourceType } from './entities';

const result = validateCreateChatSession({
  resourceType: 'resume',
  resourceId: 'abc123def456789',
  resourceName: 'My Resume',
});

if (isValidResourceType('resume')) {
  console.log('Valid resource type');
}
```

### 6. ChatMessageValidation

Validates chat message entities.

**Schemas:**
- `chatMessageSchema` - Full message validation
- `createChatMessageSchema` - New message creation
- `messageContentSchema` - Content-only validation
- `senderEnum` - Sender validation (user, ai)
- `bulkChatMessagesSchema` - Multiple messages validation

**Constraints:**
- Max content length: 10,000 characters
- Min content length: 1 character

**Usage:**
```typescript
import { 
  validateCreateChatMessage, 
  sanitizeMessageContent,
  isValidMessageLength 
} from './entities';

const result = validateCreateChatMessage({
  content: 'Can you review my resume?',
  sender: 'user',
  chatSessionId: 'abc123def456789',
});

// Sanitize content (removes HTML)
const clean = sanitizeMessageContent('<p>Hello</p>'); // 'Hello'

// Check length
if (isValidMessageLength(content)) {
  console.log('Valid length');
}
```

### 7. UserSessionValidation

Validates user authentication sessions.

**Schemas:**
- `sessionSchema` - Full session validation
- `createSessionSchema` - New session creation
- `updateSessionSchema` - Session updates
- `isSessionValidSchema` - Checks if session is valid and not expired
- `sessionIdSchema` - Session ID validation

**Usage:**
```typescript
import { 
  validateSession, 
  isSessionValid,
  isSessionExpired,
  calculateSessionExpiry 
} from './entities';

const result = validateSession(sessionData);

// Check if session is valid
if (isSessionValid(sessionData)) {
  console.log('Session is valid');
}

// Check expiration
if (isSessionExpired(session.expiresAt)) {
  console.log('Session expired');
}

// Calculate expiry (7 days default)
const expiresAt = calculateSessionExpiry(7);
```

### 8. UserAccountValidation

Validates user account entities (authentication providers).

**Schemas:**
- `userAccountSchema` - Full account validation
- `createCredentialAccountSchema` - Email/password account creation
- `createOAuthAccountSchema` - OAuth account creation
- `updateUserAccountSchema` - Account updates
- `updatePasswordSchema` - Password change validation
- `providerIdEnum` - Provider validation (credential, google, github, etc.)

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Maximum 255 characters

**Usage:**
```typescript
import { 
  validateCreateCredentialAccount,
  validateUpdatePassword,
  validatePasswordStrength,
  isOAuthProvider 
} from './entities';

// Create credential account
const result = validateCreateCredentialAccount({
  providerId: 'credential',
  accountId: 'user@example.com',
  password: 'SecurePass123',
});

// Update password
const pwdResult = validateUpdatePassword({
  currentPassword: 'OldPass123',
  newPassword: 'NewPass456',
  confirmPassword: 'NewPass456',
});

// Check password strength
const strength = validatePasswordStrength('MyPassword123');
console.log(strength);
// { isStrong: true, score: 5, feedback: ['Add special characters...'] }

// Check provider type
if (isOAuthProvider('google')) {
  console.log('OAuth provider');
}
```

### 9. UserVerificationValidation

Validates user verification (email verification, OTP) entities.

**Schemas:**
- `userVerificationSchema` - Full verification validation
- `createUserVerificationSchema` - Generic verification creation
- `createEmailVerificationSchema` - Email verification with 6-digit code
- `verifyCodeSchema` - Code verification
- `resendVerificationSchema` - Resend verification request
- `isVerificationValidSchema` - Check if verification is valid and not expired

**Verification Code:**
- Format: 6-digit number
- Default expiry: 1 hour

**Usage:**
```typescript
import { 
  validateCreateEmailVerification,
  validateVerifyCode,
  generateVerificationCode,
  calculateExpiryTime,
  canResendVerification 
} from './entities';

// Create email verification
const code = generateVerificationCode(); // '123456'
const expiresAt = calculateExpiryTime(60); // 1 hour from now

const result = validateCreateEmailVerification({
  identifier: 'user@example.com',
  value: code,
  expiresAt,
});

// Verify code
const verifyResult = validateVerifyCode({
  identifier: 'user@example.com',
  code: '123456',
});

// Check if can resend
if (canResendVerification(lastSentAt, 1)) {
  console.log('Can resend verification');
}
```

## Common Patterns

### SafeParse Pattern

All validation functions return a Zod SafeParseReturnType:

```typescript
const result = validateUser(data);

if (result.success) {
  // data is valid, use result.data (typed)
  console.log(result.data.email);
} else {
  // data is invalid, use result.error
  console.error(result.error.errors);
}
```

### Type Guards

Helper functions that work as TypeScript type guards:

```typescript
if (isValidUser(data)) {
  // TypeScript knows data is UserSchema
  console.log(data.email); // Type-safe!
}
```

### Error Handling

Validation errors include detailed messages:

```typescript
const result = validateCreateUser({ email: 'invalid' });

if (!result.success) {
  result.error.errors.forEach(err => {
    console.log(`${err.path}: ${err.message}`);
  });
  // Output: email: Invalid email format
}
```

## Best Practices

1. **Always use SafeParse** - Never use `.parse()` which throws errors
2. **Validate at boundaries** - Validate data when it enters your system (API endpoints, forms)
3. **Use type guards** - Leverage TypeScript type narrowing with helper functions
4. **Sanitize user input** - Use helper functions like `sanitizeMessageContent()`
5. **Check business rules** - Use validation helpers like `isValidStatusTransition()`
6. **Handle errors gracefully** - Provide user-friendly error messages

## Example: Complete Validation Flow

```typescript
import { validateCreateApplication, isValidApplication } from './entities';

// In your controller/handler
export async function createApplication(req: Request, res: Response) {
  // 1. Validate request body
  const validation = validateCreateApplication(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
  
  // 2. Use validated data (type-safe)
  const applicationData = validation.data;
  
  // 3. Create application
  const application = await applicationRepository.create(applicationData);
  
  // 4. Validate response (optional but recommended)
  if (!isValidApplication(application)) {
    throw new Error('Created application is invalid');
  }
  
  return res.status(201).json(application);
}
```

## Extending Validation Schemas

To add new validation:

1. Add new schema to relevant validation file
2. Add safeParse function
3. Export from validation file
4. Add to index.ts exports
5. Update this README

Example:

```typescript
// In UserValidation.ts
export const userEmailSchema = z.object({
  email: z.string().email(),
});

export const validateUserEmail = (data: unknown) => {
  return userEmailSchema.safeParse(data);
};

// In index.ts
export { validateUserEmail } from './UserValidation';
```

## Testing

All validation schemas should be tested:

```typescript
import { describe, it, expect } from 'bun:test';
import { validateUser } from './UserValidation';

describe('UserValidation', () => {
  it('should validate valid user', () => {
    const result = validateUser({
      id: '123456789012345',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      isEmailVerified: false,
      createdAt: new Date(),
    });
    
    expect(result.success).toBe(true);
  });
  
  it('should reject invalid email', () => {
    const result = validateUser({
      id: '123456789012345',
      email: 'invalid-email',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      isEmailVerified: false,
      createdAt: new Date(),
    });
    
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].path).toEqual(['email']);
  });
});
```

## Contributing

When adding new entity validations:
- Follow the existing pattern
- Include create, update, and ID schemas
- Add safeParse functions
- Include helper functions for common operations
- Export from index.ts
- Document in this README
- Add unit tests
