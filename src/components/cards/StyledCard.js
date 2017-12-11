/*
 * @flow
 */

import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: #fefefe;
  border: 1px solid #c5d5e5;
  border-radius: 4px;
  box-shadow: 0 2px 8px -2px rgba(17, 51, 85, 0.15);
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: normal;
  padding: 30px;
  margin: 0 20px;
  h1 {
    font-size: 22px;
    font-weight: 600;
    margin: 10px 0;
    padding: 0;
  }
  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 18px 0 10px 0;
    padding: 0;
  }
  h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 16px 0 8px 0;
    padding: 0;
  }
  p {
    margin: 0;
    padding: 0;
  }
  section {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-top: 10px;
  }
`;

export default StyledCard;
