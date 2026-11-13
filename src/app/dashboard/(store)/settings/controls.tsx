"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { FormMessage, SubmitButton } from "@/components/form-bits";
import { Icon } from "@/components/icons";
import {
  saveStaff,
  saveTipRules,
  saveWorkingHours,
  saveZone,
  setDailyReportTime,
  setDefaultCurrency,
  setSetting,
  toggleCurrency,
  togglePaymentMethod,
  type SettingsState,
} from "@/app/dashboard/settings-actions";
import { PERMISSIONS, ROLE_PRESETS, encodePermissions, presetMatching, type Permission } from "@/lib/settings-model";

type Action = (s: SettingsState, f: FormData) => Promise<SettingsState>;

/** Sends one value to an action at once (a switch or a chip), with its result to show. */
function useInstant(action: Action) {
  const [state, dispatch] = useActionState(action, undefined);
  const [pending, start] = useTransition();
  const send = (fields: Record<string, string>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
    start(() => dispatch(fd));
  };
  return { state, send, pending };
}

function Inline({ state }: { state: SettingsState }) {
  if (!state?.error) return null;
  return (
    <p role="alert" className="m-0 text-[13px] font-bold text-error">
      {state.error}
    </p>
  );
}

/** A setting that's on or off, saved the moment it's flipped. */
export function SettingSwitch({ k, label, description, checked, disabled }: { k: string; label: string; description?: string; checked: boolean; disabled?: boolean }) {
  const { state, send, pending } = useInstant(setSetting);
  const [on, setOn] = useState(checked);
  useEffect(() => setOn(checked), [checked]);
  useEffect(() => {
    if (state?.error) setOn(checked);
  }, [state, checked]);
  return (
    <div className="flex flex-col gap-1 py-3">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-bold">{label}</div>
          {description && <div className="text-[13px] text-ink-2">{description}</div>}
        </div>
        <Switch
          on={on}
          label={label}
          disabled={disabled || pending}
          onClick={() => {
            setOn(!on);
            send({ key: k, value: String(!on) });
          }}
        />
      </div>
      <Inline state={state} />
    </div>
  );
}

export function Switch({ on, label, disabled, onClick }: { on: boolean; label: string; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-14 flex-none cursor-pointer rounded-full p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${on ? "justify-end bg-primary" : "justify-start bg-outline"}`}
    >
      <span className="h-6 w-6 rounded-full bg-white shadow" />
    </button>
  );
}

/** One choice among a few, as chips, saved when picked. */
export function SettingChoice({ k, value, options, label }: { k: string; value: string; options: { value: string; label: string }[]; label: string }) {
  const { state, send, pending } = useInstant(setSetting);
  const [cur, setCur] = useState(value);
  useEffect(() => setCur(value), [value]);
  useEffect(() => {
    if (state?.error) setCur(value);
  }, [state, value]);
  return (
    <div className="flex flex-col gap-1.5">
      <Chips
        label={label}
        options={options}
        isOn={(v) => v === cur}
        disabled={pending}
        onPick={(v) => {
          if (v === cur) return;
          setCur(v);
          send({ key: k, value: v });
        }}
      />
      <Inline state={state} />
    </div>
  );
}

function Chips({ label, options, isOn, onPick, disabled }: { label: string; options: { value: string; label: string }[]; isOn: (v: string) => boolean; onPick: (v: string) => void; disabled?: boolean }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={isOn(o.value)}
          disabled={disabled}
          onClick={() => onPick(o.value)}
          className={`chip h-10 disabled:opacity-70 ${isOn(o.value) ? "bg-primary text-white" : "bg-ground text-ink hover:bg-surface-high"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** The day of the month the monthly report goes: first, last, or a day 1–28. */
export function MonthlyDay({ value }: { value: string }) {
  const { state, send, pending } = useInstant(setSetting);
  const [cur, setCur] = useState(value);
  useEffect(() => setCur(value), [value]);
  const pick = (v: string) => {
    setCur(v);
    send({ key: "monthly_report_day", value: v });
  };
  const numbered = cur !== "first" && cur !== "last";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-2">Send on</span>
        <Chips
          label="Monthly report day"
          options={[
            { value: "first", label: "First day" },
            { value: "last", label: "Last day" },
          ]}
          isOn={(v) => v === cur}
          onPick={pick}
          disabled={pending}
        />
        <label className="flex items-center gap-2 text-sm text-ink-2">
          or day
          <select aria-label="Day of the month" value={numbered ? cur : ""} onChange={(e) => e.target.value && pick(e.target.value)} className="field h-10 w-20 px-2" disabled={pending}>
            <option value="">—</option>
            {Array.from({ length: 28 }, (_, i) => String(i + 1)).map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      <Inline state={state} />
    </div>
  );
}

export function DailyReportTime({ hour, minute }: { hour: number; minute: number }) {
  const [state, action] = useActionState(setDailyReportTime, undefined);
  const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <label htmlFor="report_time" className="text-sm text-ink-2">
        Time to send
      </label>
      <input id="report_time" name="time" type="time" step={1800} defaultValue={value} key={value} className="field h-10 w-32 px-3" />
      <SubmitButton className="btn btn-tonal h-10 px-4 text-sm" pendingText="Saving…">
        Save time
      </SubmitButton>
      {state && <span className={`text-[13px] font-bold ${state.error ? "text-error" : "text-success"}`}>{state.error ?? state.message}</span>}
    </form>
  );
}

/** Accepted payment methods: each chip turns one on or off. */
export function PaymentMethods({ options, accepted }: { options: { code: string; label: string }[]; accepted: string[] }) {
  const { state, send, pending } = useInstant(togglePaymentMethod);
  const [on, setOn] = useState(accepted);
  useEffect(() => setOn(accepted), [accepted]);
  return (
    <div className="flex flex-col gap-1.5">
      <Chips
        label="Accepted payment methods"
        options={options.map((o) => ({ value: o.code, label: o.label }))}
        isOn={(v) => on.includes(v)}
        disabled={pending}
        onPick={(v) => {
          setOn(on.includes(v) ? on.filter((x) => x !== v) : [...on, v]);
          send({ value: v });
        }}
      />
      <Inline state={state} />
    </div>
  );
}

/** Which currencies the store prices in, and the default every screen uses. */
export function Currencies({ options, accepted, current }: { options: { code: string; name: string }[]; accepted: string[]; current: string }) {
  const toggle = useInstant(toggleCurrency);
  const setDefault = useInstant(setDefaultCurrency);
  const pending = toggle.pending || setDefault.pending;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="label">Supported currencies</span>
        <Chips
          label="Supported currencies"
          options={options.map((o) => ({ value: o.code, label: `${o.code} · ${o.name}` }))}
          isOn={(v) => accepted.includes(v)}
          disabled={pending}
          onPick={(v) => toggle.send({ value: v })}
        />
        <Inline state={toggle.state} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="label">Default currency</span>
        <Chips label="Default currency" options={options.map((o) => ({ value: o.code, label: o.code }))} isOn={(v) => v === current} disabled={pending} onPick={(v) => v !== current && setDefault.send({ value: v })} />
        <span className="text-[13px] text-ink-2">
          Every price on every screen is shown and entered in it. Choosing one accepts it too. Changing it converts at today&apos;s rate, locked in, so changing back later restores the
          same figures.
        </span>
        <Inline state={setDefault.state} />
      </div>
    </div>
  );
}

/** The tip ladder: orders from an amount take a tip, a percentage or a flat amount. */
export function TipRules({ rules, currency }: { rules: { amount: number; tip: number; type: string }[]; currency: string }) {
  const [state, action] = useActionState(saveTipRules, undefined);
  const [type, setType] = useState(rules[0]?.type === "amount" ? "amount" : "percent");
  const [rows, setRows] = useState(rules.length ? rules.map((r) => ({ amount: String(r.amount), tip: String(r.tip) })) : [{ amount: "", tip: "" }]);
  const set = (i: number, patch: Partial<{ amount: string; tip: string }>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="rules" value={JSON.stringify(rows)} />
      <FormMessage state={state} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="label">Tip is a</span>
        <Chips
          label="Tip type"
          options={[
            { value: "percent", label: "Percentage" },
            { value: "amount", label: "Amount" },
          ]}
          isOn={(v) => v === type}
          onPick={setType}
        />
      </div>
      {rows.map((r, i) => (
        <div key={i} className="flex items-end gap-2">
          <label className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[13px] font-bold text-ink-2">Orders from ({currency})</span>
            <input value={r.amount} onChange={(e) => set(i, { amount: e.target.value })} inputMode="decimal" placeholder="e.g. 50000" className="field h-11" />
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[13px] font-bold text-ink-2">Tip ({type === "percent" ? "%" : currency})</span>
            <input value={r.tip} onChange={(e) => set(i, { tip: e.target.value })} inputMode="decimal" placeholder={type === "percent" ? "e.g. 5" : "e.g. 2000"} className="field h-11" />
          </label>
          <button type="button" aria-label="Remove tip rule" onClick={() => setRows(rows.filter((_, j) => j !== i))} className="flex h-11 w-11 flex-none items-center justify-center rounded-sm text-ink-2 hover:bg-surface-mid">
            <Icon name="close" size={18} />
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <SubmitButton className="btn btn-primary h-10 px-4 text-sm" pendingText="Saving…">
          Save tip rules
        </SubmitButton>
        <button type="button" onClick={() => setRows([...rows, { amount: "", tip: "" }])} className="btn btn-tonal h-10 px-4 text-sm">
          <Icon name="plus" size={16} /> Add rule
        </button>
      </div>
    </form>
  );
}

type Hour = { id: string; day: string; status: string; open_24_hours: boolean; open_minute_of_day: number; close_minute_of_day: number };
const clock = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** The week's opening hours, saved together. */
export function WorkingHours({ hours }: { hours: Hour[] }) {
  const [state, action] = useActionState(saveWorkingHours, undefined);
  const [rows, setRows] = useState(hours);
  useEffect(() => setRows(hours), [hours]);
  const set = (id: string, patch: Partial<Hour>) => setRows(rows.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  return (
    <form action={action} className="flex flex-col gap-1">
      <FormMessage state={state} />
      {rows.map((h) => {
        const open = h.status === "OPEN";
        return (
          <div key={h.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-surface-mid py-3 last:border-0">
            <input type="hidden" name="id" value={h.id} />
            <input type="hidden" name={`status_${h.id}`} value={h.status} />
            <span className="w-28 font-bold">{h.day}</span>
            <Chips
              label={`${h.day} open or closed`}
              options={[
                { value: "OPEN", label: "Open" },
                { value: "CLOSED", label: "Closed" },
              ]}
              isOn={(v) => v === h.status}
              onPick={(v) => set(h.id, { status: v })}
            />
            {open && (
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                <label className="flex min-h-10 items-center gap-2 text-sm font-bold">
                  <input type="checkbox" name={`allday_${h.id}`} checked={h.open_24_hours} onChange={(e) => set(h.id, { open_24_hours: e.target.checked })} className="h-5 w-5 accent-primary" />
                  24 hours
                </label>
                {!h.open_24_hours && (
                  <>
                    <input aria-label={`${h.day} opens`} type="time" step={1800} name={`open_${h.id}`} defaultValue={clock(h.open_minute_of_day)} className="field h-10 w-32 px-3" />
                    <span className="text-sm text-ink-2">to</span>
                    <input aria-label={`${h.day} closes`} type="time" step={1800} name={`close_${h.id}`} defaultValue={clock(h.close_minute_of_day)} className="field h-10 w-32 px-3" />
                  </>
                )}
              </div>
            )}
            {open && h.open_24_hours && <input type="hidden" name={`open_${h.id}`} value={clock(h.open_minute_of_day)} />}
            {open && h.open_24_hours && <input type="hidden" name={`close_${h.id}`} value={clock(h.close_minute_of_day)} />}
          </div>
        );
      })}
      <SubmitButton className="btn btn-primary mt-3 self-start" pendingText="Saving…">
        Save working hours
      </SubmitButton>
    </form>
  );
}

/** Adds a delivery zone, or edits one when given. */
export function ZoneForm({ zone, currency }: { zone?: { id: string; distance: number; price: number; delivery_time: number }; currency: string }) {
  const [state, action] = useActionState(saveZone, undefined);
  return (
    <form action={action} className="flex flex-col gap-3">
      {zone && <input type="hidden" name="id" value={zone.id} />}
      <FormMessage state={state} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-bold text-ink-2">Up to (km)</span>
          <input name="distance" inputMode="decimal" defaultValue={zone?.distance} placeholder="e.g. 5" className="field h-11" required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-bold text-ink-2">Price ({currency})</span>
          <input name="price" inputMode="decimal" defaultValue={zone?.price} placeholder="e.g. 3000" className="field h-11" required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-bold text-ink-2">Delivery time (mins)</span>
          <input name="delivery_time" inputMode="numeric" defaultValue={zone?.delivery_time} placeholder="e.g. 45" className="field h-11" required />
        </label>
      </div>
      <SubmitButton className="btn btn-primary h-10 self-start px-4 text-sm" pendingText="Saving…">
        {zone ? "Save zone" : "Add zone"}
      </SubmitButton>
    </form>
  );
}

/** Edits a staff member: name, role, admin, permissions, and a new pass key if typed. */
export function StaffForm({
  member,
  customAllowed,
}: {
  member: { id: string; name: string; role: string; isAdmin: boolean; permissions: Permission[] };
  customAllowed: boolean;
}) {
  const [state, action] = useActionState(saveStaff, undefined);
  const [admin, setAdmin] = useState(member.isAdmin);
  const [perms, setPerms] = useState<Permission[]>(member.permissions);
  const matching = presetMatching(perms);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="staff_id" value={member.id} />
      {admin && <input type="hidden" name="is_admin" value="on" />}
      {perms.map((p) => (
        <input key={p} type="hidden" name="permissions" value={p} />
      ))}
      <FormMessage state={state} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="label">Full names</span>
          <input name="name" defaultValue={member.name} className="field h-11" required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Role</span>
          <input name="role" defaultValue={member.role} placeholder="e.g. Cashier" className="field h-11" required />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="label">New pass key</span>
        <input name="pass_key" inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="off" placeholder="Leave blank to keep the current one" className="field h-11" />
        <span className="text-[13px] text-ink-2">6 digits. It replaces the old one on every till after the next sync.</span>
      </label>
      <div className="flex flex-col gap-1 rounded-md bg-surface-low p-4">
        <div className="flex items-center gap-4">
          <span className="flex-1 text-[15px] font-bold">Admin</span>
          <Switch on={admin} label="Admin" onClick={() => setAdmin(!admin)} />
        </div>
        <span className="text-[13px] text-ink-2">
          {admin
            ? "Admins can switch stores, edit store details and manage staff, including other admins."
            : "Staff can always sell, add clients and expenses, and count stock. Anything else is what's ticked below; an admin's pass key can allow the rest one action at a time."}
        </span>
      </div>
      {!admin && (
        <div className="flex flex-col gap-3 rounded-md bg-surface-low p-4">
          <span className="label">Permissions</span>
          <Chips
            label="Role presets"
            options={ROLE_PRESETS.map((r) => ({ value: r.key, label: r.label }))}
            isOn={(v) => encodePermissions(ROLE_PRESETS.find((r) => r.key === v)!.permissions) === encodePermissions(perms)}
            onPick={(v) => setPerms(ROLE_PRESETS.find((r) => r.key === v)!.permissions)}
          />
          <span className="text-[13px] text-ink-2">{matching ? `${matching}: as set out below.` : "Custom: as ticked below."}</span>
          {!customAllowed && <span className="text-[13px] text-ink-2">Your plan uses the ready-made roles. Choosing each permission on its own comes with Business.</span>}
          <div className="flex flex-col">
            {PERMISSIONS.map((p) => (
              <label key={p.code} className={`flex items-start gap-3 py-2 ${customAllowed ? "cursor-pointer" : "opacity-70"}`}>
                <input
                  type="checkbox"
                  checked={perms.includes(p.code)}
                  disabled={!customAllowed}
                  onChange={(e) => setPerms(e.target.checked ? [...perms, p.code] : perms.filter((x) => x !== p.code))}
                  className="mt-0.5 h-5 w-5 flex-none accent-primary"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-bold">{p.label}</span>
                  <span className="text-[13px] text-ink-2">{p.description}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      <SubmitButton className="btn btn-primary self-start" pendingText="Saving…">
        Save changes
      </SubmitButton>
    </form>
  );
}
