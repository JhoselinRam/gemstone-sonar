import Button from '../button/Button'
import Gear from '../svg_icons/gear/Gear'

function Settings(): JSX.Element {
  return (
    <Button className="m-2">
      <Gear fill="#242e3d" glowOnHover></Gear>
    </Button>
  )
}

export default Settings
