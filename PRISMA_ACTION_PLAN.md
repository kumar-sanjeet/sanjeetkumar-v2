# Prisma 6.x Migration Action Plan

**Project:** sanjeetkumar-v2  
**Database:** MongoDB  
**Current Version:** 4.8.1  
**Target Version:** 6.x  
**Priority:** Medium  
**Estimated Duration:** 3-5 days

---

## 📊 Executive Summary

Your Prisma schema is **well-structured for MongoDB** and should migrate smoothly. The main areas requiring attention are:

1. ✅ **Schema:** Minimal changes needed (your MongoDB setup is clean)
2. ⚠️ **Code:** Need to audit for `rejectOnNotFound` and relation loading patterns
3. ⚠️ **Testing:** Comprehensive test coverage required
4. ✅ **Dependencies:** Simple version bump (tools handle most compatibility)

**Risk Level:** 🟡 **MEDIUM** (Standard upgrade complexity)

---

## 🎯 Day-by-Day Action Plan

### **Day 1: Analysis & Preparation**

#### Morning (1-2 hours)

- [ ] Run validation script:
  ```bash
  node scripts/validate-prisma-migration.js
  ```
- [ ] Review output and document findings
- [ ] Assign team members to different code sections

#### Afternoon (2-3 hours)

- [ ] Create feature branch:
  ```bash
  git checkout -b chore/prisma-upgrade-6x
  ```
- [ ] Backup current setup:
  ```bash
  git tag backup/prisma-4.8.1
  ```
- [ ] Document baseline metrics:
  - Database size
  - Current query performance
  - Error rates (if available)

#### Evening (optional)

- [ ] Team review meeting of validation report
- [ ] Distribute tasks to team members

---

### **Day 2: Dependency Update & Initial Testing**

#### Morning (1-2 hours)

- [ ] Update Prisma in `apps/sanjeetkumar.com/package.json`:

  ```bash
  cd apps/sanjeetkumar.com
  pnpm add -D prisma@6
  pnpm add @prisma/client@6
  ```

- [ ] Install dependencies:

  ```bash
  pnpm install
  ```

- [ ] Generate Prisma client:

  ```bash
  pnpm db:generate
  ```

- [ ] Build the app:
  ```bash
  pnpm build
  ```

#### Afternoon (2-3 hours)

- [ ] Run TypeScript checks:

  ```bash
  pnpm lint:types
  ```

- [ ] Run linter:

  ```bash
  pnpm lint
  ```

- [ ] Fix any generated errors (usually minor type adjustments)

#### Evening (1-2 hours)

- [ ] Start code audit for `rejectOnNotFound`:
  ```bash
  grep -r "rejectOnNotFound" src/ --include="*.ts" --include="*.tsx"
  ```

---

### **Day 3: Code Migration**

#### Morning (2-3 hours)

**Replace all `rejectOnNotFound` patterns:**

Search for all instances:

```bash
grep -rn "rejectOnNotFound" apps/sanjeetkumar.com/src --include="*.ts" --include="*.tsx"
```

Example replacement (adapt to your codebase):

```typescript
// Before
const meta = await prisma.contentMeta.findUnique({
  where: { slug },
  rejectOnNotFound: true,
});

// After
import { PrismaClientKnownRequestError } from '@prisma/client';

try {
  const meta = await prisma.contentMeta.findUniqueOrThrow({
    where: { slug },
  });
} catch (error) {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    throw new Error('Content not found');
  }
  throw error;
}
```

#### Afternoon (2-3 hours)

**Audit relation loading patterns:**

Look for patterns where relations are accessed without `include:` or `select:`:

```bash
grep -n "prisma\..*\.find" apps/sanjeetkumar.com/src --include="*.ts" | head -20
```

For each potential issue, update to explicitly include relations:

```typescript
// Before (may fail in strict mode)
const content = await prisma.contentMeta.findUnique({
  where: { id },
});
const views = content.views;

// After
const content = await prisma.contentMeta.findUnique({
  where: { id },
  include: { views: true },
});
const views = content.views; // Now safe
```

#### Evening (1-2 hours)

- [ ] Compile and check for errors:
  ```bash
  pnpm build
  ```

---

### **Day 4: Testing & Validation**

#### Morning (2-3 hours)

**Run unit tests:**

```bash
# If you have Jest or similar
npm run test
# or
pnpm test
```

**Manual testing of key flows:**

- [ ] Create a new content entry with views/shares/reactions
- [ ] Query content with relations
- [ ] Update content
- [ ] Delete content (test cascading deletes)

#### Afternoon (2-3 hours)

**Integration testing:**

- [ ] Test the full app workflow
- [ ] Verify API responses are correct
- [ ] Check error handling
- [ ] Test edge cases:
  - Invalid ObjectId strings
  - Non-existent records
  - Concurrent updates
  - Large result sets

#### Evening (1-2 hours)

- [ ] Performance comparison:

  ```bash
  # Record baseline query times
  # Run same queries with Prisma 6.x
  # Compare results
  ```

- [ ] Document any behavior changes

---

### **Day 5: Final Review & Merge**

#### Morning (1-2 hours)

**Code review preparation:**

- [ ] Summarize all changes:

  ```bash
  git diff develop...HEAD --stat
  ```

- [ ] Create detailed PR description with:
  - Changes made
  - Testing performed
  - Known issues (if any)
  - Migration highlights

#### Afternoon (1-2 hours)

**Team review & approval:**

- [ ] Code review by another developer
- [ ] QA sign-off
- [ ] Tech lead approval

#### Evening (1-2 hours)

**Merge to main branch:**

```bash
git checkout develop
git pull origin develop
git merge --no-ff chore/prisma-upgrade-6x
git push origin develop
```

---

## 🔍 Detailed Code Changes Guide

### Pattern 1: Replace `rejectOnNotFound`

**Files to check:**

```bash
grep -r "rejectOnNotFound" apps/sanjeetkumar.com/src --include="*.ts" --include="*.tsx" -l
```

**Conversion template:**

```typescript
// ❌ OLD (Prisma 4.x)
async function getContentMeta(slug: string) {
  return prisma.contentMeta.findUnique({
    where: { slug },
    rejectOnNotFound: true,
  });
}

// ✅ NEW (Prisma 6.x)
async function getContentMeta(slug: string) {
  return prisma.contentMeta.findUniqueOrThrow({
    where: { slug },
  });
}

// Or with explicit error handling:
async function getContentMetaSafe(slug: string) {
  try {
    return await prisma.contentMeta.findUniqueOrThrow({
      where: { slug },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return null; // or throw NotFoundError()
    }
    throw error;
  }
}
```

### Pattern 2: Explicit Relation Loading

**Find pattern:**

```bash
grep -A5 "findUnique\|findFirst\|findMany" apps/sanjeetkumar.com/src/*.ts \
  | grep -B5 "views\|shares\|reactions" | head -30
```

**Conversion template:**

```typescript
// ❌ OLD (may lazy-load)
async function getContent(id: string) {
  const content = await prisma.contentMeta.findUnique({
    where: { id },
  });
  return {
    ...content,
    stats: {
      views: content.views?.length ?? 0,
      shares: content.shares?.length ?? 0,
    },
  };
}

// ✅ NEW (explicit include)
async function getContent(id: string) {
  const content = await prisma.contentMeta.findUnique({
    where: { id },
    include: {
      views: true,
      shares: true,
      reactions: true,
    },
  });

  if (!content) return null;

  return {
    ...content,
    stats: {
      views: content.views?.length ?? 0,
      shares: content.shares?.length ?? 0,
      reactions: content.reactions?.length ?? 0,
    },
  };
}
```

### Pattern 3: Error Handling Updates

**Before (Prisma 4.x):**

```typescript
try {
  await prisma.contentMeta.delete({
    where: { id },
  });
} catch (error: any) {
  if (error.code === 'P2025') {
    throw new NotFoundError();
  }
}
```

**After (Prisma 6.x):**

```typescript
import { PrismaClientKnownRequestError } from '@prisma/client';

try {
  await prisma.contentMeta.delete({
    where: { id },
  });
} catch (error) {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    throw new NotFoundError();
  }
  throw error;
}
```

---

## ✅ Pre-Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Linter passes with no errors
- [ ] All tests passing (unit & integration)
- [ ] No deprecated API usage
- [ ] MongoDB connection tested
- [ ] Query performance validated
- [ ] Error handling verified
- [ ] Code review approved
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] Team trained on changes
- [ ] Deployment window scheduled

---

## 🚨 Troubleshooting Common Issues

### Issue: "P2025: An operation failed because it depends on one or more records"

**Cause:** `findUniqueOrThrow` is stricter about what exists

**Solution:**

```typescript
// Check if exists first
const exists = await prisma.contentMeta.findUnique({
  where: { id },
});

if (!exists) {
  // Handle not found
}
```

### Issue: "Cannot read property 'views' of null"

**Cause:** Attempting to access relation without explicit `include:`

**Solution:**

```typescript
const content = await prisma.contentMeta.findUnique({
  where: { id },
  include: { views: true }, // Add this
});

const viewCount = content?.views?.length ?? 0;
```

### Issue: MongoDB ObjectId type errors

**Cause:** String IDs being passed where ObjectIds expected

**Solution:**

```typescript
import { ObjectId } from 'mongodb';

// Ensure valid ObjectId format
const id = new ObjectId(stringId).toString();

const content = await prisma.contentMeta.findUnique({
  where: { id },
});
```

---

## 📋 Sign-Off Template

Once complete, have team members sign off:

```
Prisma 6.x Migration - Team Sign-Off

✓ Code Migration: _________________ (Date: _______)
✓ Code Review: _________________ (Date: _______)
✓ Testing: _________________ (Date: _______)
✓ QA Approval: _________________ (Date: _______)
✓ Tech Lead: _________________ (Date: _______)

Notes:
_________________________________________________________
_________________________________________________________

Ready for Production: YES / NO
```

---

**Created:** November 17, 2025  
**Next Review:** Upon migration completion
