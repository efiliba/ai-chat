### Format code:

- <kbd>Shift</kbd> + <kbd>Option</kbd> + <kbd>F</kbd>

## Setup the Prisma DB:

```bash
# recreate the prisma db defined in ./prisma/schema.prisma
npx prisma migrate dev --name init # NOTE: restart dev server
```
