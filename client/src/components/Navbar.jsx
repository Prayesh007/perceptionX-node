import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, Vegan, LogOut, Search, Bell } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowUserMenu(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path) => {
    if (path === '/analytics') {
      return location.pathname.startsWith('/analytics')
    }
    return location.pathname === path
  }

  const isDetailPage = location.pathname.startsWith('/analytics/') && location.pathname !== '/analytics'

  return (
    <nav 
      className={`fixed z-50 transition-all duration-300 ${
        isDetailPage
          ? 'top-4 left-[calc(260px+(100%-260px)/2)] -translate-x-1/2 w-[calc(100%-260px-32px)]'
          : 'top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl'
      }`}
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0,0,0,0.03)'
      }}
    >
      <div className="px-5 lg:px-6">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-2.5 relative pl-2 ${isDetailPage ? "hidden" : ""}`}>
            <Vegan className="w-6 h-6" style={{ color: '#FF6B35' }} strokeWidth={1.5} />
            <span 
              className="text-[20px] font-bold"
              style={{
                color: '#1a1a1a',
                fontFamily: 'Inter, -apple-system, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              perception <span style={{ color: '#FF6B35' }}>X</span>
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-9 pr-8">
            <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
            <NavLink to="/detect" isActive={isActive('/detect')}>Detect</NavLink>
            <NavLink to="/live-detect" isActive={isActive('/live-detect')}>Live Detect</NavLink>
            <NavLink to="/analytics" isActive={isActive('/analytics')}>Analytics</NavLink>
            <NavLink to="/pricing" isActive={isActive('/pricing')}>Pricing</NavLink>
            <NavLink to="/documentation" isActive={isActive('/documentation')}>Docs</NavLink>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center pr-2">
            {/* Search Icon */}
            <button
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors mr-3"
              style={{ border: '1px solid #F0F0F0' }}
              aria-label="Search"
            >
              <Search size={16} strokeWidth={2.5} color="#1a1a1a" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative mr-6">
                  <button
                    className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                    style={{ border: '1px solid #F0F0F0' }}
                    aria-label="Notifications"
                  >
                    <Bell size={16} strokeWidth={2.5} color="#FF6B35" />
                  </button>
                  {/* Notification Badge on the corner of the button */}
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '16px',
                    height: '16px',
                    background: '#FF6B35',
                    borderRadius: '50%',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff',
                    boxSizing: 'content-box',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    3
                  </span>
                </div>

                {/* User Menu */}
                <div 
                  ref={userMenuRef}
                  className="relative flex items-center cursor-pointer"
                  onMouseEnter={() => {
                    if (closeTimeoutRef.current) {
                      clearTimeout(closeTimeoutRef.current)
                      closeTimeoutRef.current = null
                    }
                    setShowUserMenu(true)
                  }}
                  onMouseLeave={() => {
                    closeTimeoutRef.current = setTimeout(() => {
                      setShowUserMenu(false)
                    }, 150)
                  }}
                >
                  <div className="flex items-center gap-1.5 mr-3">
                    <span 
                      style={{
                        color: '#1a1a1a',
                        fontFamily: 'Inter, -apple-system, sans-serif',
                        fontSize: '13px',
                        fontWeight: 700
                      }}
                    >
                      {user?.username || 'Prayesh007'}
                    </span>
                    <ChevronDown size={14} strokeWidth={2.5} color="#666666" />
                  </div>
                  
                  {showUserMenu && (
                    <div 
                      className="absolute top-[120%] right-0 mt-2 w-48 rounded-xl shadow-lg py-2"
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                      }}
                      onMouseEnter={() => {
                        if (closeTimeoutRef.current) {
                          clearTimeout(closeTimeoutRef.current)
                          closeTimeoutRef.current = null
                        }
                        setShowUserMenu(true)
                      }}
                      onMouseLeave={() => {
                        closeTimeoutRef.current = setTimeout(() => {
                          setShowUserMenu(false)
                        }, 150)
                      }}
                    >
                      <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
                        <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{user?.username || 'Prayesh007'}</p>
                        <p className="text-xs" style={{ color: '#999999' }}>{user?.email || 'user@example.com'}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
                        style={{ color: '#1a1a1a' }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}

                  {/* Profile Avatar */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#FFF0EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF6B35',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    flexShrink: 0
                  }}>
                    {(user?.username || 'Prayesh007').charAt(0).toUpperCase()}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-[13px] font-bold transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                  style={{ color: '#1a1a1a', fontFamily: 'Inter, sans-serif' }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-[13px] font-bold transition-colors px-4 py-2 rounded-[10px]"
                  style={{
                    color: '#ffffff',
                    background: '#FF6B35',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 mr-2 rounded-lg hover:bg-gray-50"
            style={{ color: '#1a1a1a' }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="lg:hidden rounded-b-[16px]"
          style={{
            borderTop: '1px solid #f0f0f0',
            background: '#ffffff'
          }}
        >
          <div className="px-6 py-4 space-y-1">
            <MobileNavLink to="/" isActive={isActive('/')} onClick={toggleMenu}>Home</MobileNavLink>
            <MobileNavLink to="/detect" isActive={isActive('/detect')} onClick={toggleMenu}>Detect</MobileNavLink>
            <MobileNavLink to="/live-detect" isActive={isActive('/live-detect')} onClick={toggleMenu}>Live Detect</MobileNavLink>
            <MobileNavLink to="/analytics" isActive={isActive('/analytics')} onClick={toggleMenu}>Analytics</MobileNavLink>
            <MobileNavLink to="/pricing" isActive={isActive('/pricing')} onClick={toggleMenu}>Pricing</MobileNavLink>
            <MobileNavLink to="/documentation" isActive={isActive('/documentation')} onClick={toggleMenu}>Docs</MobileNavLink>
            <div className="border-t my-2" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }} />
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-bold" style={{ color: '#1a1a1a' }}>{user?.username || 'Prayesh007'}</p>
                  <p className="text-xs" style={{ color: '#999999' }}>{user?.email || 'user@example.com'}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-bold transition-colors"
                  style={{ color: '#1a1a1a' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" isActive={false} onClick={toggleMenu}>Log in</MobileNavLink>
                <MobileNavLink to="/signup" isActive={false} onClick={toggleMenu}>Sign up</MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

const NavLink = ({ to, isActive, children }) => {
  const handleClick = (e) => {
    if (to === '/documentation' && window.location.pathname === '/') {
      e.preventDefault()
      const developersSection = document.getElementById('developers')
      if (developersSection) {
        developersSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.history.pushState(null, '', '/#developers')
      } else {
        window.location.href = '/#developers'
      }
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="relative flex flex-col items-center group"
    >
      <span 
        className="font-bold transition-colors"
        style={{
          color: '#1a1a1a',
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.01em'
        }}
      >
        {children}
      </span>
      <span 
        className={`absolute -bottom-2.5 w-[20px] h-[2px] flex items-center justify-center transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
      >
        <span className="w-full h-full bg-[#FF6B35] rounded-full absolute" style={{ opacity: 0.4 }}></span>
        <span className="w-[4px] h-[4px] bg-[#FF6B35] rounded-full relative z-10"></span>
      </span>
    </Link>
  )
}

const MobileNavLink = ({ to, isActive, onClick, children }) => {
  const handleClick = (e) => {
    if (to === '/documentation' && window.location.pathname === '/') {
      e.preventDefault()
      if (onClick) onClick()
      const developersSection = document.getElementById('developers')
      if (developersSection) {
        developersSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.history.pushState(null, '', '/#developers')
      } else {
        window.location.href = '/#developers'
      }
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="block py-2.5 text-base font-bold transition-colors"
      style={{
        color: isActive ? '#FF6B35' : '#1a1a1a',
        fontFamily: 'Inter, -apple-system, sans-serif'
      }}
    >
      {children}
    </Link>
  )
}

export default Navbar