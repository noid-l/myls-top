import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import './style.css'

import HomePosts from './components/HomePosts.vue'
import HeroFeatured from './components/HeroFeatured.vue'
import PagefindSearch from './components/PagefindSearch.vue'
import PostCard from './components/PostCard.vue'
import PostsArchivePage from './components/PostsArchivePage.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('HomePosts', HomePosts)
    app.component('HeroFeatured', HeroFeatured)
    app.component('PagefindSearch', PagefindSearch)
    app.component('PostCard', PostCard)
    app.component('PostsArchivePage', PostsArchivePage)
  }
}
