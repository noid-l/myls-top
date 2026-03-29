import DefaultTheme from 'vitepress/theme'
import './style.css'

import HomePosts from './components/HomePosts.vue'
import HeroFeatured from './components/HeroFeatured.vue'
import PostCard from './components/PostCard.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePosts', HomePosts)
    app.component('HeroFeatured', HeroFeatured)
    app.component('PostCard', PostCard)
  }
}
