import { posthog } from './posthog'

type LogAttributes = Record<string, boolean | number | string>

export const posthogLog = {
  info(body: string, attributes: LogAttributes) {
    posthog?.logger.info(body, attributes)
  },
}
