import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import { onMounted } from 'vue'
import './style.css'

import Layout from './Layout.vue'
import HomePosts from './components/HomePosts.vue'
import HeroFeatured from './components/HeroFeatured.vue'
import PagefindSearch from './components/PagefindSearch.vue'
import PostCard from './components/PostCard.vue'
import PostsArchivePage from './components/PostsArchivePage.vue'
import NotFound from './components/NotFound.vue'
import PostNav from './components/PostNav.vue'
import PostFooter from './components/PostFooter.vue'
import ShareButtons from './components/ShareButtons.vue'
import GiscusComments from './components/GiscusComments.vue'
import BackToTop from './components/BackToTop.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component('HomePosts', HomePosts)
    app.component('HeroFeatured', HeroFeatured)
    app.component('PagefindSearch', PagefindSearch)
    app.component('PostCard', PostCard)
    app.component('PostsArchivePage', PostsArchivePage)
    app.component('NotFound', NotFound)
    app.component('PostNav', PostNav)
    app.component('PostFooter', PostFooter)
    app.component('ShareButtons', ShareButtons)
    app.component('GiscusComments', GiscusComments)
    app.component('BackToTop', BackToTop)
  },
  setup() {
    if (typeof window !== 'undefined') {
      onMounted(() => {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              if (node instanceof HTMLImageElement && !node.hasAttribute('loading')) {
                node.setAttribute('loading', 'lazy')
                node.setAttribute('decoding', 'async')
              }
              if (node instanceof HTMLElement) {
                node.querySelectorAll('img:not([loading])').forEach((img) => {
                  img.setAttribute('loading', 'lazy')
                  img.setAttribute('decoding', 'async')
                })
              }
            }
          }
        })
        const doc = document.querySelector('.vp-doc')
        if (doc) {
          observer.observe(doc, { childList: true, subtree: true })
          doc.querySelectorAll('img:not([loading])').forEach((img) => {
            img.setAttribute('loading', 'lazy')
            img.setAttribute('decoding', 'async')
          })
        }
      })
    }
  }
}
