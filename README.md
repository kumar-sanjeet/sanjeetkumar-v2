<div>
  <h1>
    Sanjeet Kumar's Portfolio (sanjeetkumar-v2)
    &middot;
    <a href="https://github.com/kumar-sanjeet/sanjeetkumar-v2/deployments/activity_log?environment=production"><img src="https://img.shields.io/github/deployments/kumar-sanjeet/sanjeetkumar-v2/production?label=cloudflare&style=flat-square"/></a>
    <a href="https://github.com/kumar-sanjeet/sanjeetkumar-v2/commits/main"><img src="https://img.shields.io/github/commit-activity/m/kumar-sanjeet/sanjeetkumar-v2?style=flat-square"/></a>
  </h1>
</div>

This is the monorepo for my personal portfolio website, built with Turborepo and pnpm.

## 🚀 Live Site

The site is deployed on Cloudflare Pages. **[Link to your live site here]**

### Tech Stack

- 🚀 Next.js + TypeScript
- 🍃 Tailwind CSS
- ⚡ Turborepo
- 📦 pnpm

### Running the Project

First, ensure you have [pnpm installed](https://pnpm.io/installation).

Clone the repository to your local machine:

```
git clone <your-fork>
```

Navigate to the project's root directory:

```
cd ./sanjeetkumar-v2
```

Next, copy the development version of the `env` file:

```
cp ./apps/sanjeetkumar.com/env.example ./apps/sanjeetkumar.com/env.local
```

Now, you have the `env.local` file ready for configuration:

```
DATABASE_URL = your-database-connection-string
SALT_IP_ADDRESS = super-secret
```

For the `DATABASE_URL` use your database connection string. I personally use the free version of [MongoDB](https://www.mongodb.com/), and you can do the same by creating a database there and [adding the connection string](https://www.mongodb.com/basics/mongodb-connection-string) to the `env.local`.

As for `SALT_IP_ADDRESS`, feel free to fill it with some of your secret words. It acts as a salt for hashing users' IP addresses.

Once configuration is complete, still at the root of the project directory, install the required dependencies:

```
pnpm install
```

Finally, run the project:

```
pnpm dev
```

Now, your project should be up and running smoothly!
