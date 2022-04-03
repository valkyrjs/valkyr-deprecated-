import React from "react";
import styled, { keyframes } from "styled-components";

import { assets } from "../Assets";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function PageLoader(): JSX.Element | null {
  return (
    <S.Container>
      <S.Logo src={assets.logo.toolkit} width={150} height={150} alt="Valkyr Logo" />
    </S.Container>
  );
}

/*
 |--------------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------------
 */

const pulseAnimation = keyframes`
  0% { transform: scale(0.95); }
  70% { transform: scale(1); }
  100% { transform: scale(0.95); }
`;

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  `,
  Logo: styled.img`
    width: 150px;
    height: auto;

    transform: scale(1);
    animation: ${pulseAnimation} 2s infinite;
  `
};
