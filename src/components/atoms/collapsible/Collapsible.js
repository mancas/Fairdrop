// Copyright 2019 The FairDataSociety Authors
// This file is part of the FairDataSociety library.
//
// The FairDataSociety library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The FairDataSociety library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the FairDataSociety library. If not, see <http://www.gnu.org/licenses/>.

import React, { useRef } from 'react'
import styled, { css } from 'styled-components/macro'

const CollapsibleWrapper = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  transition: max-height 200ms;

  ${({ show, $height }) => css`
    max-height: ${show ? `${$height}px` : 0};
    background: ${({ theme }) => theme.colors.white.main};
    transition: max-height ${show ? '200ms' : '100ms'};
  `};
`

export const Collapsible = function Collapsible({ children, show }) {
  const contentRef = useRef()

  return (
    <CollapsibleWrapper aria-expanded={show} show={show} $height={contentRef?.current?.offsetHeight ?? 0}>
      {/* 
          With flex the margin is added to element height
          calculated here: contentRef.current.offsetHeight.
          Using inline styles because work faster than SC
      */}
      <div style={{ display: 'flex', flexDirection: 'column' }} ref={contentRef}>
        {children}
      </div>
    </CollapsibleWrapper>
  )
}
