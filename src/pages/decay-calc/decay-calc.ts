import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ISOTOPES, Isotope } from './isotopes';
import { styles as sharedStyles } from '../../styles/shared-styles';

@customElement('decay-calc')
export class DecayCalc extends LitElement {
  static styles = [
    sharedStyles,
    css`
      .form-row {
        margin-bottom: 1.2em;
        display: flex;
        flex-direction: column;
      }
      label {
        font-weight: 500;
        margin-bottom: 0.3em;
      }
      select, input {
        font-size: 1.1em;
        padding: 0.4em;
      }
      .result {
        margin-top: 1.5em;
        font-size: 1.2em;
        font-weight: bold;
      }
    `
  ];

  @state() private selectedIsotope: Isotope = ISOTOPES[0];
  @state() private initialActivity: number = 0;
  @state() private elapsed: number = 0;
  @state() private timeUnit: 'minutes' | 'hours' | 'days' = 'hours';
  @state() private result: number|null = null;

  connectedCallback() {
    super.connectedCallback();
    if (typeof window !== 'undefined' && window.localStorage) {
      const isoIdx = parseInt(localStorage.getItem('radcalc:decay:isotope') || '0', 10);
      if (!isNaN(isoIdx) && ISOTOPES[isoIdx]) this.selectedIsotope = ISOTOPES[isoIdx];
      const unit = localStorage.getItem('radcalc:decay:unit');
      if (unit === 'minutes' || unit === 'hours' || unit === 'days') this.timeUnit = unit;
    }
  }

  private get halfLifeInSelectedUnit(): number {
    const { halfLife, halfLifeUnit } = this.selectedIsotope;
    // Convert isotope half-life to selected time unit
    const unitMap = { minutes: 1, hours: 60, days: 1440 };
    return halfLife * (unitMap[halfLifeUnit] / unitMap[this.timeUnit]);
  }

  private calculateDecay() {
    if (!this.initialActivity || !this.elapsed) {
      this.result = null;
      return;
    }
    const t = this.elapsed;
    const tHalf = this.halfLifeInSelectedUnit;
    const A0 = this.initialActivity;
    const A = A0 * Math.pow(0.5, t / tHalf);
    this.result = A;
  }

  private handleIsotopeChange(e: Event) {
    const idx = (e.target as HTMLSelectElement).selectedIndex;
    this.selectedIsotope = ISOTOPES[idx];
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('radcalc:decay:isotope', String(idx));
    }
    this.calculateDecay();
  }

  private handleInputChange(e: Event) {
    const name = (e.target as HTMLInputElement).name;
    const value = parseFloat((e.target as HTMLInputElement).value);
    if (name === 'initialActivity') this.initialActivity = value;
    if (name === 'elapsed') this.elapsed = value;
    this.calculateDecay();
  }

  private handleUnitChange(e: Event) {
    this.timeUnit = (e.target as HTMLSelectElement).value as any;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('radcalc:decay:unit', this.timeUnit);
    }
    this.calculateDecay();
  }

  render() {
    return html`
      <app-header title="Decay Calculator"></app-header>
      <main>
        <h2>Radioactive Decay Calculator</h2>
        <form @submit=${(e: Event) => e.preventDefault()}>
          <div class="form-row">
            <label for="isotope">Isotope</label>
            <select id="isotope" @change=${this.handleIsotopeChange}>
              ${ISOTOPES.map((iso) => html`
                <option ?selected=${this.selectedIsotope === iso}>
                  ${iso.name} (${iso.symbol})
                </option>
              `)}
            </select>
            <div style="font-size:0.95em;color:#666;">
              Half-life: ${this.selectedIsotope.halfLife} ${this.selectedIsotope.halfLifeUnit}
            </div>
          </div>
          <div class="form-row">
            <label for="initialActivity">Initial Activity</label>
            <input id="initialActivity" name="initialActivity" type="number" inputmode="decimal" pattern="[0-9]*" min="0" step="any" @input=${this.handleInputChange} />
          </div>
          <div class="form-row">
            <label for="elapsed">Elapsed Time</label>
            <input id="elapsed" name="elapsed" type="number" inputmode="decimal" pattern="[0-9]*" min="0" step="any" @input=${this.handleInputChange} />
            <select id="timeUnit" @change=${this.handleUnitChange}>
              <option value="minutes" ?selected=${this.timeUnit==='minutes'}>Minutes</option>
              <option value="hours" ?selected=${this.timeUnit==='hours'}>Hours</option>
              <option value="days" ?selected=${this.timeUnit==='days'}>Days</option>
            </select>
          </div>
        </form>
        <div class="result">
          ${this.result !== null ? html`Remaining Activity: ${this.result.toFixed(3)}` : ''}
        </div>
      </main>
    `;
  }
}
