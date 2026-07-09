import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home3D from '../components/Home3D'
import {
  Shield,
  BarChart3,
  CloudUpload,
  Package,
  Zap,
  Target,
  Code,
  FileText,
  Box,
  Github,
  ExternalLink,
  ScanLine,
  Check,
  Activity,
  Hexagon
} from 'lucide-react'
import * as simpleIcons from 'simple-icons'

const Home = () => {
  const technologiesRef = useRef(null)
  const capabilitiesRef = useRef(null)
  const developersRef = useRef(null)
  const yoloDocsRef = useRef(null)
  const pricingRef = useRef(null)
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTechnologiesVisible, setIsTechnologiesVisible] = useState(false)
  const [isCapabilitiesVisible, setIsCapabilitiesVisible] = useState(false)
  const [isDevelopersVisible, setIsDevelopersVisible] = useState(false)
  const [isYoloDocsVisible, setIsYoloDocsVisible] = useState(false)
  const [isPricingVisible, setIsPricingVisible] = useState(false)

  // Technologies with original brand icons
  const technologies = [
    { name: 'YOLOv11', iconKey: null, color: '#FF6B6B', path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' }, // Custom YOLO icon (layers/target)
    { name: 'Python', iconKey: 'siPython', color: `#${simpleIcons.siPython?.hex || '3776AB'}` },
    { name: 'FastAPI', iconKey: 'siFastapi', color: `#${simpleIcons.siFastapi?.hex || '009688'}` },
    { name: 'React', iconKey: 'siReact', color: `#${simpleIcons.siReact?.hex || '61DAFB'}` },
    { name: 'Node.js', iconKey: 'siNodedotjs', color: `#${simpleIcons.siNodedotjs?.hex || '339933'}` },
    { name: 'MongoDB', iconKey: 'siMongodb', color: `#${simpleIcons.siMongodb?.hex || '47A248'}` },
    { name: 'Three.js', iconKey: 'siThreedotjs', color: `#${simpleIcons.siThreedotjs?.hex || '000000'}` },
    { name: 'TensorFlow', iconKey: 'siTensorflow', color: `#${simpleIcons.siTensorflow?.hex || 'FF6F00'}` },
    { name: 'OpenCV', iconKey: 'siOpencv', color: `#${simpleIcons.siOpencv?.hex || '5C3EE8'}` },
    { name: 'Docker', iconKey: 'siDocker', color: `#${simpleIcons.siDocker?.hex || '2496ED'}` },
    { name: 'Cloudinary', iconKey: 'siCloudinary', color: `#${simpleIcons.siCloudinary?.hex || '3448C5'}` },
    { name: 'Socket.io', iconKey: 'siSocketdotio', color: `#${simpleIcons.siSocketdotio?.hex || '010101'}` }
  ]

  // Helper function to get icon data from simple-icons
  const getIconData = (iconKey) => {
    if (!iconKey) return null
    return simpleIcons[iconKey] || null
  }

  // Capabilities from the image
  const capabilities = [
    {
      icon: Zap,
      title: 'Real-Time Detection',
      description: 'Ultra-fast YOLOv11 inference optimized for sub-50ms performance at scale.'
    },
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'End-to-end encryption. SOC 2 compliant. Zero data retention by default.'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Visual dashboards with detection insights, trends, and object statistics.'
    },
    {
      icon: CloudUpload,
      title: 'Cloud & API Ready',
      description: 'Simple REST API with SDKs for Python, Node.js, and Go.'
    },
    {
      icon: Target,
      title: 'Custom Model Support',
      description: 'Upload and deploy your own trained YOLO models with one command.'
    },
    {
      icon: Package,
      title: 'Scalable Infrastructure',
      description: 'Auto-scaling from prototype to millions of requests per day.'
    }
  ]

  // Handle smooth scroll to developers section from URL hash
  useEffect(() => {
    if (location.hash === '#developers' && developersRef.current) {
      setTimeout(() => {
        developersRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }
  }, [location.hash])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const technologiesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsTechnologiesVisible(true)
        }
      })
    }, observerOptions)

    const capabilitiesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsCapabilitiesVisible(true)
        }
      })
    }, observerOptions)

    const developersObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsDevelopersVisible(true)
        }
      })
    }, observerOptions)

    const yoloDocsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsYoloDocsVisible(true)
        }
      })
    }, observerOptions)

    const pricingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsPricingVisible(true)
        }
      })
    }, observerOptions)

    if (technologiesRef.current) {
      technologiesObserver.observe(technologiesRef.current)
    }

    if (capabilitiesRef.current) {
      capabilitiesObserver.observe(capabilitiesRef.current)
    }

    if (developersRef.current) {
      developersObserver.observe(developersRef.current)
    }

    if (yoloDocsRef.current) {
      yoloDocsObserver.observe(yoloDocsRef.current)
    }

    if (pricingRef.current) {
      pricingObserver.observe(pricingRef.current)
    }

    return () => {
      if (technologiesRef.current) {
        technologiesObserver.unobserve(technologiesRef.current)
      }
      if (capabilitiesRef.current) {
        capabilitiesObserver.unobserve(capabilitiesRef.current)
      }
      if (developersRef.current) {
        developersObserver.unobserve(developersRef.current)
      }
      if (yoloDocsRef.current) {
        yoloDocsObserver.unobserve(yoloDocsRef.current)
      }
      if (pricingRef.current) {
        pricingObserver.unobserve(pricingRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div style={{ background: '#FAFAFA', width: '100%', paddingTop: '96px' }}>
        {/* Hero Section */}
        <div
          className="flex items-center relative overflow-hidden"
          style={{
            width: '100%',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem'
          }}
        >
          {/* Subtle Floating Dots */}
          <div className="absolute top-[20%] left-[45%] w-2 h-2 rounded-full bg-[#FF6B35] opacity-50 blur-[1px] pointer-events-none" />
          <div className="absolute top-[15%] left-[80%] w-1.5 h-1.5 rounded-full bg-[#3B82F6] opacity-40 blur-[1px] pointer-events-none" />
          <div className="absolute top-[60%] left-[95%] w-2 h-2 rounded-full bg-[#FF6B35] opacity-50 blur-[1px] pointer-events-none" />
          <div className="absolute bottom-[20%] left-[55%] w-1.5 h-1.5 rounded-full bg-[#3B82F6] opacity-40 blur-[1px] pointer-events-none" />
          <div className="absolute top-[35%] left-[5%] w-1.5 h-1.5 rounded-full bg-[#8B5CF6] opacity-30 blur-[1px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4 lg:gap-6 items-center">
              {/* Left Column - Main Content */}
              <div className="space-y-4 lg:space-y-5 flex flex-col justify-center relative z-10">
                {/* Badge */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#FF6B35]/10 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-[#FF6B35] text-[10px] font-extrabold tracking-[0.1em] uppercase">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/></svg>
                    AI Vision Platform
                  </span>
                </div>

                <h1
                  className="tracking-tight"
                  style={{
                    color: '#1a1a1a',
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: '76px',
                    lineHeight: 0.98,
                    letterSpacing: '-0.02em',
                    fontWeight: 700
                  }}
                >
                  See<br/>beyond the<br/>
                  <span style={{ 
                    background: 'linear-gradient(to right, #FF8A00, #FF6B35)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}>surface.</span>
                </h1>

                <p
                  className="text-base sm:text-[17px] leading-relaxed max-w-md"
                  style={{
                    color: '#666666',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    lineHeight: '1.6',
                    fontWeight: 500
                  }}
                >
                  Advanced perception intelligence that understands objects, context and spatial relationships from images and live video.
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <Link to="/detect" className="flex items-center gap-2 bg-[#1a1a1a] text-white px-7 py-4 rounded-[14px] font-bold text-[14px] transition-transform hover:scale-105">
                    <Box size={16} color="#FF6B35" />
                    Start Detection
                    <span className="ml-1 text-gray-400">→</span>
                  </Link>

                  <Link to="/demo" className="flex items-center gap-2 bg-white text-[#1a1a1a] border border-gray-200 px-7 py-4 rounded-[14px] font-bold text-[14px] shadow-sm transition-transform hover:scale-105 hover:bg-gray-50">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M10 8L16 12L10 16V8Z" fill="currentColor"/></svg>
                    Watch Demo
                  </Link>
                </div>
              </div>

              {/* Right Column - 3D Model */}
              <div className="hidden lg:flex items-center justify-center w-full relative" style={{ height: '280px' }}>
                <Home3D />
              </div>
            </div>
          </div>
        </div>

        {/* Stats + Metrics Section */}
        <section
          ref={technologiesRef}
          className="pb-4 pt-0"
          style={{
            opacity: isTechnologiesVisible ? 1 : 0,
            transform: isTechnologiesVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
              {/* Left Column - Stats + Compatible */}
              <div>
                {/* Stats Row */}
                <div className="flex items-center gap-6 lg:gap-8 mb-2">
                  {[
                    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>, value: '10M+', label: 'Objects Processed', color: '#FF6B35' },
                    { icon: <Target size={20} strokeWidth={2.5} />, value: '98.7%', label: 'Detection Accuracy', color: '#FF6B35' },
                    { icon: <Zap size={20} strokeWidth={2.5} />, value: '65 FPS', label: 'Realtime Speed', color: '#FF6B35' }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-3.5">
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: 'rgba(255, 107, 53, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FF6B35',
                        flexShrink: 0
                      }}>
                        {stat.icon}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: 800,
                          color: '#1a1a1a',
                          fontFamily: 'Inter, -apple-system, sans-serif',
                          lineHeight: 1.2,
                          letterSpacing: '-0.02em'
                        }}>
                          {stat.value}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#888888',
                          fontFamily: 'Inter, -apple-system, sans-serif',
                          fontWeight: 500,
                          marginTop: '2px'
                        }}>
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compatible With */}
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#888888',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    marginBottom: '14px',
                    fontWeight: 500
                  }}>
                    Compatible with
                  </p>
                  <div className="flex items-center gap-5 flex-nowrap overflow-x-auto pb-2">
                    {[
                      { name: 'YOLO', iconKey: null },
                      { name: 'OpenCV', iconKey: 'siOpencv' },
                      { name: 'PyTorch', iconKey: 'siPytorch' },
                      { name: 'TensorFlow', iconKey: 'siTensorflow' },
                      { name: 'ONNX', iconKey: 'siOnnx' },
                      { name: 'CUDA', iconKey: 'siNvidia' },
                      { name: 'TensorRT', iconKey: null }
                    ].map((tech, i) => {
                      const iconData = tech.iconKey ? simpleIcons[tech.iconKey] : null
                      return (
                        <div key={i} className="flex items-center gap-1.5 flex-shrink-0 bg-white border border-gray-100 rounded-[12px] px-3.5 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]" style={{ opacity: 0.9 }}>
                          {iconData ? (
                            <svg role="img" viewBox="0 0 24 24" width="14" height="14" fill="#1a1a1a" xmlns="http://www.w3.org/2000/svg">
                              <path d={iconData.path} />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="8" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
                              <circle cx="12" cy="12" r="3" fill="#1a1a1a"/>
                            </svg>
                          )}
                          <span style={{
                            fontSize: '12.5px',
                            color: '#1a1a1a',
                            fontFamily: 'Inter, -apple-system, sans-serif',
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}>
                            {tech.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column - Performance Metrics */}
              <div className="flex items-center justify-end w-full">
                <div 
                  className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center p-5 lg:p-6 w-full"
                >
                  <div className="grid grid-cols-4 gap-6 lg:gap-10 divide-x divide-gray-100 w-full">
                    {[
                      { icon: <Target size={18} strokeWidth={2.5}/>, value: '99.8%', label: 'Confidence', color: '#FF6B35' },
                      { icon: <Zap size={18} strokeWidth={2.5}/>, value: '16 ms', label: 'Latency', color: '#3B82F6' },
                      { icon: <Box size={18} strokeWidth={2.5}/>, value: '18', label: 'Objects Found', color: '#8B5CF6' },
                      { icon: <Activity size={18} strokeWidth={2.5}/>, value: '54 FPS', label: 'Processing Speed', color: '#10B981' }
                    ].map((metric, i) => (
                      <div key={i} className={`flex flex-col items-center ${i !== 0 ? 'pl-6 lg:pl-10' : ''}`}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: `${metric.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: metric.color,
                          marginBottom: '12px'
                        }}>
                          {metric.icon}
                        </div>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: 800,
                          color: '#1a1a1a',
                          fontFamily: 'Inter, -apple-system, sans-serif',
                          lineHeight: 1.2,
                          letterSpacing: '-0.02em',
                          marginBottom: '4px'
                        }}>
                          {metric.value}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#888888',
                          fontFamily: 'Inter, -apple-system, sans-serif',
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}>
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Powerful Capabilities Section */}
        <section
          ref={capabilitiesRef}
          className="pt-16 pb-20"
          style={{
            opacity: isCapabilitiesVisible ? 1 : 0,
            transform: isCapabilitiesVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s ease-out, transform 1s ease-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div 
              className="bg-white rounded-[32px] p-10 lg:p-12 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              <div className="grid lg:grid-cols-[1fr_2.5fr] gap-10 lg:gap-12 items-center">
                {/* Left side: Heading */}
                <div>
                  <span style={{
                    display: 'inline-flex',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 107, 53, 0.1)',
                    color: '#FF6B35',
                    fontSize: '10px',
                    fontWeight: 800,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    POWERFUL CAPABILITIES
                  </span>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                  }}>
                    Everything you need<br />for advanced vision AI
                  </h2>
                </div>

                {/* Right side: 4 horizontal cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      icon: <Box size={20} strokeWidth={2} />,
                      iconColor: '#FF6B35',
                      title: 'Object Detection',
                      description: 'Detect multiple objects in real-time with high precision.'
                    },
                    {
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
                      iconColor: '#3B82F6',
                      title: 'Live Video Analysis',
                      description: 'Real-time inference on live streams with ultra-low latency.'
                    },
                    {
                      icon: <Hexagon size={20} strokeWidth={2} />,
                      iconColor: '#8B5CF6',
                      title: 'Advanced Analytics',
                      description: 'Deep insights into visual data and performance metrics.'
                    },
                    {
                      icon: <Shield size={20} strokeWidth={2} />,
                      iconColor: '#10B981',
                      title: 'Enterprise Ready',
                      description: 'Scalable, secure and built for production environments.'
                    }
                  ].map((card, index) => (
                    <div
                      key={index}
                      className="bg-[#FAFAFA] rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col items-start transition-transform hover:-translate-y-1"
                    >
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `${card.iconColor}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: card.iconColor,
                        marginBottom: '20px'
                      }}>
                        {card.icon}
                      </div>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '8px',
                        letterSpacing: '-0.01em'
                      }}>
                        {card.title}
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: '#888888',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.6,
                        fontWeight: 500
                      }}>
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Built for Developers Section */}
        <section
          ref={developersRef}
          id="developers"
          className="py-10 lg:py-14 border-t border-gray-100"
          style={{
            background: '#ffffff',
            opacity: isDevelopersVisible ? 1 : 0,
            transform: isDevelopersVisible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'opacity 1s ease-out, transform 1s ease-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-5">
                <div>
                  <p
                    className="text-sm uppercase tracking-wider mb-4"
                    style={{
                      color: '#666666',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: 600,
                      letterSpacing: '0.1em'
                    }}
                  >
                    FOR DEVELOPERS
                  </p>
                  <h2
                    className="text-4xl lg:text-5xl font-semibold mb-6"
                    style={{
                      color: 'rgb(23, 23, 23)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Built for Developers
                  </h2>
                  <p
                    className="text-lg leading-relaxed mb-6"
                    style={{
                      color: '#666666',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      lineHeight: '1.7'
                    }}
                  >
                    Simple REST API powered by YOLOv11 to detect objects in images and videos. Integrate real-time object detection into your applications in minutes — not weeks.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 mt-1"
                      style={{
                        color: '#8A2BE2'
                      }}
                    >
                      <Code size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{
                          color: 'rgb(23, 23, 23)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        YOLOv11 REST API with real-time detection
                      </h3>
                      <p
                        className="text-base"
                        style={{
                          color: '#666666',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        Upload images or videos and get instant object detection results with bounding boxes, confidence scores, and class labels.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 mt-1"
                      style={{
                        color: '#8A2BE2'
                      }}
                    >
                      <FileText size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{
                          color: 'rgb(23, 23, 23)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        Comprehensive analytics & tracking
                      </h3>
                      <p
                        className="text-base"
                        style={{
                          color: '#666666',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        Get detailed detection events, object tracking, temporal trends, and traffic analytics for videos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 mt-1"
                      style={{
                        color: '#8A2BE2'
                      }}
                    >
                      <Box size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{
                          color: 'rgb(23, 23, 23)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        Built with FastAPI, Node.js & MongoDB
                      </h3>
                      <p
                        className="text-base"
                        style={{
                          color: '#666666',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        Production-ready stack with async processing, cloud storage, and scalable architecture.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Code Example */}
              <div className="relative">
                <div
                  className="rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    background: '#1e1e1e',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Code Header */}
                  <div
                    className="flex items-center gap-2 px-4 py-3"
                    style={{
                      background: '#252526',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }}></div>
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }}></div>
                      <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }}></div>
                    </div>
                    <span
                      className="text-xs ml-2"
                      style={{
                        color: '#858585',
                        fontFamily: 'Monaco, "Courier New", monospace'
                      }}
                    >
                      api-example.sh
                    </span>
                  </div>

                  {/* Code Content */}
                  <div className="p-6">
                    <pre
                      className="text-sm leading-relaxed overflow-x-auto"
                      style={{
                        color: '#d4d4d4',
                        fontFamily: 'Monaco, "Courier New", monospace',
                        margin: 0
                      }}
                    >
                      <code>
                        <span style={{ color: '#569cd6' }}>POST</span>{' '}
                        <span style={{ color: '#ce9178' }}>/detect</span>
                        {'\n\n'}
                        <span style={{ color: '#d4d4d4' }}>$ curl -X POST \</span>
                        {'\n'}
                        <span style={{ color: '#ce9178' }}>  http://localhost:3000/detect \</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>  -F </span>
                        <span style={{ color: '#ce9178' }}>"file=@traffic_video.mp4"</span>
                        {'\n\n'}
                        <span style={{ color: '#808080' }}>// Response:</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>{'{'}</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>  </span>
                        <span style={{ color: '#ce9178' }}>"fileId"</span>
                        <span style={{ color: '#d4d4d4' }}>: </span>
                        <span style={{ color: '#ce9178' }}>"507f1f77bcf86cd799439011"</span>
                        <span style={{ color: '#d4d4d4' }}>,</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>  </span>
                        <span style={{ color: '#ce9178' }}>"status"</span>
                        <span style={{ color: '#d4d4d4' }}>: </span>
                        <span style={{ color: '#ce9178' }}>"processing"</span>
                        <span style={{ color: '#d4d4d4' }}>,</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>  </span>
                        <span style={{ color: '#ce9178' }}>"detectedObjects"</span>
                        <span style={{ color: '#d4d4d4' }}>: [</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>    {'{'}</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>      </span>
                        <span style={{ color: '#ce9178' }}>"class"</span>
                        <span style={{ color: '#d4d4d4' }}>: </span>
                        <span style={{ color: '#ce9178' }}>"car"</span>
                        <span style={{ color: '#d4d4d4' }}>,</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>      </span>
                        <span style={{ color: '#ce9178' }}>"confidence"</span>
                        <span style={{ color: '#d4d4d4' }}>: </span>
                        <span style={{ color: '#b5cea8' }}>0.94</span>
                        <span style={{ color: '#d4d4d4' }}>,</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>      </span>
                        <span style={{ color: '#ce9178' }}>"bbox"</span>
                        <span style={{ color: '#d4d4d4' }}>: {'{'}</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>        </span>
                        <span style={{ color: '#ce9178' }}>"x1"</span>
                        <span style={{ color: '#d4d4d4' }}>: </span>
                        <span style={{ color: '#b5cea8' }}>120</span>
                        <span style={{ color: '#d4d4d4' }}>, </span>
                        <span style={{ color: '#ce9178' }}>"y1"</span>
                        <span style={{ color: '#d4d4d4' }}>: </span>
                        <span style={{ color: '#b5cea8' }}>45</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>        </span>
                        <span style={{ color: '#ce9178' }}>"x2"</span>
                        <span style={{ color: '#d4d4d4' }}>: </span>
                        <span style={{ color: '#b5cea8' }}>380</span>
                        <span style={{ color: '#d4d4d4' }}>, </span>
                        <span style={{ color: '#ce9178' }}>"y2"</span>
                        <span style={{ color: '#d4d4d4' }}>: </span>
                        <span style={{ color: '#b5cea8' }}>520</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>      {'}'}</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>    {'}'}</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>  ]</span>
                        {'\n'}
                        <span style={{ color: '#d4d4d4' }}>{'}'}</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* YOLOv11 Documentation Section */}
        <section
          ref={yoloDocsRef}
          id="yolo-docs"
          className="py-10 lg:py-14 border-t border-gray-100"
          style={{
            background: '#ffffff',
            opacity: isYoloDocsVisible ? 1 : 0,
            transform: isYoloDocsVisible ? 'translateY(0)' : 'translateY(60px)',
            transition: 'opacity 1.1s ease-out, transform 1.1s ease-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            {/* Images and Video Side-by-Side */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-10 items-stretch">
              {/* Left: Image Gallery */}
              <div className="h-full flex flex-col">
                <h3
                  className="text-3xl lg:text-4xl font-semibold mb-3"
                  style={{
                    color: 'rgb(23, 23, 23)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  Real-World Detection Results
                </h3>
                <p
                  className="text-base mb-6"
                  style={{
                    color: '#666666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    lineHeight: '1.6'
                  }}
                >
                  Real-world detection results across diverse scenarios.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {/* Image 1 — Traffic detection with bounding boxes */}
                  <div
                    className="flex flex-col"
                    style={{
                      opacity: isYoloDocsVisible ? 1 : 0,
                      transform: isYoloDocsVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s'
                    }}
                  >
                    <div className="relative rounded-xl overflow-hidden group shadow-lg mb-3" style={{ height: '240px' }}>
                      <img
                        src="/assets/image (2).png"
                        alt="YOLOv11 traffic detection with bounding boxes showing cars, bus, and pedestrians"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-1"
                        style={{
                          color: '#8A2BE2',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          letterSpacing: '0.15em'
                        }}
                      >
                        DETECTION
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: '#666666',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        Multi-class analysis
                      </p>
                    </div>
                  </div>

                  {/* Image 2 — Pose estimation skeleton */}
                  <div
                    className="flex flex-col"
                    style={{
                      opacity: isYoloDocsVisible ? 1 : 0,
                      transform: isYoloDocsVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s'
                    }}
                  >
                    <div className="relative rounded-xl overflow-hidden group shadow-lg mb-3" style={{ height: '240px', background: '#000000' }}>
                      <img
                        src="/assets/image.png"
                        alt="YOLOv11 pose estimation with blue skeleton and keypoint markers"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-1"
                        style={{
                          color: '#10b981',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          letterSpacing: '0.15em'
                        }}
                      >
                        POSE
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: '#666666',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        Keypoint detection
                      </p>
                    </div>
                  </div>

                  {/* Image 3 — Table segmentation */}
                  <div
                    className="flex flex-col"
                    style={{
                      opacity: isYoloDocsVisible ? 1 : 0,
                      transform: isYoloDocsVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s'
                    }}
                  >
                    <div className="relative rounded-xl overflow-hidden group shadow-lg mb-3" style={{ height: '240px' }}>
                      <img
                        src="/assets/image (1).png"
                        alt="YOLOv11 instance segmentation on dining table with plates"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-1"
                        style={{
                          color: '#8A2BE2',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          letterSpacing: '0.15em'
                        }}
                      >
                        SEGMENTATION
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: '#666666',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        Real-time output
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <a
                    href="https://github.com/ultralytics/ultralytics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 w-full"
                    style={{
                      background: 'linear-gradient(135deg, rgb(23, 23, 23), #2f2f2f)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      letterSpacing: '0.01em',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <Github size={18} />
                    View Ultralytics on GitHub
                    <ExternalLink size={15} style={{ opacity: 0.8 }} />
                  </a>
                  <a
                    href="https://docs.ultralytics.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 w-full"
                    style={{
                      background: '#fafafa',
                      color: 'rgb(23, 23, 23)',
                      textDecoration: 'none',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      letterSpacing: '0.01em',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <FileText size={18} />
                    Read Documentation
                    <ExternalLink size={15} style={{ opacity: 0.6 }} />
                  </a>
                </div>
              </div>

              {/* Right: Video Placeholder */}
              <div className="h-full flex flex-col">
                <h3
                  className="text-3xl lg:text-4xl font-semibold mb-3"
                  style={{
                    color: 'rgb(23, 23, 23)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  Live Video Inference
                </h3>
                <p
                  className="text-base mb-6"
                  style={{
                    color: '#666666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    lineHeight: '1.6'
                  }}
                >
                  See real-time inference on video streams.
                </p>
                <div
                  className="relative rounded-xl overflow-hidden shadow-lg flex-1"
                  style={{
                    minHeight: '400px',
                    opacity: isYoloDocsVisible ? 1 : 0,
                    transition: 'opacity 0.9s ease-out 0.4s'
                  }}
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-xl"
                    style={{ minHeight: '400px' }}
                  >
                    <source src="/assets/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Code Block and Resources Side-by-Side */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
              {/* Left: Quick-start Code Block */}
              <div className="h-full flex flex-col">
                <h3
                  className="text-3xl lg:text-4xl font-semibold mb-3"
                  style={{
                    color: 'rgb(23, 23, 23)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  Quick Start
                </h3>
                <p
                  className="text-base mb-5"
                  style={{
                    color: '#666666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    lineHeight: '1.6'
                  }}
                >
                  Get started with YOLOv11 in just a few lines of code.
                </p>
                <div
                  className="rounded-xl overflow-hidden shadow-lg flex-1"
                  style={{
                    background: '#1e1e1e',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    opacity: isYoloDocsVisible ? 1 : 0,
                    transition: 'opacity 0.9s ease-out 0.5s'
                  }}
                >
                  <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{ background: '#252526', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                      </div>
                      <span className="text-xs" style={{ color: '#858585', fontFamily: 'Monaco, "Courier New", monospace' }}>
                        quickstart.py
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(138,43,226,0.2)', color: '#c084fc', fontFamily: 'Monaco, "Courier New", monospace' }}>
                      Python
                    </span>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm leading-loose" style={{ color: '#d4d4d4', fontFamily: 'Monaco, "Courier New", monospace', margin: 0 }}>
                      <code>
                        <span style={{ color: '#569cd6' }}>from</span>
                        <span style={{ color: '#d4d4d4' }}> ultralytics </span>
                        <span style={{ color: '#569cd6' }}>import</span>
                        <span style={{ color: '#d4d4d4' }}> YOLO{'\n\n'}</span>
                        <span style={{ color: '#6a9955' }}># Load YOLOv11 model</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>model</span>
                        <span style={{ color: '#d4d4d4' }}> = YOLO(</span>
                        <span style={{ color: '#ce9178' }}>"yolo11n.pt"</span>
                        <span style={{ color: '#d4d4d4' }}>){'\n\n'}</span>
                        <span style={{ color: '#6a9955' }}># Run inference</span>
                        {'\n'}
                        <span style={{ color: '#9cdcfe' }}>results</span>
                        <span style={{ color: '#d4d4d4' }}> = model(</span>
                        <span style={{ color: '#ce9178' }}>"traffic_video.mp4"</span>
                        <span style={{ color: '#d4d4d4' }}>){'\n\n'}</span>
                        <span style={{ color: '#569cd6' }}>for</span>
                        <span style={{ color: '#d4d4d4' }}> result </span>
                        <span style={{ color: '#569cd6' }}>in</span>
                        <span style={{ color: '#d4d4d4' }}> results:{'\n'}</span>
                        <span style={{ color: '#d4d4d4' }}>    boxes = result.boxes{'\n'}</span>
                        <span style={{ color: '#d4d4d4' }}>    </span>
                        <span style={{ color: '#dcdcaa' }}>print</span>
                        <span style={{ color: '#d4d4d4' }}>(</span>
                        <span style={{ color: '#ce9178' }}>"Detected:"</span>
                        <span style={{ color: '#d4d4d4' }}>, boxes.cls)</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Right: Resources */}
              <div className="h-full flex flex-col">
                <h3
                  className="text-3xl lg:text-4xl font-semibold mb-3"
                  style={{
                    color: 'rgb(23, 23, 23)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  Resources
                </h3>
                <p
                  className="text-base mb-5"
                  style={{
                    color: '#666666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    lineHeight: '1.6'
                  }}
                >
                  Explore the full Ultralytics documentation, models, and pre-trained weights on GitHub.
                </p>
                {/* Model Variants Table */}
                <div className="flex-1 flex flex-col">
                  <h4
                    className="text-lg font-semibold mb-3"
                    style={{
                      color: 'rgb(23, 23, 23)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    Model Variants
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-gray-200 flex-1">
                    <table className="w-full h-full" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                          <th
                            className="text-left py-3 px-4 text-sm font-semibold"
                            style={{
                              color: 'rgb(23, 23, 23)',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                            }}
                          >
                            Model
                          </th>
                          <th
                            className="text-left py-3 px-4 text-sm font-semibold"
                            style={{
                              color: 'rgb(23, 23, 23)',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                            }}
                          >
                            Params
                          </th>
                          <th
                            className="text-left py-3 px-4 text-sm font-semibold"
                            style={{
                              color: 'rgb(23, 23, 23)',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                            }}
                          >
                            mAP
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { model: 'YOLOv11n', params: '2.6M', map: '39.5' },
                          { model: 'YOLOv11s', params: '9.4M', map: '47.0' },
                          { model: 'YOLOv11m', params: '20.1M', map: '51.5' }
                        ].map((row, i) => (
                          <tr
                            key={i}
                            style={{
                              borderBottom: i < 2 ? '1px solid #e5e7eb' : 'none',
                              background: i % 2 === 0 ? '#ffffff' : '#f9fafb'
                            }}
                          >
                            <td
                              className="py-3 px-4 text-sm font-medium"
                              style={{
                                color: 'rgb(23, 23, 23)',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                              }}
                            >
                              {row.model}
                            </td>
                            <td
                              className="py-3 px-4 text-sm"
                              style={{
                                color: '#666666',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                              }}
                            >
                              {row.params}
                            </td>
                            <td
                              className="py-3 px-4 text-sm font-semibold"
                              style={{
                                color: '#8A2BE2',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                              }}
                            >
                              {row.map}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Pricing Section */}
        <section
          ref={pricingRef}
          id="pricing"
          className="py-10 lg:py-14 border-t border-gray-100"
          style={{
            background: '#ffffff',
            opacity: isPricingVisible ? 1 : 0,
            transform: isPricingVisible ? 'translateY(0)' : 'translateY(60px)',
            transition: 'opacity 1s ease-out, transform 1s ease-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8">
              <p
                className="text-sm uppercase tracking-wider mb-4"
                style={{
                  color: '#9ca3af',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.1em'
                }}
              >
                PRICING
              </p>
              <h2
                className="text-4xl lg:text-5xl font-semibold mb-4"
                style={{
                  color: 'rgb(23, 23, 23)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em'
                }}
              >
                Simple, Transparent Pricing
              </h2>
              <p
                className="text-base lg:text-lg"
                style={{
                  color: '#9ca3af',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  lineHeight: '1.6'
                }}
              >
                Start free. Scale as you grow.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {/* Starter Plan */}
              <div
                className="relative rounded-2xl border border-gray-200 p-8 flex flex-col"
                style={{
                  background: '#ffffff',
                  opacity: isPricingVisible ? 1 : 0,
                  transform: isPricingVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s'
                }}
              >
                <div className="flex-1">
                  <h3
                    className="text-2xl font-semibold mb-2"
                    style={{
                      color: 'rgb(23, 23, 23)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    Starter
                  </h3>
                  <div className="mb-4">
                    <span
                      className="text-5xl font-bold"
                      style={{
                        color: 'rgb(23, 23, 23)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}
                    >
                      Free
                    </span>
                  </div>
                  <p
                    className="text-sm mb-8"
                    style={{
                      color: '#9ca3af',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    For personal projects and testing.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      '100 detections/month',
                      'REST API access',
                      'Community support'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check
                          size={20}
                          style={{
                            color: '#10b981',
                            marginTop: '2px',
                            flexShrink: 0
                          }}
                        />
                        <span
                          className="text-sm"
                          style={{
                            color: '#666666',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: '#ffffff',
                    color: 'rgb(23, 23, 23)',
                    border: '2px solid #e5e7eb',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  Get Started
                </button>
              </div>

              {/* Pro Plan - Most Popular */}
              <div
                className="relative rounded-2xl border-2 border-gray-900 p-8 flex flex-col shadow-xl"
                style={{
                  background: '#ffffff',
                  opacity: isPricingVisible ? 1 : 0,
                  transform: isPricingVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s'
                }}
              >
                {/* Most Popular Badge */}
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: '#000000',
                    color: '#ffffff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  Most Popular
                </div>
                <div className="flex-1">
                  <h3
                    className="text-2xl font-semibold mb-2"
                    style={{
                      color: 'rgb(23, 23, 23)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    Pro
                  </h3>
                  <div className="mb-4">
                    <span
                      className="text-5xl font-bold"
                      style={{
                        color: 'rgb(23, 23, 23)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}
                    >
                      $49
                    </span>
                    <span
                      className="text-lg ml-2"
                      style={{
                        color: '#9ca3af',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}
                    >
                      /mo
                    </span>
                  </div>
                  <p
                    className="text-sm mb-8"
                    style={{
                      color: '#9ca3af',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    For growing teams and products.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      '10,000 detections/month',
                      'Custom models',
                      'Priority support',
                      'Analytics dashboard'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check
                          size={20}
                          style={{
                            color: '#10b981',
                            marginTop: '2px',
                            flexShrink: 0
                          }}
                        />
                        <span
                          className="text-sm"
                          style={{
                            color: '#666666',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: '#000000',
                    color: '#ffffff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  Get Started
                </button>
              </div>

              {/* Enterprise Plan */}
              <div
                className="relative rounded-2xl border border-gray-200 p-8 flex flex-col"
                style={{
                  background: '#ffffff',
                  opacity: isPricingVisible ? 1 : 0,
                  transform: isPricingVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s'
                }}
              >
                <div className="flex-1">
                  <h3
                    className="text-2xl font-semibold mb-2"
                    style={{
                      color: 'rgb(23, 23, 23)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    Enterprise
                  </h3>
                  <div className="mb-4">
                    <span
                      className="text-5xl font-bold"
                      style={{
                        color: 'rgb(23, 23, 23)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}
                    >
                      Custom
                    </span>
                  </div>
                  <p
                    className="text-sm mb-8"
                    style={{
                      color: '#9ca3af',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    For large-scale deployments.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      'Unlimited detections',
                      'Dedicated infrastructure',
                      'SLA & compliance',
                      '24/7 support'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check
                          size={20}
                          style={{
                            color: '#10b981',
                            marginTop: '2px',
                            flexShrink: 0
                          }}
                        />
                        <span
                          className="text-sm"
                          style={{
                            color: '#666666',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: '#ffffff',
                    color: 'rgb(23, 23, 23)',
                    border: '2px solid #e5e7eb',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Home
