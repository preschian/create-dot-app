import { useProfile } from '../hooks/useProfile'

interface AvatarProps {
  name?: string
  address?: string
  status?: 'online' | 'none'
}

export default function Avatar({ name, address, status = 'none' }: AvatarProps) {
  const { displayName, displayAddress, getInitials } = useProfile({ name, address })

  const avatarClasses = [
    'avatar',
    'avatar-placeholder',
    status === 'online' ? 'avatar-online' : '',
  ].join(' ')

  return (
    <div className="flex items-center gap-3">
      <div className={avatarClasses}>
        <div className="w-8 bg-neutral text-neutral-content rounded-full">
          <span className="text-xs flex items-center justify-center h-full">
            {getInitials(displayName || displayAddress)}
          </span>
        </div>
      </div>
      <div>
        {displayName ? <div className="text-xs text-black font-medium">{displayName}</div> : null}
        {displayAddress ? <div className="text-xs text-gray-400">{displayAddress}</div> : null}
      </div>
    </div>
  )
}
