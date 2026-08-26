import { test as setup } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const outputDir = 'src/test/e2e/data/.auth';
const outputFile = `${outputDir}/ci-user.json`;

setup('register', async ({ request }) => {
  if (!process.env.CI) {
    setup.skip();
    return;
  }

  const userEmail = process.env.PLAYWRIGHT_USER_EMAIL;
  const userUsername = process.env.PLAYWRIGHT_USER_USERNAME;
  const userPassword = process.env.PLAYWRIGHT_USER_PASSWORD;
  const followerEmail = process.env.PLAYWRIGHT_FOLLOWER_EMAIL;
  const followerUsername = process.env.PLAYWRIGHT_FOLLOWER_USERNAME;
  const followerPassword = process.env.PLAYWRIGHT_FOLLOWER_PASSWORD;

  if (
    !userEmail ||
    !userUsername ||
    !userPassword ||
    !followerEmail ||
    !followerUsername ||
    !followerPassword
  ) {
    throw new Error(
      'PLAYWRIGHT_USER_EMAIL, PLAYWRIGHT_USER_USERNAME, PLAYWRIGHT_USER_PASSWORD, ' +
        'PLAYWRIGHT_FOLLOWER_EMAIL, PLAYWRIGHT_FOLLOWER_USERNAME, and PLAYWRIGHT_FOLLOWER_PASSWORD ' +
        'must be set to run CI registration setup',
    );
  }

  const userResponse = await request.post('http://localhost:8082/users-api/auth/register', {
    data: { email: userEmail, username: userUsername, password: userPassword },
  });
  if (!userResponse.ok()) {
    throw new Error(
      `Failed to register test user: ${userResponse.status()} ${await userResponse.text()}`,
    );
  }
  const userBody = (await userResponse.json()) as { userId: string };

  const followerResponse = await request.post('http://localhost:8082/users-api/auth/register', {
    data: { email: followerEmail, username: followerUsername, password: followerPassword },
  });
  if (!followerResponse.ok()) {
    throw new Error(
      `Failed to register follower: ${followerResponse.status()} ${await followerResponse.text()}`,
    );
  }

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, JSON.stringify({ testUserId: userBody.userId }));
});
