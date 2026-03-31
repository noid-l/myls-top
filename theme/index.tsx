import './index.css'
import { useEffect } from 'react'
import { usePage } from '@rspress/core/runtime'
import {
  HomeLayout as OriginalHomeLayout,
  Layout as OriginalLayout
} from '@rspress/core/theme-original'
import HomePage from '../src/components/home-page'

function RoutePathMarker() {
  const { page } = usePage()
  const routePath = page.routePath || '/'

  useEffect(() => {
    document.documentElement.setAttribute('data-route-path', routePath)
    return () => {
      document.documentElement.removeAttribute('data-route-path')
    }
  }, [routePath])

  return null
}

export function Layout() {
  return (
    <>
      <RoutePathMarker />
      <OriginalLayout />
    </>
  )
}

export function HomeLayout() {
  return (
    <>
      <RoutePathMarker />
      <OriginalHomeLayout
        afterFeatures={<HomePage />}
      />
    </>
  )
}

export * from '@rspress/core/theme-original'
