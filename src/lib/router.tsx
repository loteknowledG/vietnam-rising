import { Navigate, createHashRouter } from 'react-router-dom'
import { DataModelPage } from '@/components/DataModelPage'
import { DesignPage } from '@/components/DesignPage'
import { SectionsPage } from '@/components/SectionsPage'
import { SectionPage } from '@/components/SectionPage'
import { ScreenDesignPage, ScreenDesignFullscreen } from '@/components/ScreenDesignPage'
import { ShellDesignPage, ShellDesignFullscreen } from '@/components/ShellDesignPage'
import { ExportPage } from '@/components/ExportPage'
import HCMCHubPreview from '@/sections/hcmc-hub/HCMCHubPreview'
import HanoiHubPreview from '@/sections/hanoi-hub/HanoiHubPreview'
import DaNangHubPreview from '@/sections/danang-hub/DaNangHubPreview'
import { PortfolioLayout } from '@/shell/PortfolioLayout'

export const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/hcmc" replace />,
  },
  {
    path: '/data-model',
    element: <DataModelPage />,
  },
  {
    path: '/design',
    element: <DesignPage />,
  },
  {
    element: <PortfolioLayout />,
    children: [
      {
        path: '/hcmc',
        element: <HCMCHubPreview />,
      },
      {
        path: '/hanoi',
        element: <HanoiHubPreview />,
      },
      {
        path: '/danang',
        element: <DaNangHubPreview />,
      },
    ]
  },
  {
    path: '/sections',
    element: <SectionsPage />,
  },
  {
    path: '/sections/:sectionId',
    element: <SectionPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName',
    element: <ScreenDesignPage />,
  },
  {
    path: '/sections/:sectionId/screen-designs/:screenDesignName/fullscreen',
    element: <ScreenDesignFullscreen />,
  },
  {
    path: '/shell/design',
    element: <ShellDesignPage />,
  },
  {
    path: '/shell/design/fullscreen',
    element: <ShellDesignFullscreen />,
  },
  {
    path: '/export',
    element: <ExportPage />,
  },
])
