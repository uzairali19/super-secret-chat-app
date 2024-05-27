import { LoginInputProps } from "../../types";
import styled from "styled-components";

const StyledInput = styled.input.attrs({
  className: "input",
})`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  background-color: #f2f2f7;
  margin-bottom: 10px;
  color: #000;
  ::placeholder {
    color: #000;
  }
`;

const LoginInput: React.FC<LoginInputProps> = ({
  name,
  setName,
  loginUser,
}) => {
  return (
    <StyledInput
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          loginUser();
        }
      }}
    />
  );
};

export default LoginInput;
