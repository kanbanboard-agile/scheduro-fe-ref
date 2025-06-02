/**
 * Utility functions for handling cookies
 */

/**
 * Get a cookie value by name
 * @param {string} name - The name of the cookie
 * @returns {string|null} - The cookie value or null if not found
 */
export function getCookie(name) {
  if (typeof window === 'undefined') {
    return null
  }

  const cookies = document.cookie.split(';')
  const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`))
  
  if (cookie) {
    const value = cookie.split('=')[1]
    return value ? decodeURIComponent(value).trim() : null
  }
  
  return null
}

/**
 * Set a cookie
 * @param {string} name - The name of the cookie
 * @param {string} value - The value of the cookie
 * @param {Object} options - Cookie options (path, expires, etc.)
 */
export function setCookie(name, value, options = {}) {
  if (typeof window === 'undefined') {
    return
  }

  let cookieString = `${name}=${encodeURIComponent(value)}`
  
  if (options.path) {
    cookieString += `; path=${options.path}`
  }
  
  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`
  }
  
  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`
  }
  
  if (options.domain) {
    cookieString += `; domain=${options.domain}`
  }
  
  if (options.secure) {
    cookieString += '; secure'
  }
  
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`
  }
  
  document.cookie = cookieString
}

/**
 * Remove a cookie
 * @param {string} name - The name of the cookie to remove
 * @param {Object} options - Cookie options (path, domain, etc.)
 */
export function removeCookie(name, options = {}) {
  setCookie(name, '', {
    ...options,
    expires: new Date(0)
  })
}

/**
 * Get authentication token from cookies
 * @returns {string|null} - The token or null if not found
 */
export function getAuthToken() {
  return getCookie('token')
}
