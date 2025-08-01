import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';
import '../components/sidebar';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  static styles = [
    styles,
    css`
    #welcomeBar {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    #welcomeCard,
    #infoCard {
      padding: 18px;
      padding-top: 0px;
    }

    sl-card::part(footer) {
      display: flex;
      justify-content: flex-end;
    }

    @media(min-width: 750px) {
      sl-card {
        width: 70vw;
      }
    }


    @media (horizontal-viewport-segments: 2) {
      #welcomeBar {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
      }

      #welcomeCard {
        margin-right: 64px;
      }
    }
  `];

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'PWABuilder pwa-starter',
        text: 'Check out the PWABuilder pwa-starter!',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  @property({ type: Boolean }) sidebarOpen = false;

  // Key for localStorage
  private static readonly SIDEBAR_STATE_KEY = 'app-home.sidebarOpen';

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('sidebar-toggle', this.openSidebar as EventListener);
    this.addEventListener('sidebar-close', this.closeSidebar as EventListener);
    // Restore sidebar state
    const saved = localStorage.getItem(AppHome.SIDEBAR_STATE_KEY);
    if (saved !== null) {
      this.sidebarOpen = saved === 'true';
    }
  }
  disconnectedCallback() {
    this.removeEventListener('sidebar-toggle', this.openSidebar as EventListener);
    this.removeEventListener('sidebar-close', this.closeSidebar as EventListener);
    super.disconnectedCallback();
  }
  openSidebar = () => {
    this.sidebarOpen = true;
    localStorage.setItem(AppHome.SIDEBAR_STATE_KEY, 'true');
  };
  closeSidebar = () => {
    this.sidebarOpen = false;
    localStorage.setItem(AppHome.SIDEBAR_STATE_KEY, 'false');
  };

  render() {
    return html`
      <app-header></app-header>
      <app-sidebar .open=${this.sidebarOpen}></app-sidebar>
      <main style="max-width: 600px; margin: 0 auto; padding-top: 56px;">
        <div id="welcomeBar" style="gap: 1.2em;">
          <sl-card id="welcomeCard" style="margin-bottom: 1.2em;">
            <!-- Removed duplicate title to avoid overlap with app header -->
            <p>
              For more information on the PWABuilder pwa-starter, check out the
              <a href="https://docs.pwabuilder.com/#/starter/quick-start">documentation</a>.
            </p>
            <p id="mainInfo">
              Welcome to the
              <a href="https://pwabuilder.com">PWABuilder</a>
              pwa-starter! Be sure to head back to
              <a href="https://pwabuilder.com">PWABuilder</a>
              when you are ready to ship this PWA to the Microsoft Store, Google Play
              and the Apple App Store!
            </p>
            ${'share' in navigator
              ? html`<sl-button slot="footer" variant="default" @click="${this.share}">
                        <sl-icon slot="prefix" name="share"></sl-icon>
                        Share this Starter!
                      </sl-button>`
              : null}
          </sl-card>
          <sl-card id="infoCard">
            <ul>
              <li>
                <a href="https://www.typescriptlang.org/">TypeScript</a>
              </li>
              <li>
                <a href="https://lit.dev">lit</a>
              </li>
              <li>
                <a href="https://shoelace.style/">Shoelace</a>
              </li>
              <li>
                <a href="https://github.com/thepassle/app-tools/blob/master/router/README.md">App Tools Router</a>
              </li>
            </ul>
          </sl-card>
          <div style="display: flex; gap: 0.5em; margin-top: 1.2em;">
            <sl-button href="${resolveRouterPath('decay-calc')}" variant="primary">Decay Calculator</sl-button>
            <sl-button href="${resolveRouterPath('about')}" variant="primary">About</sl-button>
          </div>
        </div>
      </main>
    `;
  }
}
