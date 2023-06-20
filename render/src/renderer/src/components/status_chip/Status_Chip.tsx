import Cancel from '../svg_icons/cancel/Cancel'
import Check from '../svg_icons/check/Check'
import { StatusChipProps } from './Status_Chip_types'

function StatusChip({
  children,
  bgEnable,
  bgDisable,
  enable,
  textDisable,
  textEnable
}: StatusChipProps): JSX.Element {
  return (
    <div
      className="flex flex-row items-center justify-center gap-2 text-sm rounded-full py-0 px-2"
      style={{
        backgroundColor: enable ? bgEnable : bgDisable,
        color: enable ? textEnable : textDisable
      }}
    >
      <div className="p-0 m-0">{children}</div>
      <p className="p-0 m-0">
        {enable ? (
          <Check size="1em" fill={textEnable} width={2} />
        ) : (
          <Cancel size="1em" fill={textDisable} />
        )}
      </p>
    </div>
  )
}

export default StatusChip
