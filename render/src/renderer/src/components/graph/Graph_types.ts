export interface GraphProps {
  maxDistance: number
}

export interface GraphReference {
  newDistance: (distance: number) => void
}
