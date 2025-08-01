import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UNITS, UnitCategory, UnitDef } from './units';
import { styles as sharedStyles } from '../../styles/shared-styles';

@customElement('unit-convert')
export class UnitConvert extends LitElement {
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

  @state() private category: UnitCategory = 'activity';
  @state() private fromUnit: UnitDef = UNITS.find(u => u.category === 'activity')!;
  @state() private toUnit: UnitDef = UNITS.find(u => u.category === 'activity' && u.symbol !== 'Bq')!;
  @state() private inputValue: number = 0;
  @state() private result: number|null = null;

  connectedCallback() {
    super.connectedCallback();
    if (typeof window !== 'undefined' && window.localStorage) {
      const cat = localStorage.getItem('radcalc:unit:category');
      if (cat === 'activity' || cat === 'dose') this.category = cat;
      const from = localStorage.getItem('radcalc:unit:from');
      const to = localStorage.getItem('radcalc:unit:to');
      const units = UNITS.filter(u => u.category === this.category);
      if (from) {
        const idx = units.findIndex(u => u.symbol === from);
        if (idx >= 0) this.fromUnit = units[idx];
      }
      if (to) {
        const idx = units.findIndex(u => u.symbol === to);
        if (idx >= 0) this.toUnit = units[idx];
      }
    }
  }

  private get availableUnits() {
    return UNITS.filter(u => u.category === this.category);
  }

  private handleCategoryChange(e: Event) {
    this.category = (e.target as HTMLSelectElement).value as UnitCategory;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('radcalc:unit:category', this.category);
    }
    const units = this.availableUnits;
    this.fromUnit = units[0];
    this.toUnit = units[1] || units[0];
    this.calculate();
  }

  private handleFromUnitChange(e: Event) {
    const idx = (e.target as HTMLSelectElement).selectedIndex;
    this.fromUnit = this.availableUnits[idx];
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('radcalc:unit:from', this.fromUnit.symbol);
    }
    this.calculate();
  }

  private handleToUnitChange(e: Event) {
    const idx = (e.target as HTMLSelectElement).selectedIndex;
    this.toUnit = this.availableUnits[idx];
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('radcalc:unit:to', this.toUnit.symbol);
    }
    this.calculate();
  }

  private handleInputChange(e: Event) {
    this.inputValue = parseFloat((e.target as HTMLInputElement).value);
    this.calculate();
  }

  private calculate() {
    if (!this.inputValue || !this.fromUnit || !this.toUnit) {
      this.result = null;
      return;
    }
    // Convert to SI, then to target
    const si = this.fromUnit.toSI(this.inputValue);
    this.result = this.toUnit.fromSI(si);
  }

  render() {
    return html`
      <app-header title="Unit Converter"></app-header>
      <main style="margin-top: 56px;">
        <h2>Radioactivity & Dose Unit Converter</h2>
        <form @submit=${(e: Event) => e.preventDefault()}>
          <div class="form-row">
            <label for="category">Category</label>
            <select id="category" @change=${this.handleCategoryChange}>
              <option value="activity" ?selected=${this.category==='activity'}>Activity</option>
              <option value="dose" ?selected=${this.category==='dose'}>Dose</option>
            </select>
          </div>

          <div class="form-row">
            <label for="fromUnit">From</label>
            <select id="fromUnit" @change=${this.handleFromUnitChange}>
              ${this.availableUnits.map((u) => html`<option ?selected=${this.fromUnit===u}>${u.name} (${u.symbol})</option>`)}
            </select>
          </div>
          <div class="form-row">
            <label for="toUnit">To</label>
            <select id="toUnit" @change=${this.handleToUnitChange}>
              ${this.availableUnits.map((u) => html`<option ?selected=${this.toUnit===u}>${u.name} (${u.symbol})</option>`)}
            </select>
          </div>
          <div class="form-row">
            <label for="inputValue">Value</label>
            <input id="inputValue" name="inputValue" type="number" inputmode="decimal" pattern="[0-9]*" min="0" step="any" @input=${this.handleInputChange} />
          </div>
        </form>
        <div class="result">
          ${this.result !== null ? html`${this.inputValue} ${this.fromUnit.symbol} = ${this.result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${this.toUnit.symbol}` : ''}
        </div>
      </main>
    `;
  }
}
