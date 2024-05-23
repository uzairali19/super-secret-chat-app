import { ThemeChildProps } from '../../types'

const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"]

const Select: React.FC<ThemeChildProps> = ({ theme, setTheme }) => {

    const handleSelect = (theme: string) => {
        setTheme?.(theme)
    }

  return (
    <select
      name="theme"
      id="theme"
      className="select w-full max-w-xs"
      value={theme}
      onChange={(e) => handleSelect(e.target.value)}
      data-theme
    >
      {themes.map((theme) => (
        <option key={theme} value={theme}>{theme}</option>
      ))}
    </select>
  )
}

export default Select