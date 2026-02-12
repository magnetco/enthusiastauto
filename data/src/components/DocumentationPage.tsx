import { useState, useEffect } from 'react'
import { BookOpen, Image, Upload, Database, Headphones, ExternalLink, ChevronRight } from './Icons'

interface Section {
  id: string
  title: string
  icon: React.ReactNode
}

const sections: Section[] = [
  { id: 'overview', title: 'Overview', icon: <BookOpen /> },
  { id: 'sanity-cms', title: 'Using Sanity CMS', icon: <Upload /> },
  { id: 'vehicles', title: 'Managing Vehicles', icon: <ChevronRight /> },
  { id: 'images', title: 'Image Optimization', icon: <Image /> },
  { id: 'vercel', title: 'Vercel Database', icon: <Database /> },
  { id: 'support', title: 'Tech Support', icon: <Headphones /> },
]

export function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id))
      const scrollPosition = window.scrollY + 100

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i]
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.offsetTop - offset
      window.scrollTo({ top: elementPosition, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Floating Navigation - 1/3 width */}
      <aside className="w-1/3 max-w-xs">
        <div 
          className="sticky top-24 rounded-lg p-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderWidth: '1px',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3 
            className="text-sm font-semibold mb-4 px-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            ON THIS PAGE
          </h3>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left"
                style={{
                  color: activeSection === section.id ? 'var(--accent)' : 'var(--text-primary)',
                  backgroundColor: activeSection === section.id ? 'var(--accent-bg)' : 'transparent',
                }}
              >
                <span className="shrink-0">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content - 2/3 width */}
      <main className="flex-1 space-y-12">
        {/* Overview Section */}
        <section id="overview">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Overview
          </h2>
          <div 
            className="rounded-lg p-6 space-y-4"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderWidth: '1px',
              borderColor: 'var(--border-color)',
            }}
          >
            <p style={{ color: 'var(--text-primary)' }}>
              Welcome to the Enthusiast Auto Group staff documentation. This guide will help you manage website content, optimize media, and request technical support.
            </p>
            <p style={{ color: 'var(--text-primary)' }}>
              Our platform consists of three main systems:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
              <li><strong>Sanity CMS</strong> — Manage vehicle inventory, blog posts, and services</li>
              <li><strong>Shopify Admin</strong> — Manage parts catalog and e-commerce</li>
              <li><strong>Vercel Dashboard</strong> — Monitor database and website performance</li>
            </ul>
          </div>
        </section>

        {/* Sanity CMS Section */}
        <section id="sanity-cms">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Using Sanity CMS
          </h2>
          <div 
            className="rounded-lg p-6 space-y-6"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderWidth: '1px',
              borderColor: 'var(--border-color)',
            }}
          >
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Accessing Sanity Studio
              </h3>
              <ol className="list-decimal list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
                <li>Navigate to <code className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>studio.enthusiastauto.com</code></li>
                <li>Sign in with your Google account (must be authorized by admin)</li>
                <li>You'll see the main dashboard with content types on the left sidebar</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Content Types
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Vehicles</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Main inventory listings. Include year, model, chassis code, mileage, price, and detailed descriptions.
                  </p>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Blog Posts</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Articles, guides, and news. Use categories and featured images for better organization.
                  </p>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Services</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Service offerings like maintenance, restoration, and inspections.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Publishing Workflow
              </h3>
              <ol className="list-decimal list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
                <li>Create or edit content in Sanity Studio</li>
                <li>Fill in all required fields (marked with red asterisk)</li>
                <li>Upload optimized images (see Image Optimization section below)</li>
                <li>Click <strong>Publish</strong> in the bottom right corner</li>
                <li>Changes appear on the website within 60 seconds</li>
              </ol>
            </div>

            <div className="p-4 rounded" style={{ backgroundColor: 'var(--accent-bg)', borderLeft: '4px solid var(--accent)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                💡 <strong>Pro Tip:</strong> Use the "Preview" button to see how content will look before publishing.
              </p>
            </div>
          </div>
        </section>

        {/* Managing Vehicles Section */}
        <section id="vehicles">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Managing Vehicles
          </h2>
          <div 
            className="rounded-lg p-6 space-y-6"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderWidth: '1px',
              borderColor: 'var(--border-color)',
            }}
          >
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Adding a New Vehicle
              </h3>
              <ol className="list-decimal list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
                <li>In Sanity Studio, click <strong>Vehicles</strong> in the left sidebar</li>
                <li>Click the <strong>+ Create</strong> button</li>
                <li>Fill in vehicle details:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li><strong>Title:</strong> Format as "Year Model Variant" (e.g., "2006 E46 M3 Competition Package")</li>
                    <li><strong>Slug:</strong> Auto-generated URL-friendly version of title</li>
                    <li><strong>Chassis Code:</strong> Select from dropdown (E30, E36, E46, etc.)</li>
                    <li><strong>Year:</strong> Model year</li>
                    <li><strong>Mileage:</strong> Current odometer reading</li>
                    <li><strong>Price:</strong> Asking price (numeric only, no commas)</li>
                    <li><strong>Status:</strong> Available, Sold, or Pending</li>
                  </ul>
                </li>
                <li>Add vehicle description highlighting key features and history</li>
                <li>Upload images (see Image Optimization section)</li>
                <li>Click <strong>Publish</strong></li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Writing Vehicle Descriptions
              </h3>
              <p className="mb-3" style={{ color: 'var(--text-primary)' }}>
                Follow these guidelines for consistent, enthusiast-focused descriptions:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
                <li>Lead with what makes this vehicle special (rare options, low mileage, pristine condition)</li>
                <li>Include factory option codes (ZCP, ZHP, M-Sport, etc.)</li>
                <li>Mention service history and recent maintenance</li>
                <li>Be honest about any issues or modifications</li>
                <li>Use proper BMW terminology (not generic car terms)</li>
              </ul>
            </div>

            <div className="p-4 rounded" style={{ backgroundColor: 'var(--accent-bg)', borderLeft: '4px solid var(--accent)' }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                <strong>Example:</strong> "Exceptional E46 M3 with factory Competition Package (ZCP). Includes stiffer suspension, larger brakes, and 19-inch wheels. Well-maintained with full service records. Recent cooling system refresh and VANOS rebuild."
              </p>
            </div>
          </div>
        </section>

        {/* Image Optimization Section */}
        <section id="images">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Image Optimization
          </h2>
          <div 
            className="rounded-lg p-6 space-y-6"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderWidth: '1px',
              borderColor: 'var(--border-color)',
            }}
          >
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Why Optimize Images?
              </h3>
              <p style={{ color: 'var(--text-primary)' }}>
                Optimized images load faster, improve SEO, and provide a better user experience. Always optimize before uploading to Sanity.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Recommended Tools
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    TinyPNG <ExternalLink className="w-4 h-4" />
                  </h4>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Free online tool for compressing PNG and JPEG images.
                  </p>
                  <a 
                    href="https://tinypng.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    tinypng.com
                  </a>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    Squoosh <ExternalLink className="w-4 h-4" />
                  </h4>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Google's image compression tool with advanced options.
                  </p>
                  <a 
                    href="https://squoosh.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    squoosh.app
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Image Guidelines
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
                <li><strong>Format:</strong> Use JPEG for photos, PNG for graphics with transparency</li>
                <li><strong>Max Width:</strong> 2400px for hero images, 1200px for gallery images</li>
                <li><strong>File Size:</strong> Keep under 500KB per image (aim for 200-300KB)</li>
                <li><strong>Quality:</strong> 80-85% JPEG quality is ideal balance</li>
                <li><strong>Naming:</strong> Use descriptive names (e.g., "2006-e46-m3-exterior-front.jpg")</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Step-by-Step Optimization
              </h3>
              <ol className="list-decimal list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
                <li>Open your image in TinyPNG or Squoosh</li>
                <li>Upload or drag the image file</li>
                <li>Wait for compression (usually automatic)</li>
                <li>Download the optimized version</li>
                <li>Upload to Sanity CMS</li>
              </ol>
            </div>

            <div className="p-4 rounded" style={{ backgroundColor: 'var(--accent-bg)', borderLeft: '4px solid var(--accent)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                ⚠️ <strong>Important:</strong> Never upload images directly from your phone or camera without optimizing first. Raw images can be 5-10MB each and will slow down the website.
              </p>
            </div>
          </div>
        </section>

        {/* Vercel Database Section */}
        <section id="vercel">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Vercel Database
          </h2>
          <div 
            className="rounded-lg p-6 space-y-6"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderWidth: '1px',
              borderColor: 'var(--border-color)',
            }}
          >
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                What is Vercel?
              </h3>
              <p style={{ color: 'var(--text-primary)' }}>
                Vercel hosts our website and database. The database stores user accounts, favorites, service requests, and other dynamic data.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Accessing Vercel Dashboard
              </h3>
              <ol className="list-decimal list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
                <li>Navigate to <code className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>vercel.com</code></li>
                <li>Sign in with your authorized account</li>
                <li>Select the <strong>enthusiastauto</strong> project</li>
                <li>Click <strong>Storage</strong> tab to view databases</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Database Tables
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Users</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Customer accounts, authentication, and profile information.
                  </p>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Favorites</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Saved vehicles and parts from user accounts.
                  </p>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Service Requests</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Incoming service appointment requests from customers.
                  </p>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Sell Submissions</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Vehicle consignment and sale inquiries.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded" style={{ backgroundColor: 'var(--accent-bg)', borderLeft: '4px solid var(--accent)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                ⚠️ <strong>Caution:</strong> Do not modify database records directly unless instructed by Magnet. Contact tech support for database changes.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Support Section */}
        <section id="support">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Requesting Tech Support
          </h2>
          <div 
            className="rounded-lg p-6 space-y-6"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderWidth: '1px',
              borderColor: 'var(--border-color)',
            }}
          >
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Contact Magnet
              </h3>
              <p className="mb-4" style={{ color: 'var(--text-primary)' }}>
                For technical issues, feature requests, or questions about the platform, contact Magnet:
              </p>
              <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  📧 Email: <a href="mailto:support@magnetcreative.co" className="hover:underline" style={{ color: 'var(--accent)' }}>support@magnetcreative.co</a>
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Response time: Within 24 hours on business days
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                What to Include in Support Requests
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-primary)' }}>
                <li><strong>Clear description</strong> of the issue or request</li>
                <li><strong>Screenshots</strong> if applicable (especially for visual issues)</li>
                <li><strong>Steps to reproduce</strong> the problem</li>
                <li><strong>Browser and device</strong> you're using</li>
                <li><strong>URL</strong> of the page where the issue occurs</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Common Support Topics
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Content Issues</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Content not appearing, formatting problems, or publishing errors.
                  </p>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Access & Permissions</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Need access to Sanity, Vercel, or Shopify for new team members.
                  </p>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Feature Requests</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    New functionality, layout changes, or workflow improvements.
                  </p>
                </div>
                <div className="p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Bug Reports</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Broken links, display issues, or unexpected behavior.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded" style={{ backgroundColor: 'var(--accent-bg)', borderLeft: '4px solid var(--accent)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                💡 <strong>Pro Tip:</strong> Before submitting a support request, try clearing your browser cache and refreshing the page. Many issues resolve this way.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
