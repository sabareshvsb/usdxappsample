import { useMemo, useState } from 'react'
import { ArrowRight, Eye, EyeOff, ShieldCheck, Shuffle } from 'lucide-react'
import AchievementCarousel from './AchievementCarousel'
import { createLeaderChoices } from '../lib/leaderNames'

const RANKS = [
  'Starter',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Crown',
  'Ambassador',
]

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  topLeader: '',
  directLeader: '',
  directTeam: '',
  totalTeam: '',
  directVolume: '',
  totalVolume: '',
  rank: '',
  password: '',
  confirmPassword: '',
}

function validate(form) {
  const errors = {}

  if (!form.name.trim()) errors.name = 'Name is required'

  if (!/^\+?[\d\s-]{7,}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (!form.topLeader) errors.topLeader = 'Select a top leader'
  if (!form.directLeader) errors.directLeader = 'Select a direct leader'

  if (form.directTeam === '' || Number(form.directTeam) < 0) {
    errors.directTeam = 'Enter a valid number'
  }

  if (form.totalTeam === '' || Number(form.totalTeam) < 0) {
    errors.totalTeam = 'Enter a valid number'
  } else if (form.directTeam !== '' && Number(form.totalTeam) < Number(form.directTeam)) {
    errors.totalTeam = 'Must be at least the direct team size'
  }

  if (form.directVolume === '' || Number(form.directVolume) < 0) {
    errors.directVolume = 'Enter a valid amount'
  }

  if (form.totalVolume === '' || Number(form.totalVolume) < 0) {
    errors.totalVolume = 'Enter a valid amount'
  } else if (form.directVolume !== '' && Number(form.totalVolume) < Number(form.directVolume)) {
    errors.totalVolume = 'Must be at least the direct volume'
  }

  if (!form.rank) errors.rank = 'Select a rank'

  if (form.password.length < 8) errors.password = 'Use at least 8 characters'

  if (!form.confirmPassword || form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

function Field({ label, htmlFor, error, hint, index, className = '', children }) {
  return (
    <div className={`field ${className}`} style={{ '--field-index': index }}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? (
        <span className="field-error">{error}</span>
      ) : hint ? (
        <span className="field-hint">{hint}</span>
      ) : null}
    </div>
  )
}

function SectionHeading({ index, title, description, action }) {
  return (
    <div className="form-section-heading">
      <div>
        <span className="section-index">{index}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

export default function SignInPage({ onContinue }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [choices, setChoices] = useState(createLeaderChoices)
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => validate(form), [form])
  const errorFor = (key) => (submitted ? errors[key] : undefined)

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const shuffleNames = () => {
    setChoices(createLeaderChoices())
    setForm((current) => ({ ...current, topLeader: '', directLeader: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    if (Object.keys(errors).length === 0) {
      onContinue(form)
    }
  }

  return (
    <div className="signin-shell">
      <div className="signin-container">
        <AchievementCarousel />

        <main className="signin-card">
          <header className="signin-header">
            <div>
              <div className="brand-line">
                <span className="brand-mark">US</span>
                <span className="eyebrow">USDX-SMART · Sample access</span>
              </div>
              <h1>Leader sign in</h1>
              <p>
                Complete your profile to enter the sample analytics workspace. Leader names are
                regenerated for every session.
              </p>
            </div>
            <div className="signin-badge">
              <ShieldCheck size={15} />
              Demo profile
            </div>
          </header>

          {submitted && Object.keys(errors).length > 0 ? (
            <div className="form-message" role="alert">
              Please review the highlighted fields before continuing.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-sections">
              <section className="form-section">
                <SectionHeading
                  index="01"
                  title="Personal details"
                  description="Tell us who is signing in."
                />
                <div className="field-grid">
                  <Field label="Name" htmlFor="name" index={0} error={errorFor('name')}>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      autoComplete="name"
                      value={form.name}
                      onChange={updateField('name')}
                      aria-invalid={Boolean(errorFor('name'))}
                    />
                  </Field>

                  <Field label="Phone" htmlFor="phone" index={1} error={errorFor('phone')}>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={updateField('phone')}
                      aria-invalid={Boolean(errorFor('phone'))}
                    />
                  </Field>

                  <Field
                    label="Email"
                    htmlFor="email"
                    index={2}
                    className="field-full"
                    error={errorFor('email')}
                  >
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={updateField('email')}
                      aria-invalid={Boolean(errorFor('email'))}
                    />
                  </Field>
                </div>
              </section>

              <section className="form-section">
                <SectionHeading
                  index="02"
                  title="Leader network"
                  description="Pick from 10 top leaders and 40 direct leaders."
                  action={
                    <button className="shuffle-button" type="button" onClick={shuffleNames}>
                      <Shuffle size={13} />
                      Shuffle names
                    </button>
                  }
                />
                <div className="field-grid">
                  <Field
                    label="Top leaders name"
                    htmlFor="topLeader"
                    index={3}
                    error={errorFor('topLeader')}
                  >
                    <select
                      id="topLeader"
                      value={form.topLeader}
                      onChange={updateField('topLeader')}
                      aria-invalid={Boolean(errorFor('topLeader'))}
                    >
                      <option value="">Select a top leader</option>
                      {choices.topLeaders.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Direct leader name"
                    htmlFor="directLeader"
                    index={4}
                    error={errorFor('directLeader')}
                  >
                    <select
                      id="directLeader"
                      value={form.directLeader}
                      onChange={updateField('directLeader')}
                      aria-invalid={Boolean(errorFor('directLeader'))}
                    >
                      <option value="">Select a direct leader</option>
                      {choices.directLeaders.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Rank"
                    htmlFor="rank"
                    index={5}
                    className="field-full"
                    error={errorFor('rank')}
                  >
                    <select
                      id="rank"
                      value={form.rank}
                      onChange={updateField('rank')}
                      aria-invalid={Boolean(errorFor('rank'))}
                    >
                      <option value="">Select your rank</option>
                      {RANKS.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </section>

              <section className="form-section">
                <SectionHeading
                  index="03"
                  title="Team & business volume"
                  description="Enter your current team size and business volume."
                />
                <div className="field-grid">
                  <Field
                    label="Direct team members number"
                    htmlFor="directTeam"
                    index={6}
                    error={errorFor('directTeam')}
                  >
                    <input
                      id="directTeam"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.directTeam}
                      onChange={updateField('directTeam')}
                      aria-invalid={Boolean(errorFor('directTeam'))}
                    />
                  </Field>

                  <Field
                    label="Total team members number"
                    htmlFor="totalTeam"
                    index={7}
                    error={errorFor('totalTeam')}
                  >
                    <input
                      id="totalTeam"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.totalTeam}
                      onChange={updateField('totalTeam')}
                      aria-invalid={Boolean(errorFor('totalTeam'))}
                    />
                  </Field>

                  <Field
                    label="Direct business volume"
                    htmlFor="directVolume"
                    index={8}
                    error={errorFor('directVolume')}
                  >
                    <input
                      id="directVolume"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.directVolume}
                      onChange={updateField('directVolume')}
                      aria-invalid={Boolean(errorFor('directVolume'))}
                    />
                  </Field>

                  <Field
                    label="Total business volume"
                    htmlFor="totalVolume"
                    index={9}
                    error={errorFor('totalVolume')}
                  >
                    <input
                      id="totalVolume"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.totalVolume}
                      onChange={updateField('totalVolume')}
                      aria-invalid={Boolean(errorFor('totalVolume'))}
                    />
                  </Field>
                </div>
              </section>

              <section className="form-section">
                <SectionHeading
                  index="04"
                  title="Security"
                  description="Create a password for this sample profile."
                />
                <div className="field-grid">
                  <Field
                    label="Password"
                    htmlFor="password"
                    index={10}
                    error={errorFor('password')}
                    hint="At least 8 characters"
                  >
                    <div className="password-wrap">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={updateField('password')}
                        aria-invalid={Boolean(errorFor('password'))}
                      />
                      <button
                        className="password-toggle"
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((visible) => !visible)}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </Field>

                  <Field
                    label="Confirm password"
                    htmlFor="confirmPassword"
                    index={11}
                    error={errorFor('confirmPassword')}
                  >
                    <div className="password-wrap">
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={updateField('confirmPassword')}
                        aria-invalid={Boolean(errorFor('confirmPassword'))}
                      />
                    </div>
                  </Field>
                </div>
              </section>
            </div>

            <div className="form-actions">
              <button className="skip-button" type="button" onClick={() => onContinue(null)}>
                Skip and explore the dashboard
                <ArrowRight size={15} />
              </button>
              <button className="submit-button" type="submit">
                Sign in
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
