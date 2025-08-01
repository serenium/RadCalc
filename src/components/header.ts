import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/button/button.js';
@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = 'RadCalc';

  @property({ type: Boolean}) enableBack: boolean = false;

  static styles = css`
    header {
      position: fixed;
      left: env(titlebar-area-x, 0);
      top: env(titlebar-area-y, 0);
      height: env(titlebar-area-height, 44px);
      width: env(titlebar-area-width, 100%);
      background: var(--app-color-primary);
      color: white;
      -webkit-app-region: drag;
      z-index: 100;
      display: flex;
      align-items: center;
      padding: 0 12px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      height: 100%;
    }

    .header-title {
      flex: 1 1 0%;
      text-align: center;
      font-size: 1.1em;
      font-weight: bold;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
    }

    @media(prefers-color-scheme: light) {
      header {
        color: black;
      }

      nav a {
        color: initial;
      }
    }
  `;

  render() {
    return html`
      <header>
        <div class="header-left">
          <sl-button size="small" variant="text" @click=${() => this.dispatchEvent(new CustomEvent('sidebar-toggle', { bubbles: true, composed: true }))}>
            <sl-icon name="list"></sl-icon>
          </sl-button>
          ${this.enableBack ? html`<sl-button size="small" href="${resolveRouterPath()}">Back</sl-button>` : null}
        </div>
        <div class="header-title">${this.title}</div>
        <div style="width:40px;"></div>
      </header>
    `;
  }
}
