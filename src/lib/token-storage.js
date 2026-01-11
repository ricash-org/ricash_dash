export const tokenStorage = {
  getAccessToken: () => localStorage.getItem('token'),
  getRefreshToken: () => localStorage.getItem('refresh'),
  setTokens: (access, refresh) => {
    localStorage.setItem('token', access)
    localStorage.setItem('refresh', refresh)
  },
  clearTokens: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    localStorage.removeItem('ricash_user')
  }
}


