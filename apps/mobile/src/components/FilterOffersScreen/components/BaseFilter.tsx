import {useAtom, useAtomValue} from 'jotai/index'
import {baseFilterDropdownDataAtom} from '../../../state/marketplace/atoms/filterAtoms'
import {Dropdown} from '../../Dropdown'
import {baseFilterTempAtom} from '../atom'

function BaseFilter(): JSX.Element {
  const baseFilterDropdownData = useAtomValue(baseFilterDropdownDataAtom)
  const [baseFilterTemp, setBaseFilterTemp] = useAtom(baseFilterTempAtom)

  return (
    <Dropdown
      size="large"
      variant="yellow"
      value={baseFilterTemp}
      data={baseFilterDropdownData}
      onChange={(item) => {
        setBaseFilterTemp(item.value)
      }}
    />
  )
}

export default BaseFilter
