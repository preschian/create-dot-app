import { randomUUID } from 'node:crypto'
import process from 'node:process'
import { PostHog } from 'posthog-node'

const client = new PostHog(
  'phc_a0IjGCTftVf4VZHbSsMG4h7E8e9Q4DWAulfnXJPdMMO',
  {
    host: 'https://eu.i.posthog.com',
  },
)

// Generate a unique session ID for this CLI run
const sessionId = randomUUID()

export async function trackProjectCreated(template: string, projectName: string) {
  try {
    client.capture({
      distinctId: sessionId,
      event: 'project_created',
      properties: {
        template,
        project_name: projectName,
        cli_version: process.env.npm_package_version || 'unknown',
      },
    })
  }
  catch (error) {
    // Silently fail analytics to not disrupt user experience
    console.debug('Analytics tracking failed:', error)
  }
}

export async function shutdownAnalytics() {
  try {
    await client.shutdown()
  }
  catch (error) {
    console.debug('Analytics shutdown failed:', error)
  }
}
