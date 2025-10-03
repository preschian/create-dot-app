import { randomUUID } from 'node:crypto'
import process from 'node:process'
import { PostHog } from 'posthog-node'
import { version } from '../package.json'

const client = new PostHog(
  'phc_a0IjGCTftVf4VZHbSsMG4h7E8e9Q4DWAulfnXJPdMMO',
  {
    host: 'https://eu.i.posthog.com',
  },
)

// Generate a unique session ID for this CLI run
const sessionId = randomUUID()

export async function trackProjectCreated(template: string) {
  // Skip telemetry if disabled via environment variable
  if (process.env.DISABLE_TELEMETRY === 'true') {
    return
  }

  try {
    client.capture({
      distinctId: sessionId,
      event: 'project_created',
      properties: {
        template,
        cli_version: version || 'unknown',
      },
    })
  }
  catch {
    // Silently fail analytics to not disrupt user experience
  }
}
