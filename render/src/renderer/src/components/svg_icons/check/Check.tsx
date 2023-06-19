import { CheckIconProps } from './Check_types'

function Check({ fill = 'black', fillOpacity = 1, size }: CheckIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      fillOpacity={fillOpacity}
    >
      <path
        fillRule="evenodd"
        d="M20.61 5.207a1 1 0 01.183 1.403l-10 13a1 1 0 01-1.5.097l-5-5a1 1 0 011.414-1.414l4.195 4.195L19.207 5.39a1 1 0 011.403-.183z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

export default Check
