import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { ISOTOPES, Isotope } from '../decay-calc/isotopes';

import { styles as sharedStyles } from '../../styles/shared-styles';

@customElement('reverse-decay-calc')
export class ReverseDecayCalc extends LitElement {
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

  @property({ type: String }) selectedIsotope: string = ISOTOPES[0].symbol;
  @state() private _selectedIsotope: Isotope = ISOTOPES[0];
  @state() private futureActivity: number = 0;
  @state() private elapsed: number = 0;
  @state() private timeUnit: 'minutes' | 'hours' | 'days' = 'hours';
  @state() private result: number|null = null;

  connectedCallback() {
    super.connectedCallback();
    this._syncIsotopeFromProp();
  }

  updated(changedProps: Map<string, any>) {
    if (changedProps.has('selectedIsotope')) {
      this._syncIsotopeFromProp();
    }
  }

  private _syncIsotopeFromProp() {
    const iso = ISOTOPES.find(i => i.symbol === this.selectedIsotope);
    this._selectedIsotope = iso || ISOTOPES[0];
  }

  private get halfLifeInSelectedUnit(): number {
    const { halfLife, halfLifeUnit } = this._selectedIsotope;
    // Convert isotope half-life to selected time unit
    const unitMap = { seconds: 1/60, minutes: 1, hours: 60, days: 1440 };
    return halfLife * (unitMap[halfLifeUnit] / unitMap[this.timeUnit]);
  }

  private calculateReverseDecay() {
    if (!this.futureActivity || !this.elapsed) {
      this.result = null;
      return;
    }
    const t = this.elapsed;
    const tHalf = this.halfLifeInSelectedUnit;
    const Af = this.futureActivity;
    // A0 = Af / (0.5)^(t/tHalf)
    const A0 = Af / Math.pow(0.5, t / tHalf);
    this.result = A0;
  }

  private handleIsotopeChange(e: Event) {
    const idx = (e.target as HTMLSelectElement).selectedIndex;
    this._selectedIsotope = ISOTOPES[idx];
    this.selectedIsotope = this._selectedIsotope.symbol;
    this.dispatchEvent(new CustomEvent('isotope-change', {
      detail: { isotope: this.selectedIsotope },
      bubbles: true,
      composed: true
    }));
    this.calculateReverseDecay();
  }

  private handleInputChange(e: Event) {
    const name = (e.target as HTMLInputElement).name;
    const value = parseFloat((e.target as HTMLInputElement).value);
    if (name === 'futureActivity') this.futureActivity = value;
    if (name === 'elapsed') this.elapsed = value;
    this.calculateReverseDecay();
  }

  private handleUnitChange(e: Event) {
    this.timeUnit = (e.target as HTMLSelectElement).value as any;
    this.calculateReverseDecay();
  }

  render() {
    return html`
      <app-header title="Reverse Decay Calculator"></app-header>
      <main style="margin-top: 56px;">
        <h2>Reverse Decay Calculator</h2>
        <form @submit=${(e: Event) => e.preventDefault()}>
          <div class="form-row">
            <label for="isotope">Isotope</label>
            <select id="isotope" @change=${this.handleIsotopeChange}>
              ${[...ISOTOPES].sort((a, b) => a.atomicNumber - b.atomicNumber).map((iso) => html`
                <option ?selected=${this._selectedIsotope.symbol === iso.symbol}>
                  ${iso.name} (${iso.symbol})
                </option>
              `)}
            </select>
            <div style="font-size:0.95em;color:#666;">
              Half-life: ${this._selectedIsotope.halfLife} ${this._selectedIsotope.halfLifeUnit}
            </div>
          </div>
          <div class="form-row">
            <label for="futureActivity">Required Activity At Time</label>
            <input id="futureActivity" name="futureActivity" type="number" inputmode="decimal" pattern="[0-9]*" min="0" step="any" @input=${this.handleInputChange} />
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
          ${this.result !== null ? html`Dispense Now: ${this.result.toFixed(3)}` : ''}
        </div>
      </main>
    `;
  }
}
