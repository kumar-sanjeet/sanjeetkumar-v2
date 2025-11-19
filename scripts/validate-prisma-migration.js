#!/usr/bin/env node

/**
 * Prisma 4.x → 6.x Migration Validator
 *
 * Usage: node scripts/validate-prisma-migration.js
 *
 * This script checks for common issues when upgrading from Prisma 4.x to 6.x
 */

const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

class PrismaMigrationValidator {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.successes = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}]`;

    switch (type) {
      case 'error':
        console.error(`${RED}${prefix} ✗ ${message}${RESET}`);
        break;
      case 'warning':
        console.warn(`${YELLOW}${prefix} ⚠ ${message}${RESET}`);
        break;
      case 'success':
        console.log(`${GREEN}${prefix} ✓ ${message}${RESET}`);
        break;
      case 'info':
        console.log(`${CYAN}${prefix} ℹ ${message}${RESET}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }

  async scanFiles(dir, pattern) {
    const files = [];

    function traverse(currentDir) {
      try {
        const entries = fs.readdirSync(currentDir);

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            if (!entry.startsWith('.') && entry !== 'node_modules') {
              traverse(fullPath);
            }
          } else if (stat.isFile() && pattern.test(entry)) {
            files.push(fullPath);
          }
        }
      } catch (err) {
        // Skip inaccessible directories
      }
    }

    traverse(dir);
    return files;
  }

  checkRejectOnNotFound(files) {
    this.log('Checking for deprecated rejectOnNotFound...', 'info');

    const matches = [];
    let totalMatches = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (line.includes('rejectOnNotFound')) {
            totalMatches++;
            matches.push({
              file,
              line: index + 1,
              code: line.trim(),
            });
          }
        });
      } catch (err) {
        // Skip unreadable files
      }
    }

    if (totalMatches > 0) {
      this.issues.push({
        severity: 'HIGH',
        title: 'Deprecated rejectOnNotFound API',
        count: totalMatches,
        details: matches.slice(0, 5),
      });
      this.log(`Found ${totalMatches} instances of rejectOnNotFound`, 'error');
    } else {
      this.successes.push('No rejectOnNotFound usage found ✓');
      this.log('No rejectOnNotFound usage found', 'success');
    }

    return totalMatches;
  }

  checkObjectIdTypes(schemaFile) {
    this.log('Checking MongoDB ObjectId types...', 'info');

    try {
      const content = fs.readFileSync(schemaFile, 'utf-8');
      const objectIdMatches = content.match(/@db\.ObjectId/g) || [];

      if (objectIdMatches.length > 0) {
        this.successes.push(
          `Found ${objectIdMatches.length} @db.ObjectId fields`
        );
        this.log(
          `Found ${objectIdMatches.length} @db.ObjectId fields`,
          'success'
        );
        return true;
      } else {
        this.warnings.push(
          'No @db.ObjectId fields found in schema (unexpected for MongoDB)'
        );
        this.log('No @db.ObjectId fields found', 'warning');
        return false;
      }
    } catch (err) {
      this.issues.push({
        severity: 'MEDIUM',
        title: 'Could not read schema file',
        details: err.message,
      });
      this.log(`Could not read schema file: ${err.message}`, 'error');
      return false;
    }
  }

  checkRelationLoading(files) {
    this.log('Checking for potential relation loading issues...', 'info');

    const patterns = [
      /await\s+prisma\.\w+\.(findUnique|findFirst|findMany)\s*\(/g,
      /await\s+prisma\.\w+\.(update|upsert|delete|create)\s*\(/g,
    ];

    const riskyQueries = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          for (const pattern of patterns) {
            if (pattern.test(line)) {
              // Check if the next few lines contain include or select
              const contextLines = lines
                .slice(i, Math.min(i + 10, lines.length))
                .join(' ');

              if (
                !contextLines.includes('include') &&
                !contextLines.includes('select')
              ) {
                // Could be a lazy loading query - need manual review
                riskyQueries.push({
                  file,
                  line: i + 1,
                  code: line.trim().substring(0, 80),
                });
              }
            }
          }
        }
      } catch (err) {
        // Skip unreadable files
      }
    }

    if (riskyQueries.length > 0) {
      this.warnings.push({
        severity: 'MEDIUM',
        title: 'Potential relation loading issues',
        count: riskyQueries.length,
        details: riskyQueries.slice(0, 5),
      });
      this.log(
        `Found ${riskyQueries.length} queries that may need review for relation loading`,
        'warning'
      );
    } else {
      this.successes.push('No obvious relation loading issues found ✓');
      this.log('No obvious relation loading issues found', 'success');
    }

    return riskyQueries.length;
  }

  checkPackageJson() {
    this.log('Checking package.json versions...', 'info');

    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const prismaVersion = packageJson.devDependencies?.prisma;
      const clientVersion = packageJson.dependencies?.['@prisma/client'];

      const results = [];

      if (prismaVersion) {
        const majorVersion = parseInt(prismaVersion.match(/\d+/)?.[0] || '0');
        if (majorVersion < 6) {
          results.push({
            type: 'warning',
            message: `prisma: ${prismaVersion} (recommend 6.x for upgrade)`,
          });
        } else {
          results.push({
            type: 'success',
            message: `prisma: ${prismaVersion} ✓`,
          });
        }
      }

      if (clientVersion) {
        const majorVersion = parseInt(clientVersion.match(/\d+/)?.[0] || '0');
        if (majorVersion < 6) {
          results.push({
            type: 'warning',
            message: `@prisma/client: ${clientVersion} (recommend 6.x for upgrade)`,
          });
        } else {
          results.push({
            type: 'success',
            message: `@prisma/client: ${clientVersion} ✓`,
          });
        }
      }

      results.forEach((result) => {
        this.log(result.message, result.type);
        if (result.type === 'success') {
          this.successes.push(result.message);
        } else {
          this.warnings.push(result.message);
        }
      });
    } catch (err) {
      this.issues.push({
        severity: 'LOW',
        title: 'Could not read package.json',
        details: err.message,
      });
    }
  }

  async run() {
    console.log(
      `\n${CYAN}╔══════════════════════════════════════════════════════════════╗${RESET}`
    );
    console.log(
      `${CYAN}║     Prisma 4.x → 6.x Migration Validator                    ║${RESET}`
    );
    console.log(
      `${CYAN}╚══════════════════════════════════════════════════════════════╝${RESET}\n`
    );

    try {
      this.checkPackageJson();

      const srcDir = path.join(process.cwd(), 'src');
      const appDir = path.join(process.cwd(), 'apps/sanjeetkumar.com/src');
      const searchDir = fs.existsSync(srcDir) ? srcDir : appDir;

      if (!fs.existsSync(searchDir)) {
        this.log('Could not find src directory', 'warning');
        return;
      }

      const tsFiles = await this.scanFiles(searchDir, /\.(ts|tsx)$/);
      this.log(`Found ${tsFiles.length} TypeScript files to scan`, 'info');

      const schemaFile = path.join(process.cwd(), 'prisma/schema.prisma');

      if (fs.existsSync(schemaFile)) {
        this.checkObjectIdTypes(schemaFile);
      }

      this.checkRejectOnNotFound(tsFiles);
      this.checkRelationLoading(tsFiles);

      this.printSummary();
    } catch (err) {
      this.log(`Validation failed: ${err.message}`, 'error');
      process.exit(1);
    }
  }

  printSummary() {
    console.log(
      `\n${CYAN}╔══════════════════════════════════════════════════════════════╗${RESET}`
    );
    console.log(
      `${CYAN}║                     VALIDATION SUMMARY                       ║${RESET}`
    );
    console.log(
      `${CYAN}╚══════════════════════════════════════════════════════════════╝${RESET}\n`
    );

    if (this.successes.length > 0) {
      console.log(`${GREEN}✓ PASSED (${this.successes.length}):${RESET}`);
      this.successes.forEach((s) => console.log(`  ${s}`));
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log(`${YELLOW}⚠ WARNINGS (${this.warnings.length}):${RESET}`);
      this.warnings.forEach((w) => {
        if (typeof w === 'string') {
          console.log(`  ${w}`);
        } else {
          console.log(`  [${w.severity}] ${w.title}`);
          if (w.count) console.log(`    Found: ${w.count} instances`);
          if (w.details && Array.isArray(w.details) && w.details.length > 0) {
            w.details.slice(0, 3).forEach((detail) => {
              if (typeof detail === 'string') {
                console.log(`    - ${detail}`);
              } else {
                console.log(
                  `    - ${detail.file}:${detail.line} → ${detail.code}`
                );
              }
            });
          }
        }
      });
      console.log();
    }

    if (this.issues.length > 0) {
      console.log(`${RED}✗ ISSUES (${this.issues.length}):${RESET}`);
      this.issues.forEach((issue) => {
        console.log(`  [${issue.severity}] ${issue.title}`);
        if (issue.count) console.log(`    Found: ${issue.count} instances`);
        if (issue.details) {
          if (Array.isArray(issue.details)) {
            issue.details.slice(0, 3).forEach((detail) => {
              if (typeof detail === 'string') {
                console.log(`    - ${detail}`);
              } else if (detail.file) {
                console.log(
                  `    - ${detail.file}:${detail.line} → ${detail.code}`
                );
              }
            });
          } else {
            console.log(`    ${issue.details}`);
          }
        }
      });
      console.log();
    }

    const total = this.issues.length + this.warnings.length;
    if (total === 0) {
      console.log(`${GREEN}🎉 Migration readiness: EXCELLENT${RESET}`);
      console.log(
        `${GREEN}Your codebase appears ready for Prisma 6.x upgrade!${RESET}\n`
      );
    } else if (this.issues.length === 0) {
      console.log(`${YELLOW}⚠️  Migration readiness: GOOD${RESET}`);
      console.log(
        `${YELLOW}Some warnings found - please review before upgrading${RESET}\n`
      );
    } else {
      console.log(`${RED}❌ Migration readiness: NEEDS FIXES${RESET}`);
      console.log(
        `${RED}Please address ${this.issues.length} issue(s) before upgrading${RESET}\n`
      );
    }

    process.exit(this.issues.length > 0 ? 1 : 0);
  }
}

// Run validator
const validator = new PrismaMigrationValidator();
validator.run().catch((err) => {
  console.error(`${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
