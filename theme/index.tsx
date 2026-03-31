import './index.css'
import { HomeLayout as OriginalHomeLayout } from '@rspress/core/theme-original'
import HeroFeatured from '../src/components/hero-featured'
import HomePosts from '../src/components/home-posts'

export function HomeLayout() {
  return (
    <OriginalHomeLayout
      afterHero={<HeroFeatured />}
      afterFeatures={<HomePosts />}
    />
  )
}

export * from '@rspress/core/theme-original'
