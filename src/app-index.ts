
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './pages/app-home';
import './components/header';
import './components/sidebar';
import './styles/global.css';
import { router } from './router';

@customElement('app-index')
export class AppIndex extends LitElement {
  @property({ type: Boolean }) sidebarOpen = false;

  static styles = css`
    main {
      padding-left: 16px;
      padding-right: 16px;
      padding-bottom: 16px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sidebar-toggle', this.openSidebar as EventListener);
    this.addEventListener('sidebar-close', this.closeSidebar as EventListener);
    // Redirect to last used calculator if available
    if (typeof window !== 'undefined' && window.localStorage) {
      const lastRoute = localStorage.getItem('radcalc:lastRoute');
      if (lastRoute && window.location.pathname !== lastRoute) {
        window.history.replaceState({}, '', lastRoute);
      }
    }
  }
  disconnectedCallback() {
    this.removeEventListener('sidebar-toggle', this.openSidebar as EventListener);
    this.removeEventListener('sidebar-close', this.closeSidebar as EventListener);
    super.disconnectedCallback();
  }
  openSidebar = () => { this.sidebarOpen = true; };
  closeSidebar = () => { this.sidebarOpen = false; };

  // Only keep the new firstUpdated implementation below


  @property({ type: String }) pageTitle = 'RadCalc';

  firstUpdated() {
    const setTitleFromRoute = () => {
      // Save last route for next session
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('radcalc:lastRoute', window.location.pathname);
      }
      // Find matching route by path
      const path = window.location.pathname.replace(/^\//, '');
      const route = router.routes.find((r: any) => {
        // Remove baseURL from path if present
        const routePath = (typeof r.path === 'function' ? r.path() : r.path).replace(/^\//, '');
        return routePath === path || (routePath === '' && path === '');
      });
      let title = 'RadCalc';
      if (route && route.title) {
        title = typeof route.title === 'function' ? route.title({}) : route.title;
      }
      this.pageTitle = title;
    };
    router.addEventListener('route-changed', () => {
      setTitleFromRoute();
      if ("startViewTransition" in document) {
        (document as any).startViewTransition(() => this.requestUpdate());
      } else {
        this.requestUpdate();
      }
    });
    setTitleFromRoute();
  }

  render() {
    return html`
      <app-header .title=${this.pageTitle}></app-header>
      <app-sidebar .open=${this.sidebarOpen}></app-sidebar>
      <div style="max-width: 600px; margin: 0 auto; padding-top: 56px;">
        ${router.render()}
      </div>
    `;
  }
}
