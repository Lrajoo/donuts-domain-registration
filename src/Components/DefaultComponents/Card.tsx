import styled from "styled-components";

interface SimpleCardProps {
}

export const SimpleCard = styled.div<SimpleCardProps>`
  margin: 5px;
  padding: 20px;
  border: 2px solid black;
  background-color: white;
  border-radius: 5px;
`;