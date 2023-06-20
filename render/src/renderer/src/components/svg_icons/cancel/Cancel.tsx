import { CancelIconProps } from './Canel_types'
import styles from './Cancel.module.css'

function Cancel({
  size,
  fill = 'black',
  fillOpacity = 1,
  glowOnHover
}: CancelIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={fill}
      fillOpacity={fillOpacity}
      viewBox="0 0 32 32"
      className={`${styles.isActive} ${glowOnHover ? styles.shouldGlow : ''}`}
    >
      <path d="M19.587 16.001l6.096 6.096a1.015 1.015 0 010 1.435l-2.151 2.151a1.015 1.015 0 01-1.435 0L16 19.587l-6.097 6.096a1.014 1.014 0 01-1.434 0l-2.152-2.151a1.015 1.015 0 010-1.435l6.097-6.096-6.097-6.097a1.015 1.015 0 010-1.435L8.47 6.318a1.014 1.014 0 011.434 0L16 12.415l6.097-6.097a1.015 1.015 0 011.435 0l2.151 2.152a1.015 1.015 0 010 1.435l-6.096 6.096z"></path>
    </svg>
  )
}

export default Cancel
