// Standalone toast functions (for use without provider)
let toastId = 0
const createStandaloneToast = () => {
  const showToast = (toast) => {
    const container = document.getElementById('toast-container') || (() => {
      const div = document.createElement('div')
      div.id = 'toast-container'
      div.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none'
      document.body.appendChild(div)
      return div
    })()

    const toastElement = document.createElement('div')
    toastElement.className = 'pointer-events-auto'
    
    const id = `standalone-toast-${++toastId}`
    toastElement.innerHTML = `
      <div class="flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md w-full bg-white">
        <div class="flex-1">
          <p class="text-sm">${toast.message}</p>
        </div>
        <button onclick="this.closest('[data-toast]').remove()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `
    toastElement.setAttribute('data-toast', id)
    
    container.appendChild(toastElement)
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        toastElement.remove()
      }, toast.duration || 5000)
    }
  }

  return {
    success: (message, options = {}) => showToast({ message, type: 'success', ...options }),
    error: (message, options = {}) => showToast({ message, type: 'error', ...options }),
    warning: (message, options = {}) => showToast({ message, type: 'warning', ...options }),
    info: (message, options = {}) => showToast({ message, type: 'info', ...options })
  }
}

export const toast = createStandaloneToast()
