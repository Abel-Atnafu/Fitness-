async function request(method, path, body) {
  let res
  try {
    res = await fetch(path, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch {
    const err = new Error('Network error — check your connection')
    err.status = 0
    throw err
  }

  if (!res.ok) {
    let msg = null
    try {
      const data = await res.json()
      msg = data.error || data.message || null
    } catch {
      try {
        const text = await res.text()
        if (text && text.length < 200 && !text.trim().startsWith('<')) {
          msg = text.trim()
        }
      } catch {}
    }

    if (!msg) {
      if (res.status === 503) msg = 'Server temporarily unavailable — please try again shortly'
      else if (res.status === 401) msg = 'Session expired — please sign in again'
      else if (res.status >= 500) msg = 'Server error — please try again'
      else msg = 'Request failed'
    }

    const err = new Error(msg)
    err.status = res.status
    throw err
  }

  return res.json()
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}
