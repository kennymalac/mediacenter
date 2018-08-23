export const API_URL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? "http://localhost:8000" : "h"
export const UPLOAD_API_URL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? "http://localhost:4242" : "https://cdn.flatlanders.net"
