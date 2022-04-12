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

import React, { memo } from 'react'
import styled, { css } from 'styled-components/macro'

export const NavItemLi = styled.li`
  position: relative;
  list-style: none;
`

export const NavItemText = styled.a`
  position: relative;
  display: inline-block;
  width: 100%;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;

  ${({ theme, active, size = 'm' }) => css`
    color: ${theme.colors.black.main};
    text-decoration-line: ${active ? 'underline' : 'none'};

    &:hover {
      text-decoration-line: ${active ? 'underline' : 'none'};
    }

    ${css(theme.components.navItem.sizes[size])};
  `};
`

export const NavItem = memo(function NavItem({ children, to, href, onClick, size, active, ...rest }) {
  const setHandleClick = () => {
    if (onClick || (href && to)) {
      return (e) => {
        if (href && to) {
          e.preventDefault()
        }
        onClick?.(e)
      }
    }
    return undefined
  }

  const shitchElement = () => {
    if (to) {
      return 'a'
    }

    if (onClick) {
      return 'button'
    }

    return 'span'
  }

  return (
    <NavItemLi {...rest}>
      <NavItemText as={shitchElement()} data-to={to} href={href} onClick={setHandleClick()} size={size} active={active}>
        {children}
      </NavItemText>
    </NavItemLi>
  )
})
