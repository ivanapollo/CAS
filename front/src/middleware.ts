import { NextRequest, NextResponse } from 'next/server'

const loginPath = "/"
const studentPath = "/calendar"
const attendancePath = "/attendance"
const adminPath = "/admin"

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const role = req.cookies.get('role')?.value

  switch (role) {
    case "student": {
      if (path.startsWith(studentPath))
        return NextResponse.next()
      return NextResponse.redirect(new URL(studentPath, req.nextUrl))  
    }
    case "teacher": {
      if (path.startsWith(attendancePath))
        return NextResponse.next()
      return NextResponse.redirect(new URL(attendancePath, req.nextUrl))  
    }
    case "admin": {
      // Временное перенаправление
      if (path.startsWith(attendancePath))
        return NextResponse.redirect(new URL(adminPath + "/headmen", req.nextUrl))  
      if (path.startsWith(adminPath))
        return NextResponse.next()
      return NextResponse.redirect(new URL(attendancePath, req.nextUrl))  
    }
    default: {
      if (path === loginPath)
        return NextResponse.next()
      return NextResponse.redirect(new URL(loginPath, req.nextUrl))
    }
  }
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
