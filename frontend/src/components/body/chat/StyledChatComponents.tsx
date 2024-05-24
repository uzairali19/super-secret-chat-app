import styled from "styled-components";

export const ChatInput = styled.textarea`
  padding: 1rem;
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  width: 100%;
  height: 8rem;
  resize: none;
  background-color: #f2f2f7;
  outline: none;
  color: #000;

  &::placeholder {
    color: black; /* Change the placeholder color here */
  }
`;
