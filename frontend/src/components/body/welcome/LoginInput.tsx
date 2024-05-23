import { LoginInputProps } from "../../types";
import styled from 'styled-components'

const StyledInput = styled.input.attrs({
    className: "input",
    placeholderTextColor: "black"
})`
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    font-size: 16px;
    background-color: #F2F2F7;
    margin-bottom: 10px;
`

const LoginInput: React.FC<LoginInputProps> = ({ name, setName, loginUser }) => {
  return (
    <StyledInput
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      onKeyDown={(e) => {
          if(e.key === "Enter"){
              loginUser();
          }
      }}
      />
  )
}

export default LoginInput