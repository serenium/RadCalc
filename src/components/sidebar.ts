import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;

  static styles = css`
    :host {
      --sidebar-width: 260px;
      --sidebar-bg: #fff;
      --sidebar-fg: #222;
      --sidebar-shadow: 0 2px 12px rgba(0,0,0,0.12);
      --sidebar-z: 1000;
    }
    .backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.18);
      z-index: var(--sidebar-z);
      display: none;
    }
    :host([open]) .backdrop {
      display: block;
    }
    nav {
      position: fixed;
      top: 0; left: 0;
      height: 100vh;
      width: var(--sidebar-width);
      background: var(--sidebar-bg);
      color: var(--sidebar-fg);
      box-shadow: var(--sidebar-shadow);
      z-index: calc(var(--sidebar-z) + 1);
      transform: translateX(-100%);
      transition: transform 0.22s cubic-bezier(.4,0,.2,1);
      will-change: transform;
      display: flex;
      flex-direction: column;
      padding-top: 1.2em;
    }
    :host([open]) nav {
      transform: translateX(0);
    }
    .nav-title {
      font-size: 1.2em;
      font-weight: bold;
      margin: 0 0 1.2em 1.2em;
    }
    ul {
      list-style: none;
      padding: 0 0 0 1.2em;
      margin: 0;
      flex: 1;
    }
    li {
      margin-bottom: 1.1em;
    }
    a {
      color: inherit;
      text-decoration: none;
      font-size: 1.08em;
      font-weight: 500;
      display: block;
      padding: 0.3em 0.6em;
      border-radius: 6px;
      transition: background 0.15s;
    }
    a.active, a:hover {
      background: #f0f0f0;
    }
    @media (max-width: 600px) {
      :host {
        --sidebar-width: 80vw;
      }
    }
  `;

  private calculators = [
    { name: 'Decay Calculator', path: 'decay-calc' },
    { name: 'Reverse Decay Calculator', path: 'reverse-decay-calc' },
    { name: 'Unit Converter', path: 'unit-convert' },
    // Add more calculators here as needed
  ];

  private closeSidebar() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('sidebar-close', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="backdrop" @click=${this.closeSidebar}></div>
      <nav>
        <div class="nav-title">Calculators</div>
        <ul>
          ${this.calculators.map(calc => html`
            <li>
              <a href="${resolveRouterPath(calc.path)}" @click=${this.closeSidebar}>
                ${calc.name}
              </a>
            </li>
          `)}
        </ul>
      </nav>
    `;
  }
}
