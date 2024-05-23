import { Select } from './select'
import { Toggle } from './toggle'
import { ThemeProps } from '../types'

const Theme: React.FC<ThemeProps> = ({ themeType,theme,setTheme }) => {
    return (
        <>
            {themeType === 'select' && <Select theme={theme} setTheme={setTheme}  />}
            {themeType === 'toggle' && <Toggle theme={theme} setTheme={setTheme} />}
        </>
    )
}

export default Theme;
