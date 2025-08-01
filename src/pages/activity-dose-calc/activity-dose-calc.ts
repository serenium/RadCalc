import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { ISOTOPES, Isotope } from '../decay-calc/isotopes';
import { styles as sharedStyles } from '../../styles/shared-styles';

@customElement('activity-dose-calc')
export class ActivityDoseCalc extends LitElement {
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

  @state() private mode: 'activity-to-dose' | 'dose-to-activity' = 'activity-to-dose';
  @state() private selectedIsotope: Isotope = ISOTOPES[0];
  @state() private activity: number = 0; // MBq
  @state() private doseRate: number = 0; // μSv/h
  @state() private distance: number = 1; // meters
  @state() private result: number|null = null;

  private get sortedIsotopes() {
    return [...ISOTOPES].filter(i => i.doseConstant).sort((a, b) => a.atomicNumber - b.atomicNumber);
  }

  private handleIsotopeChange(e: Event) {
    const idx = (e.target as HTMLSelectElement).selectedIndex;
    this.selectedIsotope = this.sortedIsotopes[idx];
    this.calculate();
  }

  private handleInputChange(e: Event) {
    const name = (e.target as HTMLInputElement).name;
    const value = parseFloat((e.target as HTMLInputElement).value);
    if (name === 'activity') this.activity = value;
    if (name === 'doseRate') this.doseRate = value;
    if (name === 'distance') this.distance = value;
    this.calculate();
  }

  private handleModeChange(e: Event) {
    this.mode = (e.target as HTMLInputElement).value as any;
    this.calculate();
  }

  private calculate() {
    const iso = this.selectedIsotope;
    if (!iso.doseConstant || !this.distance) {
      this.result = null;
      return;
    }
    if (this.mode === 'activity-to-dose') {
      // Dose rate (μSv/h) = Γ × A / r²
      this.result = iso.doseConstant * this.activity / (this.distance * this.distance);
    } else {
      // Activity (MBq) = Dose rate × r² / Γ
      this.result = this.doseRate * (this.distance * this.distance) / iso.doseConstant;
    }
  }

  render() {
    return html`
      <app-header title="Activity ↔ Dose Calculator"></app-header>
      <main>
        <h2>Activity ↔ Dose Rate Calculator</h2>
        <form @submit=${(e: Event) => e.preventDefault()}>
          <div class="form-row">
            <label>Calculation Mode</label>
            <label><input type="radio" name="mode" value="activity-to-dose" .checked=${this.mode==='activity-to-dose'} @change=${this.handleModeChange}/> Activity → Dose Rate</label>
            <label><input type="radio" name="mode" value="dose-to-activity" .checked=${this.mode==='dose-to-activity'} @change=${this.handleModeChange}/> Dose Rate → Activity</label>
          </div>
          <div class="form-row">
            <label for="isotope">Isotope</label>
            <select id="isotope" @change=${this.handleIsotopeChange}>
              ${this.sortedIsotopes.map((iso) => html`
                <option ?selected=${this.selectedIsotope.symbol === iso.symbol}>
                  ${iso.name} (${iso.symbol})
                </option>
              `)}
            </select>
            <div style="font-size:0.95em;color:#666;">
              Dose constant: ${this.selectedIsotope.doseConstant} μSv·m²/MBq·h
            </div>
          </div>
          <div class="form-row">
            <label for="distance">Distance (meters)</label>
            <input id="distance" name="distance" type="number" min="0.01" step="any" .value=${this.distance} @input=${this.handleInputChange} />
          </div>
          ${this.mode === 'activity-to-dose' ? html`
            <div class="form-row">
              <label for="activity">Activity (MBq)</label>
              <input id="activity" name="activity" type="number" min="0" step="any" .value=${this.activity} @input=${this.handleInputChange} />
            </div>
          ` : html`
            <div class="form-row">
              <label for="doseRate">Dose Rate (μSv/h)</label>
              <input id="doseRate" name="doseRate" type="number" min="0" step="any" .value=${this.doseRate} @input=${this.handleInputChange} />
            </div>
          `}
        </form>
        <div class="result">
          ${this.result !== null ? (
            this.mode === 'activity-to-dose'
              ? html`Dose Rate: ${this.result.toLocaleString(undefined, { maximumFractionDigits: 6 })} μSv/h`
              : html`Source Activity: ${this.result.toLocaleString(undefined, { maximumFractionDigits: 6 })} MBq`
          ) : ''}
        </div>
      </main>
    `;
  }
}
