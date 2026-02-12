import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Users, 
  UserCircle, 
  Clock, 
  Heart, 
  Wrench, 
  DollarSign, 
  History, 
  Car, 
  ChevronDown, 
  ChevronRight,
  FlagIcon,
  Package,
  ShoppingBag,
  Tag,
  Grid,
  Truck,
  ExternalLink,
  BookOpen,
  Settings,
  Download
} from './Icons'

type TabId = 'users' | 'accounts' | 'sessions' | 'favorites' | 'service-requests' | 'sell-submissions' | 'versions' | 'vehicle-import' | 'vehicle-export' | 'documentation' | 'settings'

interface MenuItem {
  id: TabId | string
  label: string
  icon: React.ReactNode
  beta?: boolean
  disabled?: boolean
  external?: boolean
  url?: string
}

interface MenuSection {
  id: string
  label: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    id: 'customers',
    label: 'Customers',
    items: [
      { id: 'users', label: 'Users', icon: <Users /> },
      { id: 'accounts', label: 'Accounts', icon: <UserCircle /> },
      { id: 'sessions', label: 'Sessions', icon: <Clock /> },
      { id: 'favorites', label: 'Favorites', icon: <Heart /> },
      { id: 'service-requests', label: 'Service Requests', icon: <Wrench /> },
      { id: 'sell-submissions', label: 'Sell Submissions', icon: <DollarSign /> },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    items: [
      { id: 'vehicle-import', label: 'Vehicle Import', icon: <Car /> },
      { id: 'vehicle-export', label: 'Vehicle Export', icon: <Download /> },
      { id: 'versions', label: 'Version History', icon: <History /> },
    ],
  },
  {
    id: 'parts',
    label: 'Parts',
    items: [
      { 
        id: 'shopify-admin', 
        label: 'Shopify Admin', 
        icon: <ShoppingBag />,
        external: true,
        url: 'https://admin.shopify.com/store/enthusiast-auto'
      },
      { 
        id: 'shopify-products', 
        label: 'Products', 
        icon: <Package />,
        external: true,
        url: 'https://admin.shopify.com/store/enthusiast-auto/products'
      },
      { 
        id: 'shopify-collections', 
        label: 'Collections', 
        icon: <Grid />,
        external: true,
        url: 'https://admin.shopify.com/store/enthusiast-auto/collections'
      },
      { 
        id: 'shopify-orders', 
        label: 'Orders', 
        icon: <Truck />,
        external: true,
        url: 'https://admin.shopify.com/store/enthusiast-auto/orders'
      },
      { 
        id: 'shopify-discounts', 
        label: 'Discounts', 
        icon: <Tag />,
        external: true,
        url: 'https://admin.shopify.com/store/enthusiast-auto/discounts'
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { id: 'documentation', label: 'Documentation', icon: <BookOpen /> },
      { id: 'settings', label: 'Settings', icon: <Settings /> },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  
  // Determine active tab from current path
  const activeTab = location.pathname.split('/')[1] as TabId || 'users'

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed-sections')
    if (saved) {
      try {
        setCollapsedSections(new Set(JSON.parse(saved)))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      localStorage.setItem('sidebar-collapsed-sections', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-3">
          <FlagIcon className="h-6 w-auto" />
          <span className="text-xl font-semibold uppercase tracking-wider text-white">HUB</span>
        </div>
        <div className="sidebar-title">Data Manager</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuSections.map((section) => {
          const isCollapsed = collapsedSections.has(section.id)
          
          return (
            <div key={section.id} className="sidebar-section">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="sidebar-section-header"
              >
                <span className="sidebar-section-label">{section.label}</span>
                <span className="sidebar-section-icon">
                  {isCollapsed ? <ChevronRight /> : <ChevronDown />}
                </span>
              </button>

              {/* Section Items */}
              {!isCollapsed && (
                <div className="sidebar-section-items">
                  {section.items.map((item) => {
                    if (item.external && item.url) {
                      return (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sidebar-item"
                        >
                          <span className="sidebar-item-icon">{item.icon}</span>
                          <span className="sidebar-item-label">{item.label}</span>
                          <span className="sidebar-item-icon ml-auto">
                            <ExternalLink />
                          </span>
                        </a>
                      )
                    }
                    
                    return (
                      <Link
                        key={item.id}
                        to={`/${item.id}`}
                        className={`sidebar-item ${activeTab === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                        onClick={(e) => item.disabled && e.preventDefault()}
                      >
                        <span className="sidebar-item-icon">{item.icon}</span>
                        <span className="sidebar-item-label">{item.label}</span>
                        {item.beta && (
                          <span className="sidebar-item-badge">BETA</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
