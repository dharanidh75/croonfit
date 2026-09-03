import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Card, CardHeader, CardContent } from '../../components/admin/ui/Card'
import { Layout, Image as ImageIcon, Type, Globe, ArrowLeft, Upload, Play, Image as LucideImage, Maximize2, Minimize2 } from 'lucide-react'

function ColorInput({ label, value, onChange }) {
  return (
    <div className="flex-1">
      <label className="block text-xs font-semibold text-[#666666] mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded border border-[#E5E5E5] overflow-hidden flex-shrink-0">
          <input 
            type="color" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-0 border-0 cursor-pointer"
          />
        </div>
        <input 
          type="text" 
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 h-8 px-2 bg-white border border-[#E5E5E5] rounded text-xs font-mono focus:border-[#111111] outline-none uppercase"
        />
      </div>
    </div>
  )
}

function HeroBannerEditor({ onBack }) {
  const [mediaType, setMediaType] = useState('video') // 'video' or 'image'
  const [mediaUrl, setMediaUrl] = useState(null)
  const fileInputRef = useRef(null)
  
  // Heading
  const [headingText, setHeadingText] = useState("CRAFTED FOR\nEVERY LIFESTYLE.")
  const [headingColor, setHeadingColor] = useState('#FFFFFF')
  
  // Button
  const [buttonText, setButtonText] = useState('EXPLORE COLLECTION')
  const [buttonTextColor, setButtonTextColor] = useState('#000000')
  const [buttonBgColor, setButtonBgColor] = useState('#FFFFFF')
  const [route, setRoute] = useState('/collections')

  // Scroll Text
  const [scrollText, setScrollText] = useState('SCROLL TO DISCOVER')
  const [scrollTextColor, setScrollTextColor] = useState('#FFFFFF')

  // Preview Mode
  const [isFullView, setIsFullView] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setMediaUrl(url)
    }
  }

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Common Preview Content
  const renderPreviewOverlay = () => (
    <>
      {/* Background Media */}
      <div className="absolute inset-0 opacity-50 bg-black pointer-events-none">
        {mediaUrl ? (
          mediaType === 'video' ? (
            <video src={mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={mediaUrl} alt="Hero Background" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-900 to-black"></div>
        )}
      </div>

      {/* Overlay Elements */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
        <h2 
          className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-extrabold tracking-tighter leading-[1.1] mb-8 whitespace-pre-line"
          style={{ color: headingColor }}
        >
          {headingText}
        </h2>
        
        <button 
          className="px-8 py-3.5 text-xs sm:text-sm font-bold tracking-widest transition-colors shadow-lg pointer-events-auto"
          style={{ backgroundColor: buttonBgColor, color: buttonTextColor, borderRadius: '2px' }}
        >
          {buttonText || 'EXPLORE COLLECTION'}
        </button>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <span className="text-[10px] tracking-[0.2em] opacity-80" style={{ color: scrollTextColor }}>
            {scrollText}
          </span>
        </div>
      </div>
      
      {/* Mock Header overlay just for effect */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center opacity-50 z-10 pointer-events-none">
        <div className="flex gap-4">
          <div className="w-8 h-1 bg-white/50 rounded-full"></div>
          <div className="w-12 h-1 bg-white/50 rounded-full"></div>
        </div>
        <div className="w-20 h-4 bg-white/70 rounded-sm"></div>
        <div className="flex gap-3">
          <div className="w-4 h-4 rounded-full bg-white/50"></div>
          <div className="w-4 h-4 rounded-full bg-white/50"></div>
        </div>
      </div>
    </>
  )

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#666666] hover:text-[#111111] hover:border-[#111111] transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Edit Hero Banner</h1>
          <p className="text-sm text-[#666666] mt-1">Customize the media, text, and links for your storefront's main banner.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Controls (Hidden in Full View mode to maximize space if we wanted, but we'll just show it in a modal) */}
        <div className={`space-y-6 ${isFullView ? 'opacity-50 pointer-events-none' : ''}`}>
          <Card>
            <CardHeader title="Media Settings" />
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-3">Media Type</label>
                <div className="flex bg-[#F5F5F5] p-1 rounded-lg">
                  <button 
                    onClick={() => {
                      setMediaType('video')
                      setMediaUrl(null)
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 h-9 text-sm font-medium rounded-md transition-all ${mediaType === 'video' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#666666] hover:text-[#111111]'}`}
                  >
                    <Play className="w-4 h-4" /> Video
                  </button>
                  <button 
                    onClick={() => {
                      setMediaType('image')
                      setMediaUrl(null)
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 h-9 text-sm font-medium rounded-md transition-all ${mediaType === 'image' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#666666] hover:text-[#111111]'}`}
                  >
                    <LucideImage className="w-4 h-4" /> Image
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Upload {mediaType === 'video' ? 'Video' : 'Image'}</label>
                <input 
                  type="file" 
                  accept={mediaType === 'video' ? 'video/webm,video/mp4' : 'image/webp,image/png,image/jpeg'} 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <div 
                  onClick={triggerUpload}
                  className="w-full h-32 border-2 border-dashed border-[#E5E5E5] rounded-xl bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-[#888888] mb-2" />
                  <p className="text-sm font-medium text-[#111111]">
                    {mediaUrl ? 'File Selected! Click to replace' : 'Click to upload'}
                  </p>
                  <p className="text-xs text-[#888888] mt-1">Supports {mediaType === 'video' ? '.webm, .mp4' : '.webp, .png, .jpg'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Heading Content" />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Heading Text</label>
                <textarea 
                  value={headingText}
                  onChange={(e) => setHeadingText(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none resize-y"
                />
              </div>
              <ColorInput label="Heading Color" value={headingColor} onChange={setHeadingColor} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Button Content" />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Button Text</label>
                <input 
                  type="text" 
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                />
              </div>
              
              <div className="flex gap-4">
                <ColorInput label="Button Background" value={buttonBgColor} onChange={setButtonBgColor} />
                <ColorInput label="Button Text Color" value={buttonTextColor} onChange={setButtonTextColor} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2 mt-2">Navigate Route</label>
                <input 
                  type="text" 
                  list="routes-list"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  placeholder="e.g. /collections"
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm font-mono focus:border-[#111111] outline-none"
                />
                <datalist id="routes-list">
                  <option value="/retail" />
                  <option value="/wholesale" />
                  <option value="/category/mens" />
                  <option value="/category/womens" />
                  <option value="/category/kids" />
                  <option value="/about" />
                </datalist>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Bottom Text (Scroll Indicator)" />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Scroll Text</label>
                <input 
                  type="text" 
                  value={scrollText}
                  onChange={(e) => setScrollText(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                />
              </div>
              <ColorInput label="Scroll Text Color" value={scrollTextColor} onChange={setScrollTextColor} />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pb-8">
            <button 
              onClick={() => {
                toast('Changes discarded', { icon: 'ℹ️' })
                onBack()
              }} 
              className="px-5 py-2.5 text-sm font-medium text-[#666666] hover:text-[#111111]"
            >
              Discard Changes
            </button>
            <button 
              onClick={() => {
                toast.success('Hero Banner updated successfully!')
                onBack()
              }}
              className="px-6 py-2.5 bg-[#111111] text-white text-sm font-bold rounded-lg hover:bg-black transition-colors shadow-md"
            >
              Save & Publish
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="lg:sticky lg:top-8 h-fit z-10 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#888888] uppercase tracking-widest">Live Preview</h3>
            <button 
              onClick={() => setIsFullView(true)}
              className="flex items-center gap-2 text-xs font-bold text-[#111111] bg-white border border-[#E5E5E5] px-3 py-1.5 rounded-full hover:bg-[#F5F5F5] transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Full View (16:9)
            </button>
          </div>
          
          <div className="w-full aspect-[4/5] sm:aspect-video lg:aspect-[3/4] rounded-2xl shadow-xl border border-[#E5E5E5] bg-[#222222] overflow-hidden relative">
            <div className="w-full h-full relative">
              {renderPreviewOverlay()}
            </div>
          </div>
        </div>
      </div>

      {/* FULL VIEW PORTAL (Escapes stacking contexts) */}
      {isFullView && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsFullView(false)}
          />
          
          {/* 16:9 Container */}
          <div className="w-full max-w-[1600px] aspect-video bg-black relative overflow-hidden shadow-2xl rounded-2xl border border-white/10 z-10 animate-fade-in-up">
            {renderPreviewOverlay()}
            
            {/* Close button */}
            <button 
              onClick={() => setIsFullView(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors z-50 shadow-lg"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}


function AboutUsEditor({ onBack }) {
  const [activeTab, setActiveTab] = useState('heritage')

  // Heritage Section
  const [heritageHeading, setHeritageHeading] = useState('Redefining premium\napparel through\nuncompromising\nquality.')
  const [heritageDesc, setHeritageDesc] = useState('Founded on the belief that clothing should be both a statement and a sanctuary, Croonfit blends editorial fashion with everyday wearability. We design for the modern individual who refuses to compromise on quality.')
  
  // Factory Section
  const [factoryHeading, setFactoryHeading] = useState('Where craft meets precision.')
  const [qualityHeading, setQualityHeading] = useState('Obsessive detail.')

  // Mission & Vision
  const [missionText, setMissionText] = useState('To engineer apparel that empowers individuals, setting a new global standard for how premium clothing is manufactured, sourced, and worn.')
  const [visionText, setVisionText] = useState('A world where high-end fashion is accessible, sustainable, and built to endure the rigors of every lifestyle and generation.')

  // Stats
  const [stats, setStats] = useState([
    { label: 'YEARS EXPERIENCE', value: '10+' },
    { label: 'GLOBAL RETAILERS', value: '500+' },
    { label: 'GARMENTS PRODUCED', value: '1M+' },
    { label: 'CITIES REACHED', value: '50+' },
  ])

  // Images
  const fileInputRef = useRef(null)
  const [uploadTarget, setUploadTarget] = useState(null)
  const [images, setImages] = useState({
    heritage1: null,
    heritage2: null,
    factory: null,
    quality: null
  })

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && uploadTarget) {
      const url = URL.createObjectURL(file)
      setImages(prev => ({ ...prev, [uploadTarget]: url }))
      setUploadTarget(null)
    }
  }

  const triggerUpload = (target) => {
    setUploadTarget(target)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const ImageUploaderBox = ({ targetKey, label, className = "h-40" }) => (
    <div>
      <label className="block text-sm font-semibold text-[#111111] mb-2">{label}</label>
      <div 
        onClick={() => triggerUpload(targetKey)}
        className={`w-full ${className} border-2 border-dashed border-[#E5E5E5] rounded-xl overflow-hidden bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors flex flex-col items-center justify-center cursor-pointer relative group`}
      >
        {images[targetKey] ? (
          <>
            <img src={images[targetKey]} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-bold tracking-widest uppercase">Change</span>
            </div>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-[#888888] mb-2" />
            <p className="text-sm font-medium text-[#111111]">Upload Image</p>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in-up pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#666666] hover:text-[#111111] hover:border-[#111111] transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Edit About Us Page</h1>
          <p className="text-sm text-[#666666] mt-1">Manage the story, images, and statistics shown on your About page.</p>
        </div>
      </div>

      <input 
        type="file" 
        accept="image/webp,image/png,image/jpeg" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-[#E5E5E5] mb-8">
        {['heritage', 'media', 'mission', 'stats'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-[#111111] text-[#111111]' 
                : 'border-transparent text-[#888888] hover:text-[#111111]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        {activeTab === 'heritage' && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Heritage Content" />
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Main Heading</label>
                  <textarea 
                    value={heritageHeading}
                    onChange={(e) => setHeritageHeading(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Description</label>
                  <textarea 
                    value={heritageDesc}
                    onChange={(e) => setHeritageDesc(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none resize-y"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Page Images" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploaderBox targetKey="heritage1" label="Heritage Left Image (e.g., Cargo Pants)" className="h-64" />
                  <ImageUploaderBox targetKey="heritage2" label="Heritage Right Image (e.g., Polo Model)" className="h-64" />
                  <ImageUploaderBox targetKey="factory" label="Factory Section Image" className="h-48" />
                  <ImageUploaderBox targetKey="quality" label="Quality Section Image" className="h-48" />
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-2">Factory Heading</label>
                    <input 
                      type="text" 
                      value={factoryHeading}
                      onChange={(e) => setFactoryHeading(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-2">Quality Heading</label>
                    <input 
                      type="text" 
                      value={qualityHeading}
                      onChange={(e) => setQualityHeading(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'mission' && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Mission & Vision" />
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Our Mission</label>
                  <textarea 
                    value={missionText}
                    onChange={(e) => setMissionText(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Our Vision</label>
                  <textarea 
                    value={visionText}
                    onChange={(e) => setVisionText(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none resize-y"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Company Statistics" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex gap-2 p-4 bg-[#FAFAFA] rounded-lg border border-[#E5E5E5]">
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-xs font-semibold text-[#666666] mb-1">Value</label>
                          <input 
                            type="text" 
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...stats];
                              newStats[idx].value = e.target.value;
                              setStats(newStats);
                            }}
                            className="w-full h-9 px-2 bg-white border border-[#E5E5E5] rounded text-sm font-bold focus:border-[#111111] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#666666] mb-1">Label</label>
                          <input 
                            type="text" 
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...stats];
                              newStats[idx].label = e.target.value;
                              setStats(newStats);
                            }}
                            className="w-full h-9 px-2 bg-white border border-[#E5E5E5] rounded text-sm focus:border-[#111111] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={() => {
              toast('Changes discarded', { icon: 'ℹ️' })
              onBack()
            }} 
            className="px-5 py-2.5 text-sm font-medium text-[#666666] hover:text-[#111111]"
          >
            Discard Changes
          </button>
          <button 
            onClick={() => {
              toast.success('About Us updated successfully!')
              onBack()
            }}
            className="px-6 py-2.5 bg-[#111111] text-white text-sm font-bold rounded-lg hover:bg-black transition-colors shadow-md"
          >
            Save & Publish
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminCMS() {
  const [activeEditor, setActiveEditor] = useState(null) // null | 'hero'

  const sections = [
    { id: 'hero', title: 'Hero Banner', icon: ImageIcon, status: 'Published', lastUpdated: '2 hours ago' },
    { id: 'about', title: 'About Us', icon: Type, status: 'Draft', lastUpdated: '1 day ago' },
    { id: 'collection', title: 'Home Collection', icon: Layout, status: 'Published', lastUpdated: '3 days ago' },
    { id: 'footer', title: 'Footer Links', icon: Globe, status: 'Published', lastUpdated: '1 week ago' },
  ]

  if (activeEditor === 'about') {
    return (
      <AdminLayout>
        <AboutUsEditor onBack={() => setActiveEditor(null)} />
      </AdminLayout>
    )
  }

  if (activeEditor === 'hero') {
    return (
      <AdminLayout>
        <HeroBannerEditor onBack={() => setActiveEditor(null)} />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Content Management</h1>
          <p className="text-sm text-[#666666] mt-1">Manage landing pages, banners, and static content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon
          return (
            <Card 
              key={idx} 
              className="group hover:border-[#111111] transition-colors cursor-pointer"
              onClick={() => {
                if (section.id === 'hero') {
                  setActiveEditor('hero')
                } else if (section.id === 'about') {
                  setActiveEditor('about')
                } else {
                  alert(`Editor for ${section.title} is coming soon!`)
                }
              }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#111111] text-lg mb-1">{section.title}</h3>
                <div className="flex items-center gap-2 mt-auto pt-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    section.status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {section.status}
                  </span>
                  <span className="text-xs text-[#888888]">Updated {section.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </AdminLayout>
  )
}
