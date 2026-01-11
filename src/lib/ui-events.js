export function trackUiEvent(name, payload = {}) {
  try {
    const entry = { name, payload, ts: new Date().toISOString() }
    // Placeholder: send to analytics endpoint later
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[UI EVENT]', entry)
    }
  } catch {}
}


