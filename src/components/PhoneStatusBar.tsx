import { useClock } from "../hooks/useClock";

type PhoneStatusBarProps = {
  activeCount: number;
  totalCount: number;
};

export function PhoneStatusBar({ activeCount, totalCount }: PhoneStatusBarProps) {
  const clock = useClock();

  return (
    <div
      className="phone-status"
      aria-label={`${activeCount} widgets actifs sur ${totalCount}`}
    >
      <span>{clock.time}</span>
      <span className="status-summary">5G</span>
      <span className="status-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
