import { BookOpen, Code, Briefcase, Headphones } from './Icons'

export function DocumentationPage() {
  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div 
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderWidth: '1px',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <BookOpen />
          <h3 
            className="text-lg font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            Overview
          </h3>
        </div>
        <div 
          className="space-y-3 text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          <p>
            The Enthusiast Auto Data Manager is a comprehensive admin dashboard for managing all aspects of the Enthusiast Auto Group platform.
          </p>
          <p>
            This application provides tools for managing customer data, vehicle inventory, parts e-commerce, and system operations.
          </p>
        </div>
      </div>

      {/* Architecture Section */}
      <div 
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderWidth: '1px',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Code />
          <h3 
            className="text-lg font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            Architecture
          </h3>
        </div>
        <div 
          className="space-y-3 text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          <div>
            <h4 
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Tech Stack
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Frontend: React 19 + TypeScript</li>
              <li>Backend: Express.js + Node.js</li>
              <li>Database: Vercel Postgres (Neon)</li>
              <li>CMS: Sanity v5</li>
              <li>E-commerce: Shopify Storefront API</li>
            </ul>
          </div>
          <div>
            <h4 
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Ports
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Frontend: Port 4040</li>
              <li>API: Port 4041</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Business Section */}
      <div 
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderWidth: '1px',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Briefcase />
          <h3 
            className="text-lg font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            Business Context
          </h3>
        </div>
        <div 
          className="space-y-3 text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Enthusiast Auto Group</strong> is a BMW preservation facility specializing in classic and high-end BMW M models.
          </p>
          <div>
            <h4 
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Revenue Streams
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Vehicle Sales: Direct sales of curated BMW inventory</li>
              <li>Parts E-commerce: Online parts store via Shopify</li>
              <li>Services: Maintenance, restoration, and specialty services</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Operations Section */}
      <div 
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderWidth: '1px',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Headphones />
          <h3 
            className="text-lg font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            Operations
          </h3>
        </div>
        <div 
          className="space-y-3 text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          <div>
            <h4 
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Key Workflows
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Customer Management: Track users, sessions, and favorites</li>
              <li>Service Requests: Manage incoming service inquiries</li>
              <li>Sell Submissions: Process vehicle consignment requests</li>
              <li>Vehicle Import: Bulk import vehicles from CSV to Sanity CMS</li>
              <li>Parts Management: Shopify integration for parts catalog</li>
            </ul>
          </div>
          <div>
            <h4 
              className="font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              External Links
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <a 
                  href="https://github.com/enthusiastauto" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="https://enthusiastauto.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  Main Website
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
