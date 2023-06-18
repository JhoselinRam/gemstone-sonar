import { GearIconProps } from './Gear_types'
import styles from './Gear.module.css'

function GearIcon({
  fill = 'black',
  fillOpacity = 1,
  glowOnHover,
  size
}: GearIconProps): JSX.Element {
  return (
    <div className={`${glowOnHover && styles.shouldGlow}`} style={{ width: size, height: size }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="-130 -130 2180 2180"
        className={`${styles.isActive}`}
      >
        <defs>
          <filter id="glow" width="200%" height="200%" dx="0" dy="0">
            <feMorphology in="SourceGraphic" operator="dilate" radius={15} result="tickened" />
            <feGaussianBlur in="tickened" stdDeviation={200} result="blurred" />
            <feFlood floodColor="white" floodOpacity="0.2" result="glowColor" />
            <feComposite in="glowColor" in2="blurred" operator="in" result="colored" />
            <feBlend in="SourceGraphic" in2="colored" mode="normal" />
          </filter>
        </defs>
        <path
          fillRule="evenodd"
          fill={fill}
          fillOpacity={fillOpacity}
          d="M1703.534 960c0-41.788-3.84-84.48-11.633-127.172l210.184-182.174-199.454-340.856-265.186 88.433c-66.974-55.567-143.323-99.389-223.85-128.415L1158.932 0h-397.78L706.49 269.704c-81.43 29.138-156.423 72.282-223.962 128.414l-265.073-88.32L18 650.654l210.184 182.174C220.39 875.52 216.55 918.212 216.55 960s3.84 84.48 11.633 127.172L18 1269.346l199.454 340.856 265.186-88.433c66.974 55.567 143.322 99.389 223.85 128.415L761.152 1920h397.779l54.663-269.704c81.318-29.138 156.424-72.282 223.963-128.414l265.073 88.433 199.454-340.856-210.184-182.174c7.793-42.805 11.633-85.497 11.633-127.285m-743.492 395.294c-217.976 0-395.294-177.318-395.294-395.294 0-217.976 177.318-395.294 395.294-395.294 217.977 0 395.294 177.318 395.294 395.294 0 217.976-177.317 395.294-395.294 395.294"
        ></path>
      </svg>
    </div>
  )
}

export default GearIcon
